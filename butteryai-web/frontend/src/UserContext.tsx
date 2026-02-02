/**
 * GOOGLE SSO – HANDOFF NOTE
 * FINAL INTEGRATION STEPS:
 * 1. Replace the mock implementation with a redirect to:
 *      /sso/google/authorize
 * 2. Backend should redirect back to the frontend with:
 *      - id
 *      - name
 *      - newUser (boolean)
 * 3. Frontend can then:
 *      - store token / session
 *      - set user context
 *      - route to /dashboard/hive
 */


import { createContext, type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockGoogleSignIn } from "./app/Authentication/mockAuth";
import { POST_TOKEN, VALIDATE_TOKEN, GET_USER, POST_USER } from "./api";

type TUserContext = {
  data: any | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  isUserSignedIn: boolean;
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  signUp: (username: string, email: string, password: string) => void;
  signInWithGoogle: () => void;
};

export const UserContext = createContext<TUserContext | null>(null);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any | null>(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    autoSignIn();
  }, []);

  async function autoSignIn() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      const { url, options } = VALIDATE_TOKEN(token);
      const response = await fetch(url, options);
      if (!response.ok) throw new Error();

      await getUser(token);
    } catch {
      signOut();
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      setError(null);

      const { url, options } = POST_USER({ username, email, password });
      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok) throw new Error(json.message);
      await signIn(username, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(username: string, password: string) {
    try {
      setIsLoading(true);
      setError(null);

      const { url, options } = POST_TOKEN({ username, password });
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Login failed");

      const { token } = await response.json();
      localStorage.setItem("token", token);

      await getUser(token);
      navigate("/dashboard/hive");
    } catch (err: any) {
      setError(err.message);
      setIsUserSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem("token");
    setData(null);
    setIsUserSignedIn(false);
    navigate("/login");
  }

  async function signInWithGoogle() {
  try {
    setError(null);
    setIsLoading(true);

    const user = await mockGoogleSignIn();

    setData(user);
    setIsUserSignedIn(true);

    navigate("/dashboard/hive");
  } catch (error) {
    setError("Google sign-in failed");
  } finally {
    setIsLoading(false);
  }
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
        signInWithGoogle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
