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
  let fullText = "";

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
          return fullText;
        }

        if (parsed.error) {
          throw new Error(parsed.error);
        }

        if (parsed.payload) {
          // Decode base64 payload
          const decoded = atob(parsed.payload);
          fullText += decoded;
          onChunk?.(fullText);
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

  return fullText;
}
