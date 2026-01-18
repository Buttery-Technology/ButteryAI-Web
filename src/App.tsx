import { ReactNode, useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { UserContextProvider } from "./UserContext";
import { Home } from "./app/Home";
import { Login } from "./app/Login";
import { ProtectedRoute } from "./app/Helper/ProtectedRoute";
import { Dashboard } from "./app/Dashboard";
import { Node } from "./app/Node";

import "./App.scss";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
            <Route path="/login" element={<Login />} />
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
            <Route path="*" element={<p>404</p>} />
          </Routes>
        </Wrapper>
      </UserContextProvider>
    </BrowserRouter>
  );
};

export default App;
