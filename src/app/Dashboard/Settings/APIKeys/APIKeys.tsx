import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAPIKeys } from "@hooks";
import type { APIKeyResponse, APIKeyRole } from "../../../../types/api";
import styles from "./APIKeys.module.scss";

interface Props {
  clusterID?: string;
}

const EXPIRATION_OPTIONS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
  { label: "Never", value: null },
] as const;

const APIKeys = ({ clusterID }: Props) => {
  const { keys, isLoading, error, newKey, fetchKeys, createKey, revokeKey, clearNewKey } = useAPIKeys();

  const [name, setName] = useState("");
  const [role, setRole] = useState<APIKeyRole>("basic");
  const [expiresInDays, setExpiresInDays] = useState<number | null>(90);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys(clusterID);
  }, [clusterID]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clusterID) return;
    const result = await createKey(name.trim(), clusterID, role, expiresInDays);
    if (result) {
      setName("");
      setRole("basic");
      setExpiresInDays(90);
      setShowForm(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async (keyID: string) => {
    if (confirmRevoke === keyID) {
      await revokeKey(keyID, clusterID);
      setConfirmRevoke(null);
    } else {
      setConfirmRevoke(keyID);
    }
  };

  const getStatus = (key: APIKeyResponse): "active" | "revoked" | "expired" => {
    if (key.revokedAt) return "revoked";
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return "expired";
    return "active";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className={styles.root}>
      <Link to="/dashboard/settings" className={styles.backLink}>
        &larr; Back to Settings
      </Link>

      <div className={styles.header}>
        <h2>API Keys</h2>
        {!showForm && clusterID && (
          <button className={styles.createButton} onClick={() => setShowForm(true)}>
            Create Key
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {newKey && (
        <div className={styles.newKeyBanner}>
          <h4>API key created</h4>
          <p>Copy this key now. It will not be shown again.</p>
          <div className={styles.keyDisplay}>
            <code>{newKey.rawKey}</code>
            <button onClick={() => handleCopy(newKey.rawKey)}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <button className={styles.dismissButton} onClick={clearNewKey}>
            Dismiss
          </button>
        </div>
      )}

      {showForm && clusterID && (
        <form className={styles.createForm} onSubmit={handleCreate}>
          <h3>New API Key</h3>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label htmlFor="keyName">Name</label>
              <input
                id="keyName"
                type="text"
                placeholder="e.g. CI Pipeline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="keyRole">Role</label>
              <select id="keyRole" value={role} onChange={(e) => setRole(e.target.value as APIKeyRole)}>
                <option value="basic">Basic</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label htmlFor="keyExpiration">Expiration</label>
              <select
                id="keyExpiration"
                value={expiresInDays === null ? "never" : String(expiresInDays)}
                onChange={(e) => setExpiresInDays(e.target.value === "never" ? null : Number(e.target.value))}
              >
                {EXPIRATION_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value === null ? "never" : opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className={styles.createButton} disabled={!name.trim()}>
            Generate Key
          </button>
        </form>
      )}

      {isLoading ? (
        <p className={styles.emptyState}>Loading...</p>
      ) : keys.length === 0 ? (
        <p className={styles.emptyState}>No API keys yet. Create one to get started.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Role</th>
              <th>Created</th>
              <th>Last Used</th>
              <th>Expires</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => {
              const status = getStatus(key);
              return (
                <tr key={key.id}>
                  <td>{key.name}</td>
                  <td className={styles.prefix}>{key.keyPrefix}...</td>
                  <td>{key.role}</td>
                  <td>{formatDate(key.createdAt)}</td>
                  <td>{formatDate(key.lastUsedAt)}</td>
                  <td>{key.expiresAt ? formatDate(key.expiresAt) : "Never"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        status === "active"
                          ? styles.badgeActive
                          : status === "revoked"
                            ? styles.badgeRevoked
                            : styles.badgeExpired
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td>
                    {status === "active" && (
                      <button className={styles.revokeButton} onClick={() => handleRevoke(key.id)}>
                        {confirmRevoke === key.id ? "Confirm" : "Revoke"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default APIKeys;
