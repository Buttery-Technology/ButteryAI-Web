import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "@hooks";
import { Loading } from "../Loading";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isUserSignedIn, isLoading } = useUserContext();
  const { pathname } = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!isUserSignedIn) {
    return <Navigate to="/login" />;
  }

  if (user?.needsOnboarding && !pathname.startsWith("/setup")) {
    return <Navigate to="/setup" />;
  }

  return children;
};

export default ProtectedRoute;
