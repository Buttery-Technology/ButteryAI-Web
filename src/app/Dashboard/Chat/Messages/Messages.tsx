import { useLayoutEffect, useRef } from "react";
import Markdown from "react-markdown";
import { type Message } from "../Chat";
import { ButterAnimation } from "../ButterAnimation";
import styles from "./Messages.module.scss";

type MessagesProps = {
  messages: Message[];
  isThinking: boolean;
};

const Messages = ({ messages, isThinking }: MessagesProps) => {
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [isThinking, messages]);

  return (
    <div className={styles.root} ref={messagesRef}>
      {messages.map((msg, i) => (
        <div key={i} className={`${styles.message} ${msg.sender === "user" ? styles.userMessage : styles.aiMessage}`}>
          {msg.sender === "ai" ? (
            <Markdown>{msg.text}</Markdown>
          ) : (
            msg.text
          )}
        </div>
      ))}
      {isThinking && (
        <p className={`${styles.message} ${styles.aiMessage}`}>
          ButteryAI is thinking... <ButterAnimation />
        </p>
      )}
    </div>
  );
};

export default Messages;
