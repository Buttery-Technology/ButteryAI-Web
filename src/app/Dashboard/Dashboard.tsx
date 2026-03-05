import { Route, Routes } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import { Menu } from "./Menu";
import { Cluster } from "./Cluster";
import { Chat } from "./Chat";
import { Settings } from "./Settings";
import { APIKeys } from "./Settings/APIKeys";
// import { Training } from "./Training";

const Dashboard = () => {
  const dashboard = useDashboard();

  const clusterID =
    dashboard.clusterStatus?.status === "online"
      ? dashboard.clusterStatus.cluster.clusterID
      : undefined;

  const clusterConnectionInfo =
    dashboard.clusterStatus?.status === "online"
      ? dashboard.clusterStatus.cluster.connectionInfo
      : undefined;

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Cluster summaryCards={dashboard.summaryCards} nodes={dashboard.nodes} isLoading={dashboard.isLoading} clusterConnectionInfo={clusterConnectionInfo} clusterID={clusterID} />} />
        <Route path="chat" element={<Chat />} />
        {/* <Route path="training" element={<Training />} /> */}
        <Route path="settings" element={<Settings summaryCards={dashboard.summaryCards} />} />
        <Route path="api-keys" element={<APIKeys clusterID={clusterID} />} />
      </Routes>
    </>
  );
};

export default Dashboard;
