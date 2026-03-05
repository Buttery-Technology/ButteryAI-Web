import { useCallback, useEffect, useRef, useState } from "react";
import {
  getClusterToken,
  queryCluster,
  clearClusterToken,
} from "../services/clusterClient";

interface ClusterConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface UseClusterConnectionReturn extends ClusterConnectionState {
  /**
   * Send a query directly to the DAIS cluster.
   *
   * Checks that the connection is established before sending. If the token
   * is missing or expired, re-connects automatically before the query.
   *
   * @returns The full response text, or null if the direct connection fails.
   */
  sendQuery: (
    text: string,
    nodeId?: string,
    onChunk?: (partialText: string) => void,
  ) => Promise<string | null>;
  /** Manually trigger a connection (token fetch). Called automatically on mount. */
  connect: () => Promise<boolean>;
  /** Disconnect and clear cached token. */
  disconnect: () => void;
}

/**
 * React hook for direct browser → DAIS cluster communication via ConnectRPC.
 *
 * Connects eagerly on mount (fetches JWT token + cluster endpoint) so the
 * connection is ready before the user sends their first query. If the
 * connection drops or the token expires, `sendQuery` re-establishes it
 * automatically before retrying.
 */
export function useClusterConnection(
  clusterID: string | undefined,
): UseClusterConnectionReturn {
  const [state, setState] = useState<ClusterConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const tokenRef = useRef<string | null>(null);
  const endpointRef = useRef<string | null>(null);
  const expiresAtRef = useRef<number>(0);

  const connect = useCallback(async (): Promise<boolean> => {
    if (!clusterID) return false;

    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));
      const { token, endpoint, expiresAt } = await getClusterToken(clusterID);
      tokenRef.current = token;
      endpointRef.current = endpoint;
      expiresAtRef.current = expiresAt;
      setState({ isConnected: true, isConnecting: false, error: null });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed";
      setState({ isConnected: false, isConnecting: false, error: message });
      return false;
    }
  }, [clusterID]);

  // Connect eagerly on mount (and when clusterID changes)
  useEffect(() => {
    if (clusterID) {
      connect();
    }
  }, [clusterID, connect]);

  /** Check whether the current token is still valid (with 30s buffer). */
  const isTokenValid = useCallback((): boolean => {
    return (
      tokenRef.current !== null &&
      endpointRef.current !== null &&
      expiresAtRef.current - Date.now() > 30_000
    );
  }, []);

  const sendQuery = useCallback(
    async (
      text: string,
      nodeId?: string,
      onChunk?: (partialText: string) => void,
    ): Promise<string | null> => {
      // Verify connection is established; reconnect if token is missing or expired
      if (!isTokenValid()) {
        const ok = await connect();
        if (!ok) return null;
      }

      const token = tokenRef.current!;
      const endpoint = endpointRef.current!;

      try {
        return await queryCluster(endpoint, token, text, nodeId, onChunk);
      } catch (err) {
        // On auth failure, force a fresh token and retry once
        if (err instanceof Error && err.message.includes("auth failed")) {
          clearClusterToken();
          const ok = await connect();
          if (!ok) return null;
          try {
            return await queryCluster(
              endpointRef.current!,
              tokenRef.current!,
              text,
              nodeId,
              onChunk,
            );
          } catch {
            // Retry also failed — fall through
          }
        }

        const message = err instanceof Error ? err.message : "Query failed";
        setState((prev) => ({ ...prev, error: message, isConnected: false }));
        return null;
      }
    },
    [connect, isTokenValid],
  );

  const disconnect = useCallback(() => {
    clearClusterToken();
    tokenRef.current = null;
    endpointRef.current = null;
    expiresAtRef.current = 0;
    setState({ isConnected: false, isConnecting: false, error: null });
  }, []);

  return {
    ...state,
    sendQuery,
    connect,
    disconnect,
  };
}
