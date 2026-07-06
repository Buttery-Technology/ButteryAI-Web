// --- Skill Enums (mirror DaCom _Skill raw values) ---

export type SkillSource = "user" | "auto";
export type SkillApprovalState = "approved" | "pendingApproval" | "rejected";
export type SkillScope = "device" | "cluster" | "shared";

// --- Skill Responses (mirror GetSkillResponse) ---

export interface SkillResponse {
  id: string;
  title?: string;
  summary?: string;
  /** Full body — omitted on list responses, populated by a single-item fetch. */
  body?: string;
  keywords?: string[];
  domain?: string;
  source: SkillSource;
  approvalState: SkillApprovalState;
  enabled: boolean;
  version: number;
  scope: SkillScope;
  access: string;
  createdAt?: string;
  updatedAt?: string;
  accessCount: number;
}

export interface SkillListResponse {
  skills: SkillResponse[];
  total: number;
}
