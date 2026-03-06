import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CREATE_CONVERSATION, CREATE_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES } from "../../../api";
import { useClusterConnection } from "@hooks";
import { Messages } from "../../Dashboard/Chat/Messages";
import { type Message } from "../../Dashboard/Chat/Chat";
import { typewriterEffect } from "../../Dashboard/Chat/utils";
import Send from "@assets/icons/send.svg?react";
import type { NodeResponse } from "../../../types/api";
import { FinishSetup } from "../FinishSetup";
import styles from "./Overview.module.scss";

interface Props {
  node: NodeResponse | null;
  clusterID?: string;
}

const ERROR_MESSAGE = "Sorry, I'm having trouble reaching this node.";

const Overview = ({ node, clusterID }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Direct cluster connection via ConnectRPC — connects eagerly on mount
  const { sendQuery, isConnected: clusterConnected } = useClusterConnection(clusterID);

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

  const needsSetup = node?.grade?.overallScore?.status === "undefined";

  return (
    <section className={styles.root}>
      {needsSetup && node && <FinishSetup nodeName={node.name} />}

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
