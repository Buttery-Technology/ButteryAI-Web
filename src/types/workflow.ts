// --- Workflow Enums ---

export type WorkflowStatus = "draft" | "active" | "inactive" | "archived";

export type WorkflowTriggerType =
  | "manual"
  | "scheduled"
  | "eventBased"
  | "apiCall"
  | "messageReceived"
  | "queryReceived";

export type WorkflowStepType =
  | "promptExecution"
  | "dataTransformation"
  | "conditional"
  | "loop"
  | "parallel"
  | "apiCall"
  | "delay"
  | "aggregation"
  | "nodeSelection"
  | "extensionAction";

export type WorkflowExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "timedOut"
  | "partiallyCompleted";

// --- Workflow Responses ---

export interface WorkflowResponse {
  id: string;
  name: string;
  description: string;
  version: string;
  status: WorkflowStatus;
  triggerType: WorkflowTriggerType;
  isEnabled: boolean;
  access: string;
  stepCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowListResponse {
  workflows: WorkflowResponse[];
  total: number;
}

export interface WorkflowStepResponse {
  id: string;
  name: string;
  description: string;
  stepType: WorkflowStepType;
  order: number;
  promptID?: string;
  aiModelID?: string;
  nodeID?: string;
  maxRetries: number;
  continueOnError: boolean;
  dependsOn?: string[];
  configuration?: Record<string, unknown>;
  canvasPosition?: { x: number; y: number };
  condition?: string;
  inputMapping?: Record<string, unknown>;
  outputMapping?: Record<string, unknown>;
  timeoutSeconds?: number;
  createdAt?: string;
}

export interface WorkflowExecutionResponse {
  id: string;
  status: WorkflowExecutionStatus;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  createdAt?: string;
}

export interface WorkflowExecutionListResponse {
  executions: WorkflowExecutionResponse[];
  total: number;
}

export interface WorkflowStepExecutionResponse {
  id: string;
  status: WorkflowExecutionStatus;
  stepName: string;
  stepOrder: number;
  error?: string;
  attemptNumber: number;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  createdAt?: string;
}

export interface WorkflowStepExecutionListResponse {
  stepExecutions: WorkflowStepExecutionResponse[];
  total: number;
}

// --- Workflow Requests ---

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  version?: string;
  triggerType?: WorkflowTriggerType;
  access?: string;
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  version?: string;
  status?: WorkflowStatus;
  triggerType?: WorkflowTriggerType;
  isEnabled?: boolean;
  access?: string;
}

export interface CreateStepRequest {
  name: string;
  description?: string;
  stepType: WorkflowStepType;
  order: number;
  configuration?: Record<string, unknown>;
  canvasPosition?: { x: number; y: number };
  condition?: string;
  inputMapping?: Record<string, unknown>;
  outputMapping?: Record<string, unknown>;
  promptID?: string;
  aiModelID?: string;
  nodeID?: string;
  timeoutSeconds?: number;
  maxRetries?: number;
  continueOnError?: boolean;
  dependsOn?: string[];
}

export interface UpdateStepRequest {
  name?: string;
  description?: string;
  stepType?: WorkflowStepType;
  order?: number;
  configuration?: Record<string, unknown>;
  canvasPosition?: { x: number; y: number };
  condition?: string;
  inputMapping?: Record<string, unknown>;
  outputMapping?: Record<string, unknown>;
  promptID?: string;
  aiModelID?: string;
  nodeID?: string;
  timeoutSeconds?: number;
  maxRetries?: number;
  continueOnError?: boolean;
  dependsOn?: string[];
}
