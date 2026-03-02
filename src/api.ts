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

// Conversations
export const GET_CONVERSATIONS = () => ({
  url: BUTTERY_API_URL + "/conversations",
  options: {
    method: "GET",
    ...cookieOptions,
  },
});

export const CREATE_CONVERSATION = (title: string) => ({
  url: BUTTERY_API_URL + "/conversations",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
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

export const CREATE_MESSAGE = (conversationId: string, content: string, nodeId?: string) => ({
  url: BUTTERY_API_URL + `/conversations/${conversationId}/messages`,
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, ...(nodeId ? { nodeId } : {}) }),
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

export const CONNECT_TO_CLUSTER = (clusterID: string) => ({
  url: BUTTERY_API_URL + "/api-keys/connect",
  options: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clusterID }),
    ...cookieOptions,
  },
});
