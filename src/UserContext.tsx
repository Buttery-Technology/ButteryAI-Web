import { createContext, type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateClientKeys, computeClientProof, verifyServerProof } from "./lib/srp";
import { SRP_LOGIN, SRP_VERIFY, GET_CURRENT_USER, LOGOUT, BUTTERY_API_URL } from "./api";

type ButteryUser = {
  id: string;
  name: string;
  email: string;
  systemAccessLevel: string;
  isOnline: boolean;
  plan?: string;
  needsOnboarding?: boolean;
  profileImageURL?: string;
  hasCluster?: boolean;
  clusterID?: string;
};

type TUserContext = {
  user: ButteryUser | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  isUserSignedIn: boolean;
  signIn: (email: string, password: string) => void;
  signInWithGoogle: () => void;
  signOut: () => void;
  refreshUser: () => Promise<void>;
};

export const UserContext = createContext<TUserContext | null>(null);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ButteryUser | null>(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    autoSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function autoSignIn() {
    try {
      const { url, options } = GET_CURRENT_USER();
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Not authenticated");

      const userData = await response.json();
      setUser(userData);
      setIsUserSignedIn(true);
    } catch {
      setUser(null);
      setIsUserSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setError(null);
      setIsLoading(true);

      // Step 1: Generate client keys
      const { publicKey, privateKey } = generateClientKeys();

      // Step 2: Send email + public key to server
      const loginReq = SRP_LOGIN(email, publicKey);
      const loginRes = await fetch(loginReq.url, loginReq.options);
      if (!loginRes.ok) {
        const body = await loginRes.json().catch(() => null);
        throw new Error(body?.reason || "Login failed. Please check your credentials.");
      }
      const { B, salt } = await loginRes.json();

      // Step 3: Compute client proof
      const { proof, sharedSecret } = await computeClientProof(
        privateKey,
        publicKey,
        B,
        salt,
        email,
        password,
      );

      // Step 4: Verify with server
      const verifyReq = SRP_VERIFY(proof);
      const verifyRes = await fetch(verifyReq.url, verifyReq.options);
      if (!verifyRes.ok) {
        throw new Error("Authentication failed. Please check your credentials.");
      }
      const verifyData = await verifyRes.json();

      // Step 5: Verify server proof
      const serverValid = await verifyServerProof(
        publicKey,
        proof,
        sharedSecret,
        verifyData.proof,
      );
      if (!serverValid) {
        throw new Error("Server verification failed.");
      }

      // Step 6: Set user state and navigate
      setUser(verifyData.user);
      setIsUserSignedIn(true);
      navigate("/dashboard");
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        setError(error.message as string);
      }
      setIsUserSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshUser() {
    try {
      const { url, options } = GET_CURRENT_USER();
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Not authenticated");
      const userData = await response.json();
      setUser(userData);
      setIsUserSignedIn(true);
    } catch {
      setUser(null);
      setIsUserSignedIn(false);
    }
  }

  function signInWithGoogle() {
    window.location.href = BUTTERY_API_URL + "/sso/google/authorize";
  }

  async function signOut() {
    try {
      const { url, options } = LOGOUT();
      await fetch(url, options);
    } catch {
      // Continue with local cleanup even if server logout fails
    }

    setUser(null);
    setError(null);
    setIsLoading(false);
    setIsUserSignedIn(false);
    navigate("/login");
  }

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        setError,
        isLoading,
        isUserSignedIn,
        signIn,
        signInWithGoogle,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
