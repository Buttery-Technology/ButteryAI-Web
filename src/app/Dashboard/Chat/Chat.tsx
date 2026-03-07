import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CREATE_CONVERSATION, CREATE_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES } from "../../../api";
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

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
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

    // Slight delay before thinking animation
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsThinking(true);

    // Send message to backend via conversations API
    let aiResponseText = ERROR_MESSAGE;
    try {
      let activeConvId = conversationId;

      // Create conversation if none exists
      if (!activeConvId) {
        const createReq = CREATE_CONVERSATION("Chat", { type: "cluster" });
        const createRes = await fetch(createReq.url, createReq.options);
        if (createRes.ok) {
          const conv = await createRes.json();
          activeConvId = conv.id;
          setConversationId(conv.id);
        }
      }

      if (activeConvId) {
        const msgReq = CREATE_MESSAGE(activeConvId, userText);
        const msgRes = await fetch(msgReq.url, msgReq.options);
        if (msgRes.ok) {
          const data = await msgRes.json();
          // Server may return an AI response alongside the user message
          if (data.content && data.authorType !== "user") {
            aiResponseText = data.content;
          }
        }
      }
    } catch (error) {
      console.error("Error communicating with backend:", error);
    }

    // Thinking animation duration
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsThinking(false);

    // Add empty AI message for typing animation
    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    // Animate AI typing letter by letter
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

    // Focus input after AI response finishes
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
