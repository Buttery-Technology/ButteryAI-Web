import { Route, Routes } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import { Menu } from "./Menu";
import { Cluster } from "./Cluster";
import { Chat } from "./Chat";
import { Settings } from "./Settings";
// import { Training } from "./Training";

const Dashboard = () => {
  const dashboard = useDashboard();

  return (
    <>
      <Menu clusterStatus={dashboard.clusterStatus} />
      <Routes>
        <Route path="/" element={<Cluster summaryCards={dashboard.summaryCards} nodes={dashboard.nodes} isLoading={dashboard.isLoading} />} />
        <Route path="chat" element={<Chat />} />
        {/* <Route path="training" element={<Training />} /> */}
        <Route path="settings" element={<Settings summaryCards={dashboard.summaryCards} />} />
      </Routes>
    </>
  );
};

export default Dashboard;
