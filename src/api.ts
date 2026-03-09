export const BUTTERY_API_URL = import.meta.env.VITE_API_URL || "/api";

const cookieOptions = {
  credentials: "include" as RequestCredentials,
};

// SRP Auth
export const SRP_LOGIN = (email: string, A: string) => ({
  url: BUTTERY_API_URL + "/srp/login",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, A }),
    ...cookieOptions,
  },
});

export const SRP_VERIFY = (proof: string) => ({
  url: BUTTERY_API_URL + "/srp/verify",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proof }),
    ...cookieOptions,
  },
});

export const SRP_REGISTER = (name: string, email: string, salt: string, verifier: string) => ({
  url: BUTTERY_API_URL + "/srp/register",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, salt, verifier }),
    ...cookieOptions,
  },
});

// User
export const GET_CURRENT_USER = () => ({
  url: BUTTERY_API_URL + "/users/me",
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

// Update Profile
export const UPDATE_PROFILE = (data: {
  name: string;
  country: string;
  industry?: string;
  purpose?: string;
  profileImageURL?: string;
}) => ({
  url: BUTTERY_API_URL + "/users",
  options: {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cookieOptions,
  },
});

// Logout
export const LOGOUT = () => ({
  url: BUTTERY_API_URL + "/sso/logout",
  options: {
    method: "POST",
    ...cookieOptions,
  },
});

// Waitlist
export const CHECK_WAITLIST_APPROVAL = (email: string) => ({
  url: BUTTERY_API_URL + "/waitlist/check",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  },
});

export const JOIN_WAITLIST = (name: string, email: string, buildDescription?: string) => ({
  url: BUTTERY_API_URL + "/waitlist/join",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, buildDescription }),
  },
});

// Dashboard
export const GET_DASHBOARD = () => ({
  url: BUTTERY_API_URL + "/dashboard",
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

// Nodes
export const GET_NODES = () => ({
  url: BUTTERY_API_URL + "/nodes",
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const GET_NODE = (nodeId: string) => ({
  url: BUTTERY_API_URL + `/nodes/${nodeId}`,
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const CREATE_NODE = (name: string, clusterID: string, access?: string) => ({
  url: BUTTERY_API_URL + "/nodes",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, clusterID, access }),
    ...cookieOptions,
  },
});

export const GET_NODE_HISTORY = (nodeId: string) => ({
  url: BUTTERY_API_URL + `/nodes/${nodeId}/history`,
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const GET_NODE_DETAIL = (nodeId: string) => ({
  url: BUTTERY_API_URL + `/nodes/${nodeId}/detail`,
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const UPDATE_NODE_AI_MODEL = (nodeId: string, data: Record<string, unknown>) => ({
  url: BUTTERY_API_URL + `/nodes/${nodeId}/ai-model`,
  options: {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cookieOptions,
  },
});

export const UPDATE_NODE_EXTENSION = (nodeId: string, data: Record<string, unknown>) => ({
  url: BUTTERY_API_URL + `/nodes/${nodeId}/extension`,
  options: {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cookieOptions,
  },
});

// Node Knowledge
export const GET_NODE_KNOWLEDGE = (nodeId: string) => ({
  url: BUTTERY_API_URL + `/nodes/${nodeId}/knowledge`,
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const CREATE_NODE_KNOWLEDGE = (nodeId: string, data: {
  name: string;
  description: string;
  underlyingDataType: string;
  underlyingData?: string;
  underlyingDataURL?: string;
  categories?: string[];
  tags?: string[];
}) => ({
  url: BUTTERY_API_URL + `/nodes/${nodeId}/knowledge`,
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cookieOptions,
  },
});

export const UNLINK_NODE_KNOWLEDGE = (nodeId: string, knowledgeId: string) => ({
  url: BUTTERY_API_URL + `/nodes/${nodeId}/knowledge/${knowledgeId}`,
  options: {
    method: "DELETE",
    ...cookieOptions,
  },
});

// Conversations
export const GET_CONVERSATIONS = (nodeID?: string) => ({
  url: BUTTERY_API_URL + "/conversations" + (nodeID ? `?nodeID=${nodeID}` : ""),
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const CREATE_CONVERSATION = (title: string, opts?: { nodeID?: string; type?: "node" | "cluster" }) => ({
  url: BUTTERY_API_URL + "/conversations",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, ...opts }),
    ...cookieOptions,
  },
});

export const GET_MESSAGES = (conversationId: string) => ({
  url: BUTTERY_API_URL + `/conversations/${conversationId}/messages`,
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const CREATE_MESSAGE = (conversationId: string, content: string, authorType?: string) => ({
  url: BUTTERY_API_URL + `/conversations/${conversationId}/messages`,
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, ...(authorType ? { authorType } : {}) }),
    ...cookieOptions,
  },
});

// Clusters
export const GET_CLUSTER = () => ({
  url: BUTTERY_API_URL + "/clusters",
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

// API Keys
export const LIST_API_KEYS = (clusterID?: string) => ({
  url: BUTTERY_API_URL + "/api-keys" + (clusterID ? `?clusterID=${clusterID}` : ""),
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const CREATE_API_KEY = (name: string, clusterID: string, role: string, expiresInDays: number | null) => ({
  url: BUTTERY_API_URL + "/api-keys",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, clusterID, role, expiresInDays }),
    ...cookieOptions,
  },
});

export const REVOKE_API_KEY = (keyID: string) => ({
  url: BUTTERY_API_URL + `/api-keys/${keyID}`,
  options: {
    method: "DELETE",
    ...cookieOptions,
  },
});

export const REDEEM_CLUSTER_INVITE = (code: string) => ({
  url: BUTTERY_API_URL + "/clusters/redeem-invite",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    ...cookieOptions,
  },
});

export const CONNECT_TO_CLUSTER = (clusterID: string) => ({
  url: BUTTERY_API_URL + "/api-keys/connect",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clusterID }),
    ...cookieOptions,
  },
});

export const QUERY_NODE = (conversationId: string, query: string, nodeId?: string) => ({
  url: BUTTERY_API_URL + `/conversations/${conversationId}/query`,
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, ...(nodeId ? { nodeId } : {}) }),
    ...cookieOptions,
  },
});

