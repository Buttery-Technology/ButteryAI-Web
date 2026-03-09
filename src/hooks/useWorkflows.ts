import { useCallback, useEffect, useState } from "react";
import { GET_WORKFLOWS, GET_WORKFLOW, GET_WORKFLOW_STEPS, CREATE_WORKFLOW, UPDATE_WORKFLOW, ADD_WORKFLOW_STEP, DELETE_WORKFLOW } from "../api";
import type { WorkflowResponse, WorkflowStepResponse } from "../types/workflow";

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<WorkflowResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = useCallback(async () => {
    try {
      setIsLoading(true);
      const { url, options } = GET_WORKFLOWS();
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch workflows");
      const data = await response.json();
      setWorkflows(data.workflows ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workflows");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const createWorkflow = useCallback(async (name: string, description?: string, triggerType?: string) => {
    try {
      const { url, options } = CREATE_WORKFLOW({ name, description, triggerType });
      const res = await fetch(url, options);
      if (!res.ok) {
        const errBody = await res.text();
        console.error("Create workflow failed:", res.status, errBody);
        throw new Error(`Failed to create workflow: ${res.status} ${errBody}`);
      }
      const data = await res.json();
      await fetchWorkflows();
      return data.id as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workflow");
      return null;
    }
  }, [fetchWorkflows]);

  const deleteWorkflow = useCallback(async (id: string) => {
    try {
      const { url, options } = DELETE_WORKFLOW(id);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to delete workflow");
      await fetchWorkflows();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete workflow");
      return false;
    }
  }, [fetchWorkflows]);

  const duplicateWorkflow = useCallback(async (sourceId: string) => {
    try {
      // Fetch source workflow details and steps in parallel
      const [wfRes, stepsRes] = await Promise.all([
        fetch(...Object.values(GET_WORKFLOW(sourceId)) as [string, RequestInit]),
        fetch(...Object.values(GET_WORKFLOW_STEPS(sourceId)) as [string, RequestInit]),
      ]);
      if (!wfRes.ok || !stepsRes.ok) throw new Error("Failed to fetch workflow for duplication");

      const source: WorkflowResponse = await wfRes.json();
      const stepsData = await stepsRes.json();
      const steps: WorkflowStepResponse[] = stepsData.steps ?? [];

      // Create new workflow with same settings
      const { url, options } = CREATE_WORKFLOW({
        name: `${source.name} (copy)`,
        description: source.description,
        version: source.version,
        triggerType: source.triggerType,
        access: source.access,
      });
      const createRes = await fetch(url, options);
      if (!createRes.ok) throw new Error("Failed to create duplicate workflow");
      const { id: newId } = await createRes.json();

      // Copy status and isEnabled to the new workflow
      const updatePayload: Record<string, unknown> = {};
      if (source.status && source.status !== "draft") updatePayload.status = source.status;
      if (source.isEnabled) updatePayload.isEnabled = source.isEnabled;
      if (Object.keys(updatePayload).length > 0) {
        const { url: uUrl, options: uOpts } = UPDATE_WORKFLOW(newId, updatePayload);
        await fetch(uUrl, uOpts);
      }

      // Sort steps by order and create a map from old IDs to new IDs for dependsOn remapping
      const sorted = [...steps].sort((a, b) => a.order - b.order);
      const idMap: Record<string, string> = {};

      for (const step of sorted) {
        const stepPayload: Record<string, unknown> = {
          name: step.name,
          description: step.description,
          stepType: step.stepType,
          order: step.order,
          maxRetries: step.maxRetries,
          continueOnError: step.continueOnError,
        };
        if (step.configuration) stepPayload.configuration = step.configuration;
        if (step.canvasPosition) stepPayload.canvasPosition = step.canvasPosition;
        if (step.condition) stepPayload.condition = step.condition;
        if (step.inputMapping) stepPayload.inputMapping = step.inputMapping;
        if (step.outputMapping) stepPayload.outputMapping = step.outputMapping;
        if (step.promptID) stepPayload.promptID = step.promptID;
        if (step.aiModelID) stepPayload.aiModelID = step.aiModelID;
        if (step.nodeID) stepPayload.nodeID = step.nodeID;
        if (step.timeoutSeconds) stepPayload.timeoutSeconds = step.timeoutSeconds;

        // Remap dependsOn to new step IDs
        if (step.dependsOn && step.dependsOn.length > 0) {
          stepPayload.dependsOn = step.dependsOn
            .map((oldId) => idMap[oldId])
            .filter(Boolean);
        }

        const { url: sUrl, options: sOpts } = ADD_WORKFLOW_STEP(newId, stepPayload);
        const stepRes = await fetch(sUrl, sOpts);
        if (stepRes.ok) {
          const newStep = await stepRes.json();
          idMap[step.id] = newStep.id;
        }
      }

      await fetchWorkflows();
      return newId as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to duplicate workflow");
      return null;
    }
  }, [fetchWorkflows]);

  return { workflows, total, isLoading, error, refetch: fetchWorkflows, createWorkflow, deleteWorkflow, duplicateWorkflow };
}
