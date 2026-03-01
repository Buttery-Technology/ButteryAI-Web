import { useState, useEffect, useCallback, useRef } from "react";
import { BUTTERY_API_URL } from "../api";

export interface TrainingProgressEvent {
  step: number;
  totalSteps: number;
  loss: number | null;
  gradientNorm: number | null;
  learningRate: number | null;
  status: string;
  message: string | null;
}

interface UseTrainingSSEOptions {
  jobId: string | null;
  onEvent?: (event: TrainingProgressEvent) => void;
  onDone?: (status: string) => void;
}

export const useTrainingSSE = ({ jobId, onEvent, onDone }: UseTrainingSSEOptions) => {
  const [connected, setConnected] = useState(false);
  const [latestEvent, setLatestEvent] = useState<TrainingProgressEvent | null>(null);
  const [lossHistory, setLossHistory] = useState<{ step: number; loss: number }[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!jobId) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `${BUTTERY_API_URL}/training/jobs/${jobId}/events`;
    const es = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (event) => {
      try {
        const data: TrainingProgressEvent = JSON.parse(event.data);
        setLatestEvent(data);

        if (data.loss !== null) {
          setLossHistory((prev) => [...prev, { step: data.step, loss: data.loss! }]);
        }

        onEvent?.(data);
      } catch {
        // Ignore parse errors (heartbeats)
      }
    };

    es.addEventListener("done", (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data);
        onDone?.(data.status);
      } catch {
        onDone?.("unknown");
      }
      es.close();
      setConnected(false);
    });

    es.onerror = () => {
      setConnected(false);
      es.close();
      // Auto-reconnect after 5 seconds
      setTimeout(() => connect(), 5000);
    };
  }, [jobId, onEvent, onDone]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setConnected(false);
  }, []);

  const resetHistory = useCallback(() => {
    setLossHistory([]);
    setLatestEvent(null);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connected, latestEvent, lossHistory, disconnect, resetHistory };
};

export default useTrainingSSE;
