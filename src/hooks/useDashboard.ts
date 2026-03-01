import { useEffect, useState } from "react";
import { GET_DASHBOARD } from "../api";
import type { DashboardResponse, SummaryCard, ClusterStatus, NodeResponse } from "../types/api";

export function useDashboard() {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);
  const [clusterStatus, setClusterStatus] = useState<ClusterStatus | null>(null);
  const [nodes, setNodes] = useState<NodeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      setIsLoading(true);
      const { url, options } = GET_DASHBOARD();
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch dashboard");

      const data: DashboardResponse = await response.json();
      setSummaryCards(data.summaryCards.sort((a, b) => a.order - b.order));
      setClusterStatus(data.clusterStatus);

      if (data.clusterStatus.status === "online") {
        setNodes(data.clusterStatus.cluster.nodes);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  return { summaryCards, clusterStatus, nodes, isLoading, error, refetch: fetchDashboard };
}
