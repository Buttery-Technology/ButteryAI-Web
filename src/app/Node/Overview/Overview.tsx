import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CREATE_CONVERSATION, CREATE_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES } from "../../../api";
import { useAPIKeys, useClusterConnection } from "@hooks";
import { Messages } from "../../Dashboard/Chat/Messages";
import { type Message } from "../../Dashboard/Chat/Chat";
import { typewriterEffect } from "../../Dashboard/Chat/utils";
import Send from "@assets/icons/send.svg?react";
import type { NodeResponse, NetworkInfo, APIKeyRole } from "../../../types/api";
import { FinishSetup } from "../FinishSetup";
import styles from "./Overview.module.scss";

interface Props {
  node: NodeResponse | null;
  clusterConnectionInfo?: NetworkInfo;
  clusterID?: string;
}

const ERROR_MESSAGE = "Sorry, I'm having trouble reaching this node.";

const EXPIRATION_OPTIONS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
  { label: "Never", value: null },
] as const;

const Overview = ({ node, clusterConnectionInfo, clusterID }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Direct cluster connection via ConnectRPC — connects eagerly on mount
  const { sendQuery, isConnected: clusterConnected } = useClusterConnection(clusterID);

  // Quick-generate API key state
  const { newKey, createKey, clearNewKey } = useAPIKeys();
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyExpiration, setKeyExpiration] = useState<number | null>(90);
  const [keyCopied, setKeyCopied] = useState(false);

  // Load existing conversation on mount
  useEffect(() => {
    (async () => {
      try {
        const { url, options } = GET_CONVERSATIONS();
        const res = await fetch(url, options);
        if (!res.ok) return;

        const data = await res.json();
        const conversations = data.conversations ?? [];
        if (conversations.length > 0) {
          const latest = conversations[0];
          setConversationId(latest.id);

          const msgReq = GET_MESSAGES(latest.id);
          const msgRes = await fetch(msgReq.url, msgReq.options);
          if (msgRes.ok) {
            const msgData = await msgRes.json();
            const loaded = (msgData.messages ?? []).map(
              (m: { content: string; authorType: string }) => ({
                sender: m.authorType === "user" ? "user" : "ai",
                text: m.content,
              }),
            );
            if (loaded.length > 0) setMessages(loaded);
          }
        }
      } catch {
        // Non-blocking
      }
    })();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userText = inputValue.trim();
    if (!userText || !node) return;

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputValue("");

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsThinking(true);

    let aiResponseText = ERROR_MESSAGE;
    let usedDirectConnection = false;

    // Try direct cluster connection first (ConnectRPC).
    // sendQuery re-establishes the connection if the token expired, so we
    // attempt this path whenever a clusterID is available — not only when
    // clusterConnected is true (it may have been eagerly established on mount).
    if (clusterID || clusterConnected) {
      try {
        // Add empty AI message for real-time streaming
        setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
        setIsThinking(false);

        const result = await sendQuery(userText, node.id, (partialText) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { sender: "ai", text: partialText };
            return updated;
          });
        });

        if (result !== null) {
          usedDirectConnection = true;
          // Streaming already updated the messages in real-time
          inputRef.current?.focus();
          return;
        }
      } catch {
        // Direct connection failed — remove the empty AI message and fall back
        setMessages((prev) => prev.slice(0, -1));
        setIsThinking(true);
      }
    }

    // Fallback: conversation API (via ButteryAI-Server)
    if (!usedDirectConnection) {
      try {
        let activeConvId = conversationId;

        if (!activeConvId) {
          const createReq = CREATE_CONVERSATION(`Node: ${node.name}`);
          const createRes = await fetch(createReq.url, createReq.options);
          if (createRes.ok) {
            const conv = await createRes.json();
            activeConvId = conv.id;
            setConversationId(conv.id);
          }
        }

        if (activeConvId) {
          const msgReq = CREATE_MESSAGE(activeConvId, userText, node.id);
          const msgRes = await fetch(msgReq.url, msgReq.options);
          if (msgRes.ok) {
            const data = await msgRes.json();
            if (data.content && data.authorType !== "user") {
              aiResponseText = data.content;
            }
          }
        }
      } catch (error) {
        console.error("Error querying node:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsThinking(false);

      setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

      await new Promise<void>((resolve) => {
        typewriterEffect(aiResponseText, (partialText) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { sender: "ai", text: partialText };
            return updated;
          });
          if (partialText === aiResponseText) resolve();
        });
      });
    }

    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

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

  const endpoint = clusterConnectionInfo
    ? `${clusterConnectionInfo.ipAddress}:${clusterConnectionInfo.port}`
    : null;

  const needsSetup = node?.grade?.overallScore?.status === "undefined";

  return (
    <section className={styles.root}>
      {needsSetup && node && <FinishSetup nodeId={node.id} />}

      {endpoint && (
        <p className={styles.endpoint}>
          Cluster endpoint: <code>{endpoint}</code>
        </p>
      )}

      {clusterID && (
        <div className={styles.apiKeySection}>
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
            <button className={styles.generateApiKeyButton} onClick={() => setShowKeyForm(true)}>
              Generate API Key
            </button>
          )}
        </div>
      )}

      <div className={styles.chat}>
        <Messages messages={messages} isThinking={isThinking} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder={node ? `Query ${node.name}...` : "Select a node..."}
            value={inputValue}
            onChange={handleChange}
            required
            disabled={!node?.isOnline}
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton} disabled={!inputValue || !node?.isOnline}>
            <Send />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Overview;
