import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CREATE_CONVERSATION, CREATE_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES } from "../../../api";
import { useClusterConnection } from "@hooks";
import { History } from "./History";
import { ResetButton } from "./ResetButton";
import { Messages } from "./Messages";
import { Form } from "./Form";
import { typewriterEffect } from "./utils";
import styles from "./Chat.module.scss";

const quitCommands = ["exit", "q", "quit"];
const ERROR_MESSAGE = "Sorry, I'm having trouble right now.";

export type Message = {
  sender: string;
  text: string;
};

interface Props {
  clusterID?: string;
}

const Chat = ({ clusterID }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Direct cluster connection via ConnectRPC
  const { sendQuery, isConnected: clusterConnected } = useClusterConnection(clusterID);

  /** Ensure a cluster conversation exists, creating one if needed. */
  const ensureConversation = useCallback(async (): Promise<string | null> => {
    if (conversationId) return conversationId;

    try {
      const createReq = CREATE_CONVERSATION("Chat", { type: "cluster" });
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
  }, [conversationId]);

  /** Persist a message to the conversation API (fire-and-forget). */
  const saveMessage = useCallback(async (convId: string, content: string, authorType?: string) => {
    try {
      const req = CREATE_MESSAGE(convId, content, authorType);
      await fetch(req.url, req.options);
    } catch {
      // Non-blocking — don't interrupt the UX if saving fails
    }
  }, []);

  // Load existing cluster conversation on mount
  useEffect(() => {
    (async () => {
      try {
        const { url, options } = GET_CONVERSATIONS();
        const res = await fetch(url, options);
        if (!res.ok) return;

        const data = await res.json();
        const conversations = (data.conversations ?? []).filter(
          (c: { type?: string }) => c.type === "cluster",
        );
        if (conversations.length > 0) {
          const latest = conversations[0];
          setConversationId(latest.id);

          // Load existing messages
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
            if (loaded.length > 0) {
              setMessages(loaded);
            }
          }
        }
      } catch {
        // Non-blocking — chat works without conversation history
      }
    })();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userText = inputValue.trim();

    if (quitCommands.includes(userText.toLowerCase())) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: userText },
        { sender: "system", text: "Chat ended. Refresh or reset to start again." },
      ]);
      setInputValue("");
      setIsThinking(false);
      setChatEnded(true);
      return;
    }

    // Add user's message to chat and reset value
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputValue("");

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsThinking(true);

    // Try direct cluster connection first (ConnectRPC streaming, no nodeId = intelligent routing)
    if (clusterID || clusterConnected) {
      try {
        // Add empty AI message for real-time streaming
        setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
        setIsThinking(false);

        const result = await sendQuery(userText, undefined, (partialText) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { sender: "ai", text: partialText };
            return updated;
          });
        });

        if (result !== null) {
          // Persist both messages to the conversation API in the background
          const convId = await ensureConversation();
          if (convId) {
            saveMessage(convId, userText, "user");
            saveMessage(convId, result, "cluster");
          }

          inputRef.current?.focus();
          return;
        }
      } catch {
        // Direct connection failed — remove the empty AI message and fall back
        setMessages((prev) => prev.slice(0, -1));
        setIsThinking(true);
      }
    }

    // Fallback: typewriter with error message (no server-side AI routing yet)
    let aiResponseText = ERROR_MESSAGE;
    try {
      const convId = await ensureConversation();
      if (convId) {
        await saveMessage(convId, userText, "user");
      }
    } catch (error) {
      console.error("Error communicating with backend:", error);
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

    // Save AI response to conversation (fire-and-forget)
    if (conversationId && aiResponseText !== ERROR_MESSAGE) {
      saveMessage(conversationId, aiResponseText, "cluster");
    }

    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const resetChat = () => {
    setMessages([]);
    setInputValue("");
    setIsThinking(false);
    setChatEnded(false);
    setConversationId(null);
  };

  return (
    <section className={styles.root}>
      {chatEnded ? (
        <>
          <History messages={messages} />
          <ResetButton resetChat={resetChat} />
        </>
      ) : (
        <>
          <Messages messages={messages} isThinking={isThinking} />
          <Form inputValue={inputValue} handleSubmit={handleSubmit} handleChange={handleChange} inputRef={inputRef} />
        </>
      )}
    </section>
  );
};

export default Chat;
