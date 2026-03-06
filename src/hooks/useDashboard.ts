import { useEffect, useState } from "react";
import { GET_DASHBOARD } from "../api";
import type { SummaryCard, ClusterStatus, NodeResponse, RawClusterStatus } from "../types/api";
import { parseClusterStatus } from "../types/api";

export function useDashboard() {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);
  const [valueCards, setValueCards] = useState<SummaryCard[]>([]);
  const [trustCards, setTrustCards] = useState<SummaryCard[]>([]);
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

      const data = await response.json();
      setSummaryCards((data.summaryCards ?? []).sort((a: SummaryCard, b: SummaryCard) => a.order - b.order));
      setValueCards((data.valueCards ?? []).sort((a: SummaryCard, b: SummaryCard) => a.order - b.order));
      setTrustCards((data.trustCards ?? []).sort((a: SummaryCard, b: SummaryCard) => a.order - b.order));

      if (data.clusterStatus) {
        const parsed = parseClusterStatus(data.clusterStatus as RawClusterStatus);
        setClusterStatus(parsed);

        if (parsed.status === "online") {
          setNodes(parsed.cluster.nodes);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  return { summaryCards, valueCards, trustCards, clusterStatus, nodes, isLoading, error, refetch: fetchDashboard };
}
