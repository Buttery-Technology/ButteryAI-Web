import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import CheckCircle from "@assets/icons/check-circle.svg?react";
import { HomeFooter } from "../Home/HomeFooter";
import styles from "./Pricing.module.scss";

type Plan = {
  tier: string;
  name: string;
  tagline: string;
  price: string;
  unit?: string;
  meta?: string;
  founderNote?: string;
  cta: string;
  popular?: boolean;
  highlights: string[];
};

// Mirrors ButteryAI-Server/Sources/App/Subscriptions/PlanCatalog.swift
// (current standard prices; Founder's pricing ships as a separate promo).
const PLANS: Plan[] = [
  {
    tier: "free",
    name: "Free",
    tagline: "Try the platform on your hardware",
    price: "$0",
    unit: "/ forever",
    cta: "Start free",
    highlights: [
      "Local-first inference (unlimited)",
      "500K platform tokens / month",
      "5 premium-engine queries / day",
      "24-hour audit retention",
      "Community support",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    tagline: "Personal power user",
    price: "$75",
    unit: "/ seat / mo",
    founderNote: "Founding: $50 / seat · year one",
    cta: "Start building",
    popular: true,
    highlights: [
      "Everything in Free, plus:",
      "Hybrid + intelligent routing",
      "Full Knowledge + Trust Intelligence",
      "5M platform tokens / month",
      "mTLS + E2EE for chat",
      "Email support (48h)",
    ],
  },
  {
    tier: "team",
    name: "Team",
    tagline: "For working teams",
    price: "$125",
    unit: "/ seat / mo",
    meta: "3-seat minimum",
    founderNote: "Founding: $75 / seat · year one",
    cta: "Start a team",
    highlights: [
      "Everything in Pro, plus:",
      "Per-org RBAC",
      "30M pooled tokens / month",
      "SOC 2 Type I",
      "90-day audit retention",
      "Email support (8h business)",
    ],
  },
  {
    tier: "enterprise",
    name: "Enterprise",
    tagline: "For regulated production",
    price: "Custom",
    meta: "Starting at $3,000 / mo",
    cta: "Talk to sales",
    highlights: [
      "Everything in Team, plus:",
      "SAML SSO + SCIM",
      "BYOK / HSM encryption",
      "SOC 2 Type II + HIPAA + BAA",
      "Dedicated CSM + SLA",
    ],
  },
];

type Row = { label: string; cells: [string, string, string, string] };
type Group = { category: string; rows: Row[] };

// Mirrors the customer-facing tier table in ButteryAI-Server/PRICING_TIERS.md
const COMPARISON: Group[] = [
  {
    category: "Intelligence",
    rows: [
      { label: "Routing engine", cells: ["Local-only", "Hybrid + intelligent", "+ multi-cluster within org", "+ federated cross-org"] },
      { label: "Management engine", cells: ["Basic — single tool", "Multi-step + verification", "Parallel multi-node + allowlists", "BYO orchestration LLM, on-prem"] },
      { label: "KnowledgeIntelligence", cells: ["—", "Auto-extract + scoring", "+ custom criteria, multi-source", "+ domain scoring models"] },
      { label: "TrustIntelligence", cells: ["Self-monitoring only", "Full per-entity scoring", "+ cross-cluster aggregation", "+ federated trust across orgs"] },
      { label: "Knowledge & RAG", cells: ["Local files + BM25", "+ remote embeddings, vector search", "+ multi-cluster sync", "+ BYO embeddings, federated graph"] },
    ],
  },
  {
    category: "Security",
    rows: [
      { label: "Encryption — transport", cells: ["TLS to server", "+ mTLS between nodes", "+ key rotation controls", "+ customer keys / HSM / BYOK"] },
      { label: "Encryption — at rest", cells: ["Local SQLite encrypted", "+ E2EE for chat", "+ audit log encryption", "+ customer-managed keys"] },
      { label: "Permissions & RBAC", cells: ["Self-only", "Per-cluster", "Per-org roles", "+ SAML SSO + SCIM"] },
      { label: "Governance", cells: ["—", "Basic policy gates", "Per-org custom policies", "+ compliance reporting + export"] },
      { label: "Compliance posture", cells: ["—", "—", "SOC 2 Type I", "SOC 2 Type II + HIPAA + BAA"] },
      { label: "Audit retention", cells: ["24 hours", "30 days", "90 days", "Custom (years) + export"] },
    ],
  },
  {
    category: "Operations",
    rows: [
      { label: "Sign-in", cells: ["Email + Google + Passkey", "+ GitHub", "+ Microsoft + OIDC", "+ SAML 2.0"] },
      { label: "Snapshots", cells: ["Manual", "Manual + 7 retained", "Auto-daily + 30 retained", "Custom + cross-region"] },
      { label: "Support", cells: ["Community", "Email (48h)", "Email (8h) + onboarding", "Slack + SLA + named CSM"] },
    ],
  },
  {
    category: "Usage",
    rows: [
      { label: "Included platform tokens / mo", cells: ["500K + daily allowance", "5M", "30M pooled / org", "Unlimited / 500M+ committed"] },
      { label: "Daily premium-engine allowance", cells: ["5 / day", "Unlimited", "Unlimited", "Unlimited"] },
      { label: "Pre-query token estimate", cells: ["—", "Pre-query estimate", "+ per-member drill-down", "+ budget alerts + forecasting"] },
      { label: "Overage rate", cells: ["Hard cap", "$0.50 / 1M tokens", "$0.30 / 1M tokens", "Custom committed"] },
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  const handleCta = (tier: string) => {
    if (tier === "enterprise") {
      window.open("mailto:sales@buttery.technology?subject=ButteryAI%20Enterprise");
      return;
    }
    navigate("/waiting-list");
  };

  const renderCell = (value: string) =>
    value === "—" ? (
      <span className={styles.cellEmpty} aria-label="Not included">
        ✕
      </span>
    ) : (
      <span className={styles.cell}>
        <CheckCircle className={styles.cellCheck} />
        <span>{value}</span>
      </span>
    );

  return (
    <>
      <nav className={styles.topbar}>
        <Link to="/" className={styles.brand}>
          <img src={butteryaiLogo} alt="ButteryAI" />
        </Link>
        <div className={styles.navLinks}>
          <Link to="/about">About</Link>
          <Link to="/login">Log in</Link>
          <button type="button" className={styles.navCta} onClick={() => navigate("/waiting-list")}>
            Start building
          </button>
        </div>
      </nav>

      <main className={styles.root}>
        <header className={styles.header}>
          <h1 className={styles.title}>Pricing</h1>
          <p className={styles.subtitle}>
            Own your AI. Pay only for what scales — local-first inference is always free and unlimited.
          </p>
          <p className={styles.founderLine}>
            <span className={styles.founderBadge}>Founding Member</span>
            Sign up in the first 90 days to lock launch pricing for 12 months.
          </p>
        </header>

        {/* Top: clean columns split by lines, CTAs pinned to the bottom */}
        <div className={styles.grid}>
          {PLANS.map((plan) => (
            <article key={plan.tier} className={styles.col}>
              <h2 className={styles.planName}>{plan.name}</h2>
              <p className={styles.tagline}>{plan.tagline}</p>

              <div className={styles.priceArea}>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{plan.price}</span>
                  {plan.unit && <span className={styles.unit}>{plan.unit}</span>}
                </div>
                {plan.meta && <p className={styles.meta}>{plan.meta}</p>}
                {plan.founderNote && <span className={styles.founderChip}>{plan.founderNote}</span>}
              </div>

              <div className={styles.divider} />

              <ul className={styles.highlights}>
                {plan.highlights.map((feature) => (
                  <li key={feature} className={feature.endsWith("plus:") ? styles.highlightHead : undefined}>
                    {!feature.endsWith("plus:") && <CheckCircle className={styles.check} />}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.ctaWrap}>
                <button type="button" className={styles.btnGhost} onClick={() => handleCta(plan.tier)}>
                  {plan.cta}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Below: full feature comparison */}
        <section className={styles.compare}>
          <h2 className={styles.compareTitle}>Compare every plan</h2>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.corner} />
                  {PLANS.map((plan) => (
                    <th key={plan.tier}>
                      <span className={styles.colName}>{plan.name}</span>
                      <span className={styles.colPrice}>
                        {plan.price}
                        {plan.unit ? ` ${plan.unit}` : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((group) => (
                  <Fragment key={group.category}>
                    <tr className={styles.catRow}>
                      <th colSpan={5}>{group.category}</th>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label}>
                        <th className={styles.rowLabel}>{row.label}</th>
                        {row.cells.map((cell, i) => (
                          <td key={i}>{renderCell(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className={styles.footnote}>
          Every plan includes local-first inference, end-to-end encryption, and the full audit trail. Prices in USD.
          Team requires a 3-seat minimum; Enterprise is custom-quoted on top of the published floor.
        </p>
      </main>

      <HomeFooter />
    </>
  );
};

export default Pricing;
