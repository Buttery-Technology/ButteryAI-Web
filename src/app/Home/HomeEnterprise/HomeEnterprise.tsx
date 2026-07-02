import styles from "./HomeEnterprise.module.scss";

const CAPABILITIES = [
  {
    eyebrow: "Encryption",
    title: "Encrypted everywhere.",
    body: "Signal-protocol E2EE, mutual-TLS between nodes, and AES-256 at rest. The server never sees your plaintext.",
  },
  {
    eyebrow: "Access",
    title: "SSO & RBAC.",
    body: "SAML SSO, SCIM auto-provisioning, and per-org roles (owner / admin / member / viewer).",
  },
  {
    eyebrow: "Governance",
    title: "Policy & audit.",
    body: "Programmable policies (allow, deny, require approval) and a tamper-evident audit trail you can export for SOC 2 and GDPR.",
  },
  {
    eyebrow: "Sovereignty",
    title: "Runs where your data lives.",
    body: "On-device, on-prem, or dedicated single-tenant cloud. BYOK / customer-managed keys. Your data never leaves your walls.",
  },
  {
    eyebrow: "Compliance",
    title: "Audit-ready posture.",
    body: "SOC 2 program, HIPAA + BAA, and custom data residency for regulated production.",
  },
  {
    eyebrow: "No lock-in",
    title: "Own the whole stack.",
    body: "Pure Swift, no Python, any open or frontier model (local GGUF or OpenAI, Anthropic, Gemini). No per-token tax.",
  },
];

const HomeEnterprise = () => (
  <section className={styles.root} data-section="enterprise" id="security">
    <div className={styles.header}>
      <span className={styles.eyebrow}>Enterprise-ready</span>
      <h2 className={styles.title}>
        Built for security, governance, and <span>compliance</span>.
      </h2>
      <p className={styles.subtitle}>
        Zero-trust by design. Your data, your infrastructure, your rules — accountable on every request.
      </p>
    </div>

    <div className={styles.grid}>
      {CAPABILITIES.map((c) => (
        <article key={c.eyebrow} className={styles.card}>
          <span className={styles.cardEyebrow}>{c.eyebrow}</span>
          <h3 className={styles.cardTitle}>{c.title}</h3>
          <p className={styles.cardBody}>{c.body}</p>
        </article>
      ))}
    </div>
  </section>
);

export default HomeEnterprise;
