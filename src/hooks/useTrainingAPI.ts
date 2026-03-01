import { useState, useCallback } from "react";
import { BUTTERY_API_URL } from "../api";

// Types matching server TrainingModels.swift
export type TrainingJobStatus =
  | "pending"
  | "provisioning"
  | "uploading_data"
  | "training"
  | "downloading_weights"
  | "completed"
  | "failed"
  | "cancelled"
  | "terminated";

export type ComputeBackend = "cpu" | "gpu" | "auto";

export interface LoRATrainingConfig {
  rank: number;
  alpha: number;
  dropout: number;
  targetModules: string[];
  learningRate: number;
  weightDecay: number;
  warmupSteps: number;
  maxSteps: number;
  batchSize: number;
  gradientAccumulation: number;
  sequenceLength: number;
  evalInterval: number;
  earlyStoppingPatience: number;
}

export interface CreateTrainingJobRequest {
  modelName: string;
  config: LoRATrainingConfig;
  computeBackend?: ComputeBackend;
  nodeCount?: number;
  zone?: string;
  machineType?: string;
  trainingDataPath?: string;
}

export interface TrainingJob {
  id: string;
  status: TrainingJobStatus;
  statusMessage: string | null;
  modelName: string;
  computeBackend: ComputeBackend;
  currentStep: number;
  totalSteps: number;
  currentLoss: number | null;
  gradientNorm: number | null;
  currentLR: number | null;
  nodeCount: number;
  zone: string;
  machineType: string;
  estimatedCost: number | null;
  errorMessage: string | null;
  gcsAdapterPath: string | null;
  createdAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface CreateTrainingJobResponse {
  id: string;
  status: TrainingJobStatus;
  modelName: string;
  nodeCount: number;
  computeBackend: ComputeBackend;
  estimatedCostPerHour: number;
  message: string;
}

const defaultConfig: LoRATrainingConfig = {
  rank: 32,
  alpha: 32,
  dropout: 0,
  targetModules: ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj"],
  learningRate: 2e-6,
  weightDecay: 0.01,
  warmupSteps: 100,
  maxSteps: 4000,
  batchSize: 2,
  gradientAccumulation: 4,
  sequenceLength: 512,
  evalInterval: 100,
  earlyStoppingPatience: 5,
};

export { defaultConfig };

export const useTrainingAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (): Promise<TrainingJob[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BUTTERY_API_URL}/training/jobs`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
      const data = await res.json();
      return data.jobs;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJob = useCallback(async (id: string): Promise<TrainingJob | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BUTTERY_API_URL}/training/jobs/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to fetch job: ${res.status}`);
      return await res.json();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = useCallback(
    async (req: CreateTrainingJobRequest): Promise<CreateTrainingJobResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BUTTERY_API_URL}/training/jobs`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to create job: ${res.status}`);
        }
        return await res.json();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const cancelJob = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BUTTERY_API_URL}/training/jobs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to cancel job: ${res.status}`);
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchJobs, fetchJob, createJob, cancelJob, loading, error };
};

export default useTrainingAPI;
