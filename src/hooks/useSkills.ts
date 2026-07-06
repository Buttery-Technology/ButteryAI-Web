import { useCallback, useEffect, useState } from "react";
import { GET_SKILLS, GET_SKILL, CREATE_SKILL, UPDATE_SKILL, DELETE_SKILL } from "../api";
import type { SkillResponse } from "../types/skill";

export interface CreateSkillInput {
  body: string;
  title?: string;
  summary?: string;
  keywords?: string[];
  domain?: string;
  scope?: string;
}

export function useSkills() {
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);   // clear any stale failure banner on a fresh (re)load
      const { url, options } = GET_SKILLS();
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      setSkills(data.skills ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  /** Fetch a single skill including its full body (list responses omit the body). */
  const getSkill = useCallback(async (id: string): Promise<SkillResponse | null> => {
    try {
      const { url, options } = GET_SKILL(id);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to fetch skill");
      return (await res.json()) as SkillResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load skill");
      return null;
    }
  }, []);

  const createSkill = useCallback(async (input: CreateSkillInput): Promise<string | null> => {
    try {
      const { url, options } = CREATE_SKILL(input);
      const res = await fetch(url, options);
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to create skill: ${res.status} ${body}`);
      }
      const data = await res.json();
      await fetchSkills();
      return data.id as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create skill");
      return null;
    }
  }, [fetchSkills]);

  const updateSkill = useCallback(async (id: string, data: Record<string, unknown>): Promise<boolean> => {
    try {
      const { url, options } = UPDATE_SKILL(id, data);
      const res = await fetch(url, options);
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to update skill: ${res.status} ${body}`);
      }
      await fetchSkills();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update skill");
      return false;
    }
  }, [fetchSkills]);

  const deleteSkill = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { url, options } = DELETE_SKILL(id);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to delete skill");
      await fetchSkills();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill");
      return false;
    }
  }, [fetchSkills]);

  return { skills, total, isLoading, error, refetch: fetchSkills, getSkill, createSkill, updateSkill, deleteSkill };
}
