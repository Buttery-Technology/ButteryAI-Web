import { useLayoutEffect, useMemo, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { type Message } from "../Chat";
import { ButterAnimation } from "../ButterAnimation";
import styles from "./Messages.module.scss";

marked.setOptions({ breaks: true, gfm: true });

type MessagesProps = {
  messages: Message[];
  isThinking: boolean;
};

const MarkdownMessage = ({ text }: { text: string }) => {
  const html = useMemo(
    () => DOMPurify.sanitize(marked.parse(text) as string),
    [text],
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
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
            <MarkdownMessage text={msg.text} />
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
