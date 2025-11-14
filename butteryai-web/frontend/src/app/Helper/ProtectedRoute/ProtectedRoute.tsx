import { type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../../hooks/useUserContext";

const ProtectedRoute = ({ children }: { children: ReactElement | null }) => {
  const { isUserSignedIn } = useUserContext();

  return isUserSignedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
