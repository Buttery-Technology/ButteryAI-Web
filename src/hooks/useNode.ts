import { useEffect, useState } from "react";
import { GET_NODE, GET_NODE_HISTORY } from "../api";
import type { NodeResponse, NodeHistoryEntry } from "../types/api";

export function useNode(nodeId: string | undefined, initialNode?: NodeResponse | null) {
  const [node, setNode] = useState<NodeResponse | null>(initialNode ?? null);
  const [history, setHistory] = useState<NodeHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(!initialNode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nodeId) fetchNode(nodeId);
  }, [nodeId]);

  async function fetchNode(id: string) {
    try {
      setIsLoading(true);
      const { url, options } = GET_NODE(id);
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch node");

      const data: NodeResponse = await response.json();
      setNode(data);

      // Fetch history in parallel (non-blocking)
      fetchHistory(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load node");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchHistory(id: string) {
    try {
      const { url, options } = GET_NODE_HISTORY(id);
      const response = await fetch(url, options);
      if (!response.ok) return;

      const data = await response.json();
      setHistory(data.entries ?? []);
    } catch {
      // History is supplementary — don't fail on it
    }
  }

  return { node, history, isLoading, error };
}
