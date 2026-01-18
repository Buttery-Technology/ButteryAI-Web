import { createContext, type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { POST_TOKEN, VALIDATE_TOKEN, GET_USER, POST_USER } from "./api";

type TUserContext = {
  data: null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  isUserSignedIn: boolean;
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  signUp: (username: string, email: string, password: string) => void;
};

export const UserContext = createContext<TUserContext | null>(null);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    autoSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function autoSignIn() {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        setError(null);
        setIsLoading(true);

        const { url, options } = VALIDATE_TOKEN(token);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Invalid token");

        await getUser(token);
      } catch (error) {
        signOut();
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function getUser(token: string) {
    const { url, options } = GET_USER(token);
    const response = await fetch(url, options);
    const json = await response.json();

    setData(json);
    setIsUserSignedIn(true);
  }

  async function signUp(username: string, email: string, password: string) {
    try {
      setError(null);
      setIsLoading(true);

      const { url, options } = POST_USER({ username, email, password });
      const response = await fetch(url, options);
      const json = await response.json();
      if (!response.ok) throw new Error(json.message);
      if (response.ok) await signIn(username, password);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) setError(error.message as string);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(username: string, password: string) {
    try {
      setError(null);
      setIsLoading(true);

      const { url, options } = POST_TOKEN({ username, password });
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Sorry, we found an error. Please try again.");

      const { token } = await response.json();
      localStorage.setItem("token", token);
      await getUser(token);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      navigate("/dashboard/hive");
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) setError(error.message as string);
      setIsUserSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsUserSignedIn(false);

    localStorage.removeItem("token");

    navigate("/login");
  }

  return (
    <UserContext.Provider
      value={{
        data,
        error,
        setError,
        isLoading,
        isUserSignedIn,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
