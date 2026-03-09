import { useCallback, useEffect, useState } from "react";
import {
  GET_WORKFLOW,
  GET_WORKFLOW_STEPS,
  ADD_WORKFLOW_STEP,
  UPDATE_WORKFLOW_STEP,
  DELETE_WORKFLOW_STEP,
  UPDATE_WORKFLOW,
  EXECUTE_WORKFLOW,
  GET_WORKFLOW_EXECUTIONS,
} from "../api";
import type {
  WorkflowResponse,
  WorkflowStepResponse,
  WorkflowExecutionResponse,
  CreateStepRequest,
  UpdateStepRequest,
  UpdateWorkflowRequest,
} from "../types/workflow";

export function useWorkflow(workflowID: string | undefined) {
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [steps, setSteps] = useState<WorkflowStepResponse[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecutionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflow = useCallback(async (id: string) => {
    try {
      const { url, options } = GET_WORKFLOW(id);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to fetch workflow");
      const data = await res.json();
      setWorkflow(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workflow");
    }
  }, []);

  const fetchSteps = useCallback(async (id: string) => {
    try {
      const { url, options } = GET_WORKFLOW_STEPS(id);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to fetch steps");
      const data = await res.json();
      setSteps((data.steps ?? data) as WorkflowStepResponse[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load steps");
    }
  }, []);

  const fetchAll = useCallback(async (id: string) => {
    setIsLoading(true);
    await Promise.all([fetchWorkflow(id), fetchSteps(id)]);
    setIsLoading(false);
  }, [fetchWorkflow, fetchSteps]);

  useEffect(() => {
    if (workflowID) fetchAll(workflowID);
  }, [workflowID, fetchAll]);

  const refetch = useCallback(() => {
    if (workflowID) fetchAll(workflowID);
  }, [workflowID, fetchAll]);

  const updateWorkflow = useCallback(async (data: UpdateWorkflowRequest) => {
    if (!workflowID) return false;
    try {
      const { url, options } = UPDATE_WORKFLOW(workflowID, data as Record<string, unknown>);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to update workflow");
      await fetchWorkflow(workflowID);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update workflow");
      return false;
    }
  }, [workflowID, fetchWorkflow]);

  const addStep = useCallback(async (data: CreateStepRequest) => {
    if (!workflowID) return null;
    try {
      const { url, options } = ADD_WORKFLOW_STEP(workflowID, data as unknown as Record<string, unknown>);
      const res = await fetch(url, options);
      if (!res.ok) {
        const errBody = await res.text();
        console.error("Add step failed:", res.status, errBody);
        throw new Error(`Failed to add step: ${res.status}`);
      }
      const result = await res.json();
      await fetchSteps(workflowID);
      return result.id as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add step");
      return null;
    }
  }, [workflowID, fetchSteps]);

  const updateStep = useCallback(async (stepID: string, data: UpdateStepRequest) => {
    if (!workflowID) return false;
    try {
      const { url, options } = UPDATE_WORKFLOW_STEP(workflowID, stepID, data as unknown as Record<string, unknown>);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to update step");
      await fetchSteps(workflowID);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update step");
      return false;
    }
  }, [workflowID, fetchSteps]);

  const deleteStep = useCallback(async (stepID: string) => {
    if (!workflowID) return false;
    try {
      const { url, options } = DELETE_WORKFLOW_STEP(workflowID, stepID);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to delete step");
      await fetchSteps(workflowID);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete step");
      return false;
    }
  }, [workflowID, fetchSteps]);

  const executeWorkflow = useCallback(async () => {
    if (!workflowID) return false;
    try {
      const { url, options } = EXECUTE_WORKFLOW(workflowID);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to execute workflow");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute workflow");
      return false;
    }
  }, [workflowID]);

  const fetchExecutions = useCallback(async () => {
    if (!workflowID) return;
    try {
      const { url, options } = GET_WORKFLOW_EXECUTIONS(workflowID);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to fetch executions");
      const data = await res.json();
      setExecutions(data.executions ?? []);
    } catch {
      // non-blocking
    }
  }, [workflowID]);

  return {
    workflow,
    steps,
    executions,
    isLoading,
    error,
    refetch,
    updateWorkflow,
    addStep,
    updateStep,
    deleteStep,
    executeWorkflow,
    fetchExecutions,
  };
}