// AI Models
export const GET_AI_MODELS = (search?: string) => ({
  url: BUTTERY_API_URL + "/ai-models" + (search ? `?search=${encodeURIComponent(search)}` : ""),
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

// Workflows
export const GET_WORKFLOWS = (limit?: number, offset?: number) => {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));
  if (offset) params.set("offset", String(offset));
  const qs = params.toString();
  return {
    url: BUTTERY_API_URL + "/workflows" + (qs ? `?${qs}` : ""),
    options: { method: "GET" as const, ...cookieOptions },
  };
};

export const GET_WORKFLOW = (id: string) => ({
  url: BUTTERY_API_URL + `/workflows/${id}`,
  options: { method: "GET" as const, ...cookieOptions },
});

export const CREATE_WORKFLOW = (data: {
  name: string;
  description?: string;
  version?: string;
  triggerType?: string;
  access?: string;
}) => ({
  url: BUTTERY_API_URL + "/workflows",
  options: {
    method: "POST" as const,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: data.description ?? "",
      version: data.version ?? "1.0",
      triggerType: data.triggerType ?? "manual",
      access: data.access ?? "private",
      name: data.name,
    }),
    ...cookieOptions,
  },
});

export const UPDATE_WORKFLOW = (id: string, data: Record<string, unknown>) => ({
  url: BUTTERY_API_URL + `/workflows/${id}`,
  options: {
    method: "PUT" as const,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cookieOptions,
  },
});

export const DELETE_WORKFLOW = (id: string) => ({
  url: BUTTERY_API_URL + `/workflows/${id}`,
  options: {
    method: "DELETE" as const,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permanent: false }),
    ...cookieOptions,
  },
});

// Workflow Steps
export const GET_WORKFLOW_STEPS = (workflowID: string) => ({
  url: BUTTERY_API_URL + `/workflows/${workflowID}/steps`,
  options: { method: "GET" as const, ...cookieOptions },
});

export const ADD_WORKFLOW_STEP = (workflowID: string, data: Record<string, unknown>) => ({
  url: BUTTERY_API_URL + `/workflows/${workflowID}/steps`,
  options: {
    method: "POST" as const,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "",
      ...data,
    }),
    ...cookieOptions,
  },
});

export const UPDATE_WORKFLOW_STEP = (workflowID: string, stepID: string, data: Record<string, unknown>) => ({
  url: BUTTERY_API_URL + `/workflows/${workflowID}/steps/${stepID}`,
  options: {
    method: "PUT" as const,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cookieOptions,
  },
});

export const DELETE_WORKFLOW_STEP = (workflowID: string, stepID: string) => ({
  url: BUTTERY_API_URL + `/workflows/${workflowID}/steps/${stepID}`,
  options: { method: "DELETE" as const, ...cookieOptions },
});

// Workflow Executions
export const EXECUTE_WORKFLOW = (workflowID: string) => ({
  url: BUTTERY_API_URL + `/workflows/${workflowID}/execute`,
  options: { method: "POST" as const, ...cookieOptions },
});

export const GET_WORKFLOW_EXECUTIONS = (workflowID: string) => ({
  url: BUTTERY_API_URL + `/workflows/${workflowID}/executions`,
  options: { method: "GET" as const, ...cookieOptions },
});

export const GET_WORKFLOW_EXECUTION = (workflowID: string, executionID: string) => ({
  url: BUTTERY_API_URL + `/workflows/${workflowID}/executions/${executionID}`,
  options: { method: "GET" as const, ...cookieOptions },
});

// User Extension Configs
export const GET_USER_EXTENSION_CONFIGS = () => ({
  url: BUTTERY_API_URL + "/user-extension-configs",
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const GET_USER_EXTENSION_CONFIG = (provider: string) => ({
  url: BUTTERY_API_URL + `/user-extension-configs/${provider}`,
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const SAVE_USER_EXTENSION_CONFIG = (data: {
  provider: string;
  apiKey?: string;
  organizationID?: string;
  projectID?: string;
  adminKey?: string;
}) => ({
  url: BUTTERY_API_URL + "/user-extension-configs",
  options: {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cookieOptions,
  },
});
