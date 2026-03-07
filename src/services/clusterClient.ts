import { CONNECT_TO_CLUSTER } from "../api";
import type { ConnectResponse } from "../types/api";

// Cached token state
let cachedClusterID: string | null = null;
let cachedToken: string | null = null;
let cachedEndpoint: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Fetch a short-lived JWT token for direct cluster communication.
 *
 * Calls the ButteryAI-Server `/api/api-keys/connect` endpoint, which returns
 * a 5-minute JWT signed with HMAC-SHA256 and the cluster's connection info.
 */
export async function getClusterToken(
  clusterID: string,
): Promise<{ token: string; endpoint: string; expiresAt: number }> {
  // Return cached token if still valid and for the same cluster (refresh 30s before expiry)
  const now = Date.now();
  if (cachedToken && cachedEndpoint && cachedClusterID === clusterID && tokenExpiresAt - now > 30_000) {
    return { token: cachedToken, endpoint: cachedEndpoint, expiresAt: tokenExpiresAt };
  }

  const { url, options } = CONNECT_TO_CLUSTER(clusterID);
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to get cluster token: ${res.status} ${text}`);
  }

  const data: ConnectResponse = await res.json();
  const connectPort = data.connectionInfo.connectPort ?? data.connectionInfo.port;
  const endpoint = `${data.connectionInfo.ipAddress}:${connectPort}`;
  const expiresAt = new Date(data.expiresAt).getTime();

  // Cache the token
  cachedClusterID = clusterID;
  cachedToken = data.token;
  cachedEndpoint = endpoint;
  tokenExpiresAt = expiresAt;

  return { token: data.token, endpoint, expiresAt };
}

/** Clear the cached token (e.g., on logout or connection failure). */
export function clearClusterToken(): void {
  cachedClusterID = null;
  cachedToken = null;
  cachedEndpoint = null;
  tokenExpiresAt = 0;
}

export interface StreamChunk {
  payload: string;
  timestamp: number;
}

/**
 * Extract the display text from a decoded QueryOutput JSON payload.
 *
 * Each streamed chunk is a full QueryOutput object (not a delta).
 * The message text lives inside `content[]` which can be either a plain
 * string or an object with nested `content[].text` fields.
 *
 * This mirrors the Swift `QueryOutputWrapper.append()` logic in the
 * native client.
 */
function extractTextFromQueryOutput(parsed: Record<string, unknown>): string | null {
  const content = parsed.content as Array<Record<string, unknown>> | undefined;
  if (!content) return null;

  for (const item of content) {
    // Object message: { content: [{ text, type }], entity, status }
    if (Array.isArray(item.content)) {
      const parts = item.content as Array<Record<string, unknown>>;
      const texts: string[] = [];
      for (const part of parts) {
        if (typeof part.text === "string" && part.text) {
          texts.push(part.text);
        } else if (typeof part.refusal === "string" && part.refusal) {
          texts.push(part.refusal);
        }
      }
      if (texts.length > 0) return texts.join("");
    }
    // String message: the item itself is a string (encoded via singleValueContainer)
    if (typeof item === "string" && item) {
      return item;
    }
  }
  return null;
}

/**
 * Send a query directly to the DAIS cluster via ConnectRPC.
 *
 * POSTs to `https://<endpoint>/dais.CoreSystem/Handle` with a Bearer JWT,
 * then parses the SSE stream and calls `onChunk` for each data payload.
 *
 * @returns The decoded final text, or throws on error.
 */
export async function queryCluster(
  endpoint: string,
  token: string,
  query: string,
  nodeId?: string,
  onChunk?: (decodedText: string) => void,
): Promise<string> {
  const protocol = endpoint.startsWith("localhost") || endpoint.startsWith("127.0.0.1")
    ? "http"
    : "https";
  const url = `${protocol}://${endpoint}/dais.CoreSystem/Handle`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      ...(nodeId ? { nodeId } : {}),
      stream: true,
    }),
  });

  if (res.status === 401) {
    clearClusterToken();
    throw new Error("Cluster auth failed — token may be expired");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cluster query failed: ${res.status} ${text}`);
  }

  // Parse SSE stream
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let latestText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process complete SSE events (delimited by double newline)
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      if (!event.trim()) continue;

      // Extract data from "data: {...}" lines
      const dataLine = event
        .split("\n")
        .find((line) => line.startsWith("data: "));
      if (!dataLine) continue;

      const jsonStr = dataLine.slice("data: ".length);
      try {
        const parsed = JSON.parse(jsonStr);

        if (parsed.done) {
          // Stream complete
          return latestText;
        }

        if (parsed.error) {
          throw new Error(parsed.error);
        }

        if (parsed.payload) {
          // Decode base64 payload → JSON QueryOutput
          // Each chunk contains the full accumulated text (not a delta),
          // so we replace rather than append — matching the native client.
          const decoded = atob(parsed.payload);
          try {
            const queryOutput = JSON.parse(decoded);
            const extracted = extractTextFromQueryOutput(queryOutput);
            if (extracted !== null) {
              latestText = extracted;
              onChunk?.(latestText);
            }
          } catch {
            // If payload isn't valid JSON, treat as raw text (replace)
            if (decoded) {
              latestText = decoded;
              onChunk?.(latestText);
            }
          }
        }
      } catch (e) {
        if (e instanceof SyntaxError) {
          // Skip malformed JSON
          continue;
        }
        throw e;
      }
    }
  }

  return latestText;
}
