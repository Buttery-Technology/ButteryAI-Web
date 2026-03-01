// --- Grade & Metrics ---

export type GradeStatus = "defined" | "undefined" | "beingEvaluated";

export interface GradeValue {
  value: number;
  status: GradeStatus;
}

export interface GradeResponse {
  overallScore: GradeValue;
  trust: GradeValue;
  bias: GradeValue;
  accuracy: GradeValue;
}

// --- Summary Cards (Dashboard) ---

export interface SummaryCard {
  header: string;
  title: string;
  description: string;
  endpoint: string;
  order: number;
}

// --- Cluster ---

export interface NetworkInfo {
  ipAddress: string;
  port: number;
  macAddress?: string;
}

export interface NodeResponse {
  id: string;
  name: string;
  isOnline: boolean;
  grade: GradeResponse;
  connectionInfo?: NetworkInfo;
}

export interface ClusterResponse {
  clusterID: string;
  name: string;
  nodes: NodeResponse[];
  connectionInfo?: NetworkInfo;
}

export type ClusterStatus =
  | { status: "online"; cluster: ClusterResponse }
  | { status: "offline" }
  | { status: "underConstruction"; message: string };

export interface DashboardResponse {
  summaryCards: SummaryCard[];
  clusterStatus: ClusterStatus;
}

// --- Node List ---

export interface NodeListResponse {
  nodes: NodeResponse[];
  total: number;
}

// --- Node Creation ---

export type GeneralSecurityAccess = "public" | "private" | "restricted";

export interface CreateNodeRequest {
  name?: string;
  clusterID: string;
  access?: GeneralSecurityAccess;
}

// --- Conversations & Messages ---

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  messageCount: number;
}

export interface ConversationListResponse {
  conversations: ConversationSummary[];
  total: number;
}

export type MessageAuthorType = "user" | "cluster" | "system" | "node" | "external";

export interface MessageSummary {
  id: string;
  content: string;
  authorType: MessageAuthorType;
  authorID: string;
  createdAt?: string;
}

export interface MessageListResponse {
  messages: MessageSummary[];
  total: number;
}

// --- Node History (Interaction Stats) ---

export type NodeHistoryType =
  | "initialization"
  | "registration"
  | "querySent"
  | "queryFailed"
  | "querySucceeded";

export interface NodeHistoryEntry {
  id: string;
  type: NodeHistoryType;
  description: string;
  createdAt?: string;
}

export interface NodeHistoryListResponse {
  entries: NodeHistoryEntry[];
  total: number;
}
