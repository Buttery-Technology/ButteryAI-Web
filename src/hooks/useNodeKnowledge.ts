import { useCallback, useState } from "react";
import { GET_NODE_KNOWLEDGE, CREATE_NODE_KNOWLEDGE, UNLINK_NODE_KNOWLEDGE } from "../api";
import type { NodeKnowledge } from "../types/api";

export function useNodeKnowledge(nodeId?: string) {
  const [items, setItems] = useState<NodeKnowledge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKnowledge = useCallback(async () => {
    if (!nodeId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { url, options } = GET_NODE_KNOWLEDGE(nodeId);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to fetch knowledge");
      const data = await res.json();
      setItems(data.knowledge ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load knowledge");
    } finally {
      setIsLoading(false);
    }
  }, [nodeId]);

  const addKnowledge = useCallback(async (data: {
    name: string;
    description: string;
    underlyingDataType: string;
    underlyingData?: string;
    underlyingDataURL?: string;
    categories?: string[];
    tags?: string[];
  }) => {
    if (!nodeId) return false;
    setError(null);
    try {
      const { url, options } = CREATE_NODE_KNOWLEDGE(nodeId, data);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to add knowledge");
      await fetchKnowledge();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add knowledge");
      return false;
    }
  }, [nodeId, fetchKnowledge]);

  const removeKnowledge = useCallback(async (knowledgeId: string) => {
    if (!nodeId) return false;
    setError(null);
    try {
      const { url, options } = UNLINK_NODE_KNOWLEDGE(nodeId, knowledgeId);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to remove knowledge");
      setItems((prev) => prev.filter((k) => k.knowledgeID !== knowledgeId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove knowledge");
      return false;
    }
  }, [nodeId]);

  return { items, isLoading, error, fetchKnowledge, addKnowledge, removeKnowledge };
}
