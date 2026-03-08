import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CREATE_CONVERSATION, CREATE_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES } from "../../../api";
import { useClusterConnection } from "@hooks";
import { Messages } from "../../Dashboard/Chat/Messages";
import { type Message } from "../../Dashboard/Chat/Chat";
import { typewriterEffect } from "../../Dashboard/Chat/utils";
import { SummaryCards } from "@common";
import Send from "@assets/icons/send.svg?react";
import type { NodeResponse, SummaryCard } from "../../../types/api";
import { FinishSetup } from "../FinishSetup";
import styles from "./Overview.module.scss";

interface Props {
  node: NodeResponse | null;
  clusterID?: string;
  overviewCards?: SummaryCard[];
  valueCards?: SummaryCard[];
  trustCards?: SummaryCard[];
  isLoadingDetail?: boolean;
}

const ERROR_MESSAGE = "Sorry, I'm having trouble reaching this node.";

const Overview = ({ node, clusterID, overviewCards = [], valueCards = [], trustCards = [], isLoadingDetail }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Direct cluster connection via ConnectRPC — connects eagerly on mount
  const { sendQuery, isConnected: clusterConnected } = useClusterConnection(clusterID);

  /** Ensure a conversation exists for this node, creating one if needed. */
  const ensureConversation = useCallback(async (): Promise<string | null> => {
    if (conversationId) return conversationId;
    if (!node) return null;

    try {
      const createReq = CREATE_CONVERSATION(`Node: ${node.name}`, { nodeID: node.id, type: "node" });
      const createRes = await fetch(createReq.url, createReq.options);
      if (createRes.ok) {
        const conv = await createRes.json();
        setConversationId(conv.id);
        return conv.id;
      }
    } catch {
      // Non-blocking
    }
    return null;
  }, [conversationId, node]);

  /** Persist a message to the conversation API (fire-and-forget). */
  const saveMessage = useCallback(async (convId: string, content: string, authorType?: string) => {
    try {
      const req = CREATE_MESSAGE(convId, content, authorType);
      await fetch(req.url, req.options);
    } catch {
      // Non-blocking — don't interrupt the UX if saving fails
    }
  }, []);

  // Load existing conversation for this node on mount
  useEffect(() => {
    if (!node) return;

    (async () => {
      try {
        const { url, options } = GET_CONVERSATIONS(node.id);
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
  }, [node]);

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userText = inputValue.trim();
    if (!userText || !node || isSending) return;

    setIsSending(true);
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputValue("");

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsThinking(true);

    let aiResponseText = ERROR_MESSAGE;
    let usedDirectConnection = false;

    // Try direct cluster connection first (ConnectRPC).
    if (clusterID || clusterConnected) {
      try {
        // Add empty AI message and capture its index for safe updates
        let aiMessageIndex = -1;
        setMessages((prev) => {
          aiMessageIndex = prev.length;
          return [...prev, { sender: "ai", text: "" }];
        });
        setIsThinking(false);

        const result = await sendQuery(userText, node.id, (partialText) => {
          setMessages((prev) => {
            if (aiMessageIndex < 0 || aiMessageIndex >= prev.length) return prev;
            const updated = [...prev];
            updated[aiMessageIndex] = { sender: "ai", text: partialText };
            return updated;
          });
        });

        if (result !== null) {
          usedDirectConnection = true;

          // Persist both messages to the conversation API in the background
          const convId = await ensureConversation();
          if (convId) {
            saveMessage(convId, userText, "user");
            saveMessage(convId, result, "node");
          }

          setIsSending(false);
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
        const convId = await ensureConversation();

        if (convId) {
          // Save user message
          await saveMessage(convId, userText, "user");

          // Try to get AI response via the message API
          const msgReq = CREATE_MESSAGE(convId, userText);
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

      let fallbackAiIndex = -1;
      setMessages((prev) => {
        fallbackAiIndex = prev.length;
        return [...prev, { sender: "ai", text: "" }];
      });

      await new Promise<void>((resolve) => {
        typewriterEffect(aiResponseText, (partialText) => {
          setMessages((prev) => {
            if (fallbackAiIndex < 0 || fallbackAiIndex >= prev.length) return prev;
            const updated = [...prev];
            updated[fallbackAiIndex] = { sender: "ai", text: partialText };
            return updated;
          });
          if (partialText === aiResponseText) resolve();
        });
      });
    }

    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const needsSetup = node?.grade?.overallScore?.status === "undefined";

  return (
    <section className={styles.root}>
      {needsSetup && node && <FinishSetup nodeName={node.name} hasExtension={!!node.extensionID} />}

      {overviewCards.length > 0 && (
        <div className={styles.cardSection}>
          <h2 className={styles.sectionHeading}>Overview</h2>
          <SummaryCards cards={overviewCards} isLoading={isLoadingDetail} />
        </div>
      )}

      {valueCards.length > 0 && (
        <div className={styles.cardSection}>
          <h2 className={styles.sectionHeading}>Value Engine</h2>
          <SummaryCards cards={valueCards} isLoading={isLoadingDetail} />
        </div>
      )}

      {trustCards.length > 0 && (
        <div className={styles.cardSection}>
          <h2 className={styles.sectionHeading}>Trust Engine</h2>
          <SummaryCards cards={trustCards} isLoading={isLoadingDetail} />
        </div>
      )}

      <div className={styles.chat}>
        <Messages messages={messages} isThinking={isThinking} />

        <div className={styles.formWrapper}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              placeholder={node ? `Query ${node.name}...` : "Select a node..."}
              value={inputValue}
              onChange={handleChange}
              required
              disabled={!node?.isOnline || isSending}
              className={styles.input}
            />
            <button type="submit" className={styles.submitButton} disabled={!inputValue || !node?.isOnline || isSending}>
              <Send />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Overview;
