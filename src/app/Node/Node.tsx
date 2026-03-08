import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useNodeDetail } from "../../hooks/useNodeDetail";
import type { NodeResponse, NetworkInfo } from "../../types/api";
import { Menu } from "./Menu";
import { New } from "./New";
import { Overview } from "./Overview";
import { Settings } from "./Settings";
import { Customize } from "./Customize";
// import { Metrics } from "./Metrics";

const Node = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  // segments: ["node", nodeName, "overview"] or ["node", "new"]
  const isNewRoute = segments[1] === "new";
  const nodeName = !isNewRoute && segments[1] ? decodeURIComponent(segments[1]) : undefined;

  // Use node data passed via router state from the dashboard (avoids re-fetch)
  const routerState = location.state as { node?: NodeResponse; clusterConnectionInfo?: NetworkInfo; clusterID?: string } | null;
  const stateNode = routerState?.node ?? null;
  const clusterConnectionInfo = routerState?.clusterConnectionInfo;
  const clusterID = routerState?.clusterID;

  // useNodeDetail fetches the full detail endpoint (node + server-driven cards)
  const nodeId = stateNode?.id;
  const { node, overviewCards, valueCards, trustCards, actions, isLoading } = useNodeDetail(nodeId, stateNode);

  return (
    <>
      {!isNewRoute && <Menu node={node} isLoading={isLoading} nodeName={nodeName} />}
      <Routes>
        {/* Legacy route without nodeName — redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="new" element={<New />} />
        {/* Routes with nodeName */}
        <Route path="overview" element={<Overview node={node} clusterID={clusterID} overviewCards={overviewCards} isLoadingDetail={isLoading} />} />
        <Route path=":nodeName" element={<Navigate to="overview" replace />} />
        <Route path=":nodeName/overview" element={<Overview node={node} clusterID={clusterID} overviewCards={overviewCards} isLoadingDetail={isLoading} />} />
        <Route path=":nodeName/customize" element={<Customize node={node} />} />
        <Route path=":nodeName/settings" element={<Settings clusterConnectionInfo={clusterConnectionInfo} clusterID={clusterID} valueCards={valueCards} trustCards={trustCards} actions={actions} isLoadingDetail={isLoading} />} />
        {/* <Route path=":nodeName/metrics" element={<Metrics node={node} isLoading={isLoading} />} /> */}
      </Routes>
    </>
  );
};

export default Node;
