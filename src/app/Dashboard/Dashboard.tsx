import { Navigate, Route, Routes } from "react-router-dom";
import { Menu } from "./Menu";
import { Hive } from "./Hive";
import { Chat } from "./Chat";
import { Settings } from "./Settings";

const Dashboard = () => (
  <>
    <Menu />
    <Routes>
      <Route path="/" element={<Navigate to="hive" />} />
      <Route path="hive" element={<Hive />} />
      <Route path="chat" element={<Chat />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  </>
);

export default Dashboard;
