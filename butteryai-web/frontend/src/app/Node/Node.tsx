import { Navigate, Route, Routes } from "react-router-dom";
import { Menu } from "./Menu";
import { New } from "./New";
import { Overview } from "./Overview";
import { Settings } from "./Settings";
import { Metrics } from "./Metrics";

const Node = () => (
  <>
    <Menu />
    <Routes>
      <Route path="/" element={<Navigate to="overview" />} />
      <Route path="new" element={<New />} />
      <Route path="overview" element={<Overview />} />
      <Route path="settings" element={<Settings />} />
      <Route path="metrics" element={<Metrics />} />
    </Routes>
  </>
);

export default Node;
