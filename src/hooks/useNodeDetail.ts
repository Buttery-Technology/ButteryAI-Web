import { useEffect, useState } from "react";
import { GET_NODE_DETAIL } from "../api";
import type { NodeDetailResponse, SummaryCard, NodeResponse, NodeAction } from "../types/api";

export function useNodeDetail(nodeId: string | undefined, initialNode?: NodeResponse | null) {
  const [node, setNode] = useState<NodeResponse | null>(initialNode ?? null);
  const [overviewCards, setOverviewCards] = useState<SummaryCard[]>([]);
  const [valueCards, setValueCards] = useState<SummaryCard[]>([]);
  const [trustCards, setTrustCards] = useState<SummaryCard[]>([]);
  const [actions, setActions] = useState<NodeAction[]>([]);
  const [isLoading, setIsLoading] = useState(!initialNode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nodeId) fetchDetail(nodeId);
  }, [nodeId]);

  async function fetchDetail(id: string) {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load node detail");
    } finally {
      setIsLoading(false);
    }
  }

  return { node, overviewCards, valueCards, trustCards, actions, isLoading, error };
}
