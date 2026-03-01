import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "@hooks";
import { Loading } from "../Loading";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isUserSignedIn, isLoading } = useUserContext();

  if (isLoading) {
    return <Loading />;
  }

  return isUserSignedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
