import { useContext } from "react";
import { UserContext } from "../UserContext";

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === null) throw new Error("UserContext must be wrapped by a provider.");
  return context;
};

export default useUserContext;
