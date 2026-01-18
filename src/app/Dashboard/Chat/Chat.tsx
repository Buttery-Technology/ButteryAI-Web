import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { History } from "./History";
import { ResetButton } from "./ResetButton";
import { Messages } from "./Messages";
import { Form } from "./Form";
import { typewriterEffect } from "./utils";
import styles from "./Chat.module.scss";

const quitCommands = ["exit", "q", "quit"];
const ERROR_MESSAGE = "Sorry, I'm having trouble right now.";
const WELCOME_MESSAGE = "Welcome to ButteryAI! Type a message to start.";

export type Message = {
  sender: string;
  text: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([{ sender: "ai", text: WELCOME_MESSAGE }]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [fakeResponses, setFakeResponses] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/fakeResponse.json");
        if (!res.ok) throw new Error("Failed to fetch responses");

        const data = await res.json();

        if (data.responses && Array.isArray(data.responses)) setFakeResponses(data.responses);
        else setFakeResponses([ERROR_MESSAGE]);
      } catch {
        setFakeResponses([ERROR_MESSAGE]);
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

    // Send message to backend
    try {
      const response = await fetch("http://localhost:3001/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now(),
          subject: "chat",
          date: new Date().toISOString(),
          user: "user",
          message: userText,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      // We don’t use backend reply for AI response, just log it
      const data = await response.json();
      console.log("Backend response:", data);
    } catch (error) {
      console.error("Error communicating with backend:", error);
    }

    // Butter thinking animation duration (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsThinking(false);

    // Pick a random AI response from loaded JSON or fallback
    const responsesArray = fakeResponses.length > 0 ? fakeResponses : [ERROR_MESSAGE];
    const randomResponse = responsesArray[Math.floor(Math.random() * responsesArray.length)];

    // Add empty AI message for typing animation
    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    // Animate AI typing letter by letter
    await new Promise<void>((resolve) => {
      typewriterEffect(randomResponse, (partialText) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: "ai", text: partialText };
          return updated;
        });
        if (partialText === randomResponse) resolve();
      });
    });

    // Focus input after AI response finishes
    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const resetChat = () => {
    setMessages([{ sender: "ai", text: WELCOME_MESSAGE }]);
    setInputValue("");
    setIsThinking(false);
    setChatEnded(false);
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
