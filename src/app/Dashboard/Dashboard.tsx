import { Route, Routes } from "react-router-dom";
import { Menu } from "./Menu";
import { Hive } from "./Hive";
import { Chat } from "./Chat";
import { Settings } from "./Settings";
// import { Training } from "./Training";

const Dashboard = () => (
  <>
    <Menu />
    <Routes>
      <Route path="/" element={<Hive />} />
      <Route path="chat" element={<Chat />} />
      {/* <Route path="training" element={<Training />} /> */}
      <Route path="settings" element={<Settings />} />
    </Routes>
  </>
);

export default Dashboard;
