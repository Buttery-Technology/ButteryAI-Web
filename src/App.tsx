import { ReactNode, useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { UserContextProvider } from "./UserContext";
import { Home } from "./app/Home";
import { Login } from "./app/Login";
import { WaitingList } from "./app/WaitingList";
import { ProtectedRoute } from "./app/Helper/ProtectedRoute";
import { Dashboard } from "./app/Dashboard";
import { Node } from "./app/Node";
import { Setup } from "./app/Setup";
import { Workflow } from "./app/Workflow";
import { EvaluationMetrics } from "./app/EvaluationMetrics";

import "./App.scss";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Wrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/waiting-list" element={<WaitingList />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/setup/*"
              element={
                <ProtectedRoute>
                  <Setup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/node/*"
              element={
                <ProtectedRoute>
                  <Node />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflow/:workflowID/*"
              element={
                <ProtectedRoute>
                  <Workflow />
                </ProtectedRoute>
              }
            />
            <Route path="/evaluation-metrics" element={<EvaluationMetrics />} />
            <Route path="*" element={<p>404</p>} />
          </Routes>
        </Wrapper>
      </UserContextProvider>
    </BrowserRouter>
  );
};

export default App;
