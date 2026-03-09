import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CREATE_CONVERSATION, GET_CONVERSATIONS, GET_MESSAGES, QUERY_NODE } from "../../../api";
import { Messages } from "../../Dashboard/Chat/Messages";
import { type Message } from "../../Dashboard/Chat/Chat";
import { SummaryCards } from "@common";
import Send from "@assets/icons/send.svg?react";
import type { NodeResponse, SummaryCard } from "../../../types/api";
import { FinishSetup } from "../FinishSetup";
import styles from "./Overview.module.scss";

interface Props {
  node: NodeResponse | null;
  clusterID?: string; // kept for parent compat, unused after server-proxy refactor
  overviewCards?: SummaryCard[];
  isLoadingDetail?: boolean;
}

const ERROR_MESSAGE = "Sorry, I'm having trouble reaching this node.";

/**
 * Extract the display text from a decoded QueryOutput JSON payload.
 *
 * Each streamed chunk is a full QueryOutput object (not a delta).
 * The message text lives inside `content[]` which can be either a plain
 * string or an object with nested `content[].text` fields.
 */
function extractTextFromQueryOutput(parsed: Record<string, unknown>): string | null {
  const content = parsed.content as Array<Record<string, unknown>> | undefined;
  if (!content) return null;

  for (const item of content) {
    if (Array.isArray(item.content)) {
      const parts = item.content as Array<Record<string, unknown>>;
      const texts: string[] = [];
      for (const part of parts) {
        if (typeof part.text === "string" && part.text) {
          texts.push(part.text);
        } else if (typeof part.refusal === "string" && part.refusal) {
          texts.push(part.refusal);
        }
      }
      if (texts.length > 0) return texts.join("");
    }
    if (typeof item === "string" && item) {
      return item;
    }
  }
  return null;
}

const Overview = ({ node, overviewCards = [], isLoadingDetail }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userText = inputValue.trim();
    if (!userText || !node || isSending) return;

    setIsSending(true);
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputValue("");

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsThinking(true);

    try {
      const convId = await ensureConversation();
      if (!convId) throw new Error("Failed to create conversation");

      // Add empty AI message and capture its index for streaming updates
      let aiMessageIndex = -1;
      setMessages((prev) => {
        aiMessageIndex = prev.length;
        return [...prev, { sender: "ai", text: "" }];
      });
      setIsThinking(false);

      // Call the server-proxied query endpoint (SSE stream)
      const { url, options } = QUERY_NODE(convId, userText, node.id);
      const res = await fetch(url, options);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Query failed: ${res.status} ${text}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let latestText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events (delimited by double newline)
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.trim()) continue;

          const dataLine = event.split("\n").find((line) => line.startsWith("data: "));
          if (!dataLine) continue;

          const jsonStr = dataLine.slice("data: ".length);
          try {
            const parsed = JSON.parse(jsonStr);

            if (parsed.done) break;
            if (parsed.error) throw new Error(parsed.error);

            if (parsed.payload) {
              // Decode base64 payload → JSON QueryOutput
              const decoded = new TextDecoder().decode(
                Uint8Array.from(atob(parsed.payload), (c) => c.charCodeAt(0)),
              );
              try {
                const queryOutput = JSON.parse(decoded);
                const extracted = extractTextFromQueryOutput(queryOutput);
                if (extracted !== null) {
                  latestText = extracted;
                  setMessages((prev) => {
                    if (aiMessageIndex < 0 || aiMessageIndex >= prev.length) return prev;
                    const updated = [...prev];
                    updated[aiMessageIndex] = { sender: "ai", text: latestText };
                    return updated;
                  });
                }
              } catch {
                // Skip malformed payloads — valid content arrives in parseable chunks
              }
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }

      // If we never got any text, show error
      if (!latestText) {
        setMessages((prev) => {
          if (aiMessageIndex < 0 || aiMessageIndex >= prev.length) return prev;
          const updated = [...prev];
          updated[aiMessageIndex] = { sender: "ai", text: ERROR_MESSAGE };
          return updated;
        });
      }
    } catch (error) {
      console.error("Error querying node:", error);
      setIsThinking(false);
      // If we haven't added an AI message yet, add one with the error
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.sender === "ai" && lastMsg.text === "") {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: "ai", text: ERROR_MESSAGE };
          return updated;
        }
        return [...prev, { sender: "ai", text: ERROR_MESSAGE }];
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
