import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useNode } from "../../hooks/useNode";
import { Menu } from "./Menu";
import { New } from "./New";
import { Overview } from "./Overview";
import { Settings } from "./Settings";
import { Metrics } from "./Metrics";

const Node = () => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  // segments: ["node", nodeId, "overview"] or ["node", "new"]
  const isNewRoute = segments[1] === "new";
  const nodeId = !isNewRoute && segments[1] ? segments[1] : undefined;

  const { node, history, isLoading } = useNode(nodeId);

  return (
    <>
      {!isNewRoute && <Menu node={node} isLoading={isLoading} nodeId={nodeId} />}
      <Routes>
        {/* Legacy route without nodeId — redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="new" element={<New />} />
        {/* Routes with nodeId */}
        <Route path="overview" element={<Overview node={node} history={history} isLoading={isLoading} />} />
        <Route path=":nodeId" element={<Navigate to="overview" replace />} />
        <Route path=":nodeId/overview" element={<Overview node={node} history={history} isLoading={isLoading} />} />
        <Route path=":nodeId/settings" element={<Settings node={node} />} />
        <Route path=":nodeId/metrics" element={<Metrics node={node} isLoading={isLoading} />} />
      </Routes>
    </>
  );
};

export default Node;
