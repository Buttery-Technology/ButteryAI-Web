import { useCallback, useEffect, useState } from "react";
import { GET_CONVERSATIONS, CREATE_CONVERSATION, GET_MESSAGES, CREATE_MESSAGE } from "../api";
import type { ConversationSummary, MessageSummary } from "../types/api";

export function useConversation() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing conversations on mount
  useEffect(() => {
    loadLatestConversation();
  }, []);

  async function loadLatestConversation() {
    try {
      const { url, options } = GET_CONVERSATIONS();
      const response = await fetch(url, options);
      if (!response.ok) return;

      const data = await response.json();
      const conversations: ConversationSummary[] = data.conversations ?? [];
      if (conversations.length > 0) {
        const latest = conversations[0];
        setConversationId(latest.id);
        await loadMessages(latest.id);
      }
    } catch {
      // Non-blocking — chat will work without history
    }
  }

  async function loadMessages(convId: string) {
    try {
      const { url, options } = GET_MESSAGES(convId);
      const response = await fetch(url, options);
      if (!response.ok) return;

      const data = await response.json();
      setMessages(data.messages ?? []);
    } catch {
      // Non-blocking
    }
  }

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let activeConvId = conversationId;

      // Create conversation if none exists
      if (!activeConvId) {
        const createReq = CREATE_CONVERSATION("Chat", { type: "cluster" });
        const createRes = await fetch(createReq.url, createReq.options);
        if (!createRes.ok) throw new Error("Failed to create conversation");

        const conv = await createRes.json();
        activeConvId = conv.id;
        setConversationId(conv.id);
      }

      // Send the message
      const msgReq = CREATE_MESSAGE(activeConvId!, content);
      const msgRes = await fetch(msgReq.url, msgReq.options);
      if (!msgRes.ok) throw new Error("Failed to send message");

      const newMessage: MessageSummary = await msgRes.json();
      setMessages((prev) => [...prev, newMessage]);

      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  return { conversationId, messages, sendMessage, isLoading, error };
}
