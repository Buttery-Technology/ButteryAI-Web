import { FormEvent, useEffect, useState } from "react";
import { useAPIKeys } from "@hooks";
import { SummaryCards } from "@common";
import type { NetworkInfo, APIKeyRole, SummaryCard } from "../../../types/api";
import Power from "@assets/icons/power.svg?react";
import Diagnostics from "@assets/icons/diagnostics.svg?react";
import Share from "@assets/icons/share.svg?react";
import styles from "./Settings.module.scss";

interface Props {
  clusterConnectionInfo?: NetworkInfo;
  clusterID?: string;
  valueCards?: SummaryCard[];
  trustCards?: SummaryCard[];
  isLoadingDetail?: boolean;
}

const EXPIRATION_OPTIONS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
  { label: "Never", value: null },
] as const;

const Settings = ({ clusterConnectionInfo, clusterID, valueCards = [], trustCards = [], isLoadingDetail }: Props) => {
  const { keys, newKey, fetchKeys, createKey, clearNewKey } = useAPIKeys();
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyExpiration, setKeyExpiration] = useState<number | null>(90);
  const [keyCopied, setKeyCopied] = useState(false);

  useEffect(() => {
    if (clusterID) fetchKeys(clusterID);
  }, [clusterID]);

  const endpoint = clusterConnectionInfo
    ? `${clusterConnectionInfo.ipAddress}:${clusterConnectionInfo.port}`
    : null;

  const handleGenerateKey = async (e: FormEvent) => {
    e.preventDefault();
    if (!keyName.trim() || !clusterID) return;
    const result = await createKey(keyName.trim(), clusterID, "basic" as APIKeyRole, keyExpiration);
    if (result) {
      setKeyName("");
      setKeyExpiration(90);
      setShowKeyForm(false);
    }
  };

  const handleCopyKey = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const activeKey = keys.length > 0 ? keys[0] : null;

  return (
    <section className={styles.root}>
      {/* Connection section */}
      {(endpoint || clusterID) && (
        <div className={styles.section}>
          <strong>Connection</strong>
          <p>Connect to this node using the endpoint and API key below.</p>

          {endpoint && (
            <div className={styles.connectionRow}>
              <span className={styles.connectionLabel}>Endpoint</span>
              <code className={styles.connectionValue}>{endpoint}</code>
            </div>
          )}

          {newKey ? (
            <div className={styles.newKeyDisplay}>
              <p className={styles.keyWarning}>Copy this key now. It will not be shown again.</p>
              <div className={styles.keyRow}>
                <code className={styles.keyCode}>{newKey.rawKey}</code>
                <button className={styles.copyButton} onClick={() => handleCopyKey(newKey.rawKey)}>
                  {keyCopied ? "Copied" : "Copy"}
                </button>
              </div>
              <button className={styles.dismissKeyButton} onClick={clearNewKey}>Dismiss</button>
            </div>
          ) : activeKey ? (
            <div className={styles.connectionRow}>
              <span className={styles.connectionLabel}>API Key</span>
              <code className={styles.connectionValue}>{activeKey.keyPrefix}•••••••••</code>
            </div>
          ) : showKeyForm ? (
            <form className={styles.keyForm} onSubmit={handleGenerateKey}>
              <input
                type="text"
                placeholder="Key name (e.g. CI Pipeline)"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                required
                className={styles.keyInput}
              />
              <select
                value={keyExpiration === null ? "never" : String(keyExpiration)}
                onChange={(e) => setKeyExpiration(e.target.value === "never" ? null : Number(e.target.value))}
                className={styles.keySelect}
              >
                {EXPIRATION_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value === null ? "never" : opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button type="submit" className={styles.generateButton} disabled={!keyName.trim()}>Generate</button>
              <button type="button" className={styles.cancelButton} onClick={() => setShowKeyForm(false)}>Cancel</button>
            </form>
          ) : (
            <div className={styles.connectionRow}>
              <span className={styles.connectionLabel}>API Key</span>
              <button className={styles.generateApiKeyButton} onClick={() => setShowKeyForm(true)}>
                Generate API Key
              </button>
            </div>
          )}
        </div>
      )}

      {/* Knowledge engine */}
      {valueCards.length > 0 && (
        <div className={styles.section}>
          <strong>Knowledge engine</strong>
          <SummaryCards cards={valueCards} isLoading={isLoadingDetail} />
        </div>
      )}

      {/* Trust engine */}
      {trustCards.length > 0 && (
        <div className={styles.section}>
          <strong>Trust engine</strong>
          <SummaryCards cards={trustCards} isLoading={isLoadingDetail} />
        </div>
      )}

      {/* Actions section */}
      <div className={styles.section}>
        <strong>Actions</strong>
        <p>Manage and control this node.</p>
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <Power />
            <span>Power Cycle</span>
          </button>
          <button className={styles.actionButton}>
            <Diagnostics />
            <span>Diagnostics</span>
          </button>
          <button className={styles.actionButton}>
            <Share />
            <span>Share</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
