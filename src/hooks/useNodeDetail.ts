import { useCallback, useEffect, useState } from "react";
import { GET_NODE_DETAIL } from "../api";
import type { NodeDetailResponse, SummaryCard, NodeResponse, NodeAction, NodeAIModel, NodeExtension } from "../types/api";

export function useNodeDetail(nodeId: string | undefined, initialNode?: NodeResponse | null) {
  const [node, setNode] = useState<NodeResponse | null>(initialNode ?? null);
  const [overviewCards, setOverviewCards] = useState<SummaryCard[]>([]);
  const [valueCards, setValueCards] = useState<SummaryCard[]>([]);
  const [trustCards, setTrustCards] = useState<SummaryCard[]>([]);
  const [actions, setActions] = useState<NodeAction[]>([]);
  const [aiModel, setAIModel] = useState<NodeAIModel | null>(null);
  const [nodeExtension, setNodeExtension] = useState<NodeExtension | null>(null);
  const [isLoading, setIsLoading] = useState(!initialNode);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const { url, options } = GET_NODE_DETAIL(id);
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch node detail");

      const data: NodeDetailResponse = await response.json();
      setNode(data.node);
      setOverviewCards(data.overviewCards);
      setValueCards(data.valueCards);
      setTrustCards(data.trustCards);
      setActions(data.actions ?? []);
      setAIModel(data.aiModel ?? null);
      setNodeExtension(data.extension ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load node detail");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (nodeId) fetchDetail(nodeId);
  }, [nodeId, fetchDetail]);

  const refetch = useCallback(() => {
    if (nodeId) fetchDetail(nodeId);
  }, [nodeId, fetchDetail]);

  return { node, overviewCards, valueCards, trustCards, actions, aiModel, nodeExtension, isLoading, error, refetch };
}
