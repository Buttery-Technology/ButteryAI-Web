import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "@hooks";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isUserSignedIn } = useUserContext();

  return isUserSignedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
