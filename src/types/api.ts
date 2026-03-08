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

export type CardType = "health" | "activity" | "grade" | "knowledge" | "onboarding" | "value" | "trust" | "security";
export type CardActionType = "navigate" | "sheet" | "external" | "none";
export type CardTrend = "up" | "down" | "stable";
export type CardStatus = "good" | "warning" | "critical";

export interface SummaryCard {
  type: CardType;
  header: string;
  title: string;
  description: string;
  actionType: CardActionType;
  actionTarget: string;
  order: number;
  metric?: number;
  trend?: CardTrend;
  status?: CardStatus;
}

// --- Cluster ---

export interface NetworkInfo {
  ipAddress: string;
  port: number;
  macAddress?: string;
  connectPort?: number;
}

export interface NodeResponse {
  id: string;
  name: string;
  isOnline: boolean;
  grade: GradeResponse;
  connectionInfo?: NetworkInfo;
  extensionID?: string;
}

export interface ClusterResponse {
  clusterID: string;
  name: string;
  nodes: NodeResponse[];
  connectionInfo?: NetworkInfo;
}

// Swift default enum encoding: { "online": { "_0": { ... } } } | { "offline": {} } | { "underConstruction": { "_0": "msg" } }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawClusterStatus = any;

export type ClusterStatus =
  | { status: "online"; cluster: ClusterResponse }
  | { status: "offline" }
  | { status: "underConstruction"; message: string };

export function parseClusterStatus(raw: RawClusterStatus): ClusterStatus {
  if (!raw || raw === "offline") return { status: "offline" };
  if ("online" in raw) {
    // Swift wraps associated values in "_0"
    const cluster = raw.online?._0 ?? raw.online;
    return { status: "online", cluster };
  }
  if ("underConstruction" in raw) {
    const message = raw.underConstruction?._0 ?? raw.underConstruction;
    return { status: "underConstruction", message };
  }
  return { status: "offline" };
}

// --- Extensions ---

export type ExtensionFunctionType = "aiModel" | "all" | "storage" | "analytics" | "advancedMetrics" | "mcp";

export interface ExtensionFunction {
  endpoint: string;
  apiKey: string;
  type: ExtensionFunctionType;
  supportedCRUDTypes: string[];
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  isFullySetUp: boolean;
  mainFunction?: ExtensionFunction;
  supportedFunctions: ExtensionFunction[];
  verifiedFunctions: ExtensionFunction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExtensionTemplateField {
  key: string;
  label: string;
  description: string;
  isRequired: boolean;
  placeholder: string;
}

export type ExtensionTemplateCategory = "aiModel" | "cloudProvider" | "storage" | "analytics" | "mcp" | "other";

export interface ExtensionTemplate {
  id: string;
  provider: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  category: ExtensionTemplateCategory;
  fields: ExtensionTemplateField[];
  isActive: boolean;
  isComingSoon: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardTab {
  id: string;
  label: string;
  icon: string;
  route: string;
  order: number;
}

export interface DashboardResponse {
  summaryCards: SummaryCard[];
  valueCards: SummaryCard[];
  trustCards: SummaryCard[];
  extensions: Extension[];
  extensionTemplates: ExtensionTemplate[];
  clusterStatus: ClusterStatus;
  tabs: DashboardTab[];
}

// --- Node Detail (server-driven) ---

export interface NodeDetailResponse {
  node: NodeResponse;
  overviewCards: SummaryCard[];
  valueCards: SummaryCard[];
  trustCards: SummaryCard[];
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

// --- Node Knowledge ---

export type UnderlyingDataType = "audio" | "document" | "file" | "image" | "link" | "video";

export interface NodeKnowledge {
  knowledgeID: string;
  name: string;
  description: string;
  underlyingDataType: UnderlyingDataType;
  categories: string[];
  tags: string[];
  hasUnderlyingData: boolean;
  associatedAt?: string;
}

// --- Conversations & Messages ---

export type ConversationType = "node" | "cluster";

export interface ConversationSummary {
  id: string;
  title: string;
  type: ConversationType;
  nodeID?: string;
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

// --- API Keys ---

export type APIKeyRole = "basic" | "editor" | "admin";

export interface APIKeyResponse {
  id: string;
  name: string;
  keyPrefix: string;
  role: APIKeyRole;
  clusterID: string;
  createdAt?: string;
  lastUsedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
}

export interface APIKeyCreationResponse extends APIKeyResponse {
  rawKey: string;
}

export interface APIKeyListResponse {
  keys: APIKeyResponse[];
  total: number;
}

// --- Cluster Invite ---

export interface ClusterInviteRedeemResponse {
  clusterID: string;
  clusterName: string;
  role: string;
}

// --- Cluster Connect ---

export interface ConnectResponse {
  token: string;
  connectionInfo: NetworkInfo;
  expiresAt: string;
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
