import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CREATE_CONVERSATION, CREATE_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES } from "../../../api";
import { Messages } from "../../Dashboard/Chat/Messages";
import { type Message } from "../../Dashboard/Chat/Chat";
import { typewriterEffect } from "../../Dashboard/Chat/utils";
import Send from "@assets/icons/send.svg?react";
import type { NodeResponse, NetworkInfo } from "../../../types/api";
import styles from "./Overview.module.scss";

interface Props {
  node: NodeResponse | null;
  clusterConnectionInfo?: NetworkInfo;
}

const ERROR_MESSAGE = "Sorry, I'm having trouble reaching this node.";

const Overview = ({ node, clusterConnectionInfo }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const endpoint = clusterConnectionInfo
    ? `${clusterConnectionInfo.ipAddress}:${clusterConnectionInfo.port}`
    : null;

  return (
    <section className={styles.root}>
      {endpoint && (
        <p className={styles.endpoint}>
          Cluster endpoint: <code>{endpoint}</code>
        </p>
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
