import { useState } from "react";
import { LIST_API_KEYS, CREATE_API_KEY, REVOKE_API_KEY } from "../api";
import type { APIKeyResponse, APIKeyCreationResponse, APIKeyListResponse, APIKeyRole } from "../types/api";

export function useAPIKeys() {
  const [keys, setKeys] = useState<APIKeyResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<APIKeyCreationResponse | null>(null);

  async function fetchKeys(clusterID?: string) {
    try {
      setIsLoading(true);
      setError(null);
      const { url, options } = LIST_API_KEYS(clusterID);
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch API keys");
      const data: APIKeyListResponse = await response.json();
      setKeys(data.keys);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  }

  async function createKey(name: string, clusterID: string, role: APIKeyRole, expiresInDays: number | null) {
    try {
      setError(null);
      const { url, options } = CREATE_API_KEY(name, clusterID, role, expiresInDays);
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? "Failed to create API key");
      }
      const data: APIKeyCreationResponse = await response.json();
      setNewKey(data);
      // Refresh the list
      await fetchKeys(clusterID);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
      return null;
    }
  }

  async function revokeKey(keyID: string, clusterID?: string) {
    try {
      setError(null);
      const { url, options } = REVOKE_API_KEY(keyID);
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? "Failed to revoke API key");
      }
      // Refresh the list
      await fetchKeys(clusterID);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke API key");
    }
  }

  function clearNewKey() {
    setNewKey(null);
  }

  return { keys, total, isLoading, error, newKey, fetchKeys, createKey, revokeKey, clearNewKey };
}
