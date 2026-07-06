import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useSkills } from "../../../hooks/useSkills";
import type { SkillResponse } from "../../../types/skill";
import styles from "./Skills.module.scss";

function formatDate(dateStr?: string): string {
  // Only render a genuine ISO-8601 string. The server should emit ISO for these
  // fields; anything else (a numeric encoding, missing value) shows "—" rather
  // than a bogus 1970 date.
  if (!dateStr || typeof dateStr !== "string") return "—";
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return "—";
  const d = new Date(t);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${month}/${day}/${d.getFullYear()}`;
}

function statusLabel(s: SkillResponse): { text: string; kind: string } {
  if (s.approvalState === "pendingApproval") return { text: "Pending approval", kind: "pending" };
  if (s.approvalState === "rejected") return { text: "Rejected", kind: "rejected" };
  if (!s.enabled) return { text: "Disabled", kind: "disabled" };
  return { text: "Active", kind: "active" };
}

interface FormState {
  id?: string;
  title: string;
  summary: string;
  body: string;
  keywords: string;
  domain: string;
  scope: string;
  version?: number;
}

const emptyForm: FormState = { title: "", summary: "", body: "", keywords: "", domain: "", scope: "device" };

export const Skills = () => {
  const { skills, total, isLoading, error, getSkill, createSkill, updateSkill, deleteSkill } = useSkills();
  const [form, setForm] = useState<FormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Escape closes the editor (basic dialog keyboard support).
  useEffect(() => {
    if (!form) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setForm(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [form]);

  const bodyPreview = useMemo(
    () => (form ? DOMPurify.sanitize(marked.parse(form.body || "") as string) : ""),
    [form],
  );

  const openCreate = () => { setShowPreview(false); setForm({ ...emptyForm }); };

  const openEdit = async (s: SkillResponse) => {
    // The list omits the body; fetch the full skill so the editor is populated.
    const full = (await getSkill(s.id)) ?? s;
    setShowPreview(false);
    setForm({
      id: full.id,
      title: full.title ?? "",
      summary: full.summary ?? "",
      body: full.body ?? "",
      keywords: (full.keywords ?? []).join(", "),
      domain: full.domain ?? "",
      scope: full.scope,
      version: full.version,
    });
  };

  const save = async () => {
    if (!form) return;
    const bodyTrimmed = form.body.trim();
    if (!bodyTrimmed) return;
    setIsSaving(true);
    const keywords = form.keywords.split(",").map((k) => k.trim()).filter(Boolean);
    const ok = form.id
      ? await updateSkill(form.id, {
          title: form.title,
          summary: form.summary,
          body: bodyTrimmed,
          keywords,
          domain: form.domain,
          expectedVersion: form.version,
        })
      : (await createSkill({
          body: bodyTrimmed,
          title: form.title || undefined,
          summary: form.summary || undefined,
          keywords: keywords.length ? keywords : undefined,
          domain: form.domain || undefined,
          scope: form.scope,
        })) !== null;
    setIsSaving(false);
    // Only dismiss on success — on a version conflict / error, keep the sheet open
    // (with the user's edits intact) so they can reconcile and retry.
    if (ok) setForm(null);
  };

  const remove = async (s: SkillResponse) => {
    if (!window.confirm(`Delete skill "${s.title ?? "Untitled"}"?`)) return;
    await deleteSkill(s.id);
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Skills</h1>
          <p className={styles.subtitle}>Reusable procedures injected into context when relevant.</p>
        </div>
        <button className={styles.primaryBtn} onClick={openCreate}>New Skill</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.empty}>Loading…</div>
      ) : skills.length === 0 ? (
        <div className={styles.empty}>No skills yet. Create one, or let DAIS propose them from your sessions.</div>
      ) : (
        <>
          <div className={styles.count}>{total} skill{total === 1 ? "" : "s"}</div>
          <ul className={styles.list}>
            {skills.map((s) => {
              const status = statusLabel(s);
              return (
                <li key={s.id} className={styles.row}>
                  <button className={styles.rowMain} onClick={() => openEdit(s)}>
                    <span className={styles.rowTitle}>{s.title || s.summary || "Untitled skill"}</span>
                    {s.summary && s.title && <span className={styles.rowSummary}>{s.summary}</span>}
                    <span className={styles.rowMeta}>
                      <span className={`${styles.badge} ${styles[status.kind]}`}>{status.text}</span>
                      {s.source === "auto" && <span className={styles.badgeAuto}>DAIS-authored</span>}
                      <span className={styles.scope}>{s.scope}</span>
                      <span className={styles.date}>{formatDate(s.updatedAt ?? s.createdAt)}</span>
                    </span>
                  </button>
                  <button className={styles.deleteBtn} onClick={() => remove(s)} aria-label="Delete skill">✕</button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {form && (
        <div className={styles.overlay} onClick={() => setForm(null)}>
          <div className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="skillSheetTitle" onClick={(e) => e.stopPropagation()}>
            <h2 id="skillSheetTitle" className={styles.sheetTitle}>{form.id ? "Edit Skill" : "New Skill"}</h2>

            <label className={styles.label}>Title
              <input className={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Optional" />
            </label>
            <label className={styles.label}>Summary — when to apply
              <input className={styles.input} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Optional" />
            </label>

            <div className={styles.bodyHeader}>
              <span>Body — the procedure (required, markdown)</span>
              <button type="button" className={styles.linkBtn} onClick={() => setShowPreview((p) => !p)}>
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>
            {showPreview ? (
              <div className={styles.preview} dangerouslySetInnerHTML={{ __html: bodyPreview }} />
            ) : (
              <textarea className={styles.textarea} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={10} placeholder="Step-by-step instructions…" />
            )}

            <label className={styles.label}>Keywords (comma-separated)
              <input className={styles.input} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="deploy, release" />
            </label>
            <label className={styles.label}>Domain
              <input className={styles.input} value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="Optional" />
            </label>
            {!form.id && (
              <label className={styles.label}>Scope
                <select className={styles.input} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}>
                  <option value="device">Device (private)</option>
                  <option value="cluster">Cluster</option>
                  <option value="shared">Shared</option>
                </select>
              </label>
            )}
            {!form.id && form.scope !== "device" && (
              <p className={styles.hint}>Shared skills require human approval before they're used.</p>
            )}

            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={() => setForm(null)}>Cancel</button>
              <button className={styles.primaryBtn} onClick={save} disabled={!form.body.trim() || isSaving}>
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
