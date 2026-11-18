import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@hooks";
import { openEnterpriseEmail } from "@common/contact";
import CheckCircle from "@assets/icons/check-circle.svg?react";
import { NavBar } from "../NavBar";
import { HomeFooter } from "../Home/HomeFooter";
import styles from "./Pricing.module.scss";

type Plan = {
  tier: string;
  name: string;
  tagline: string;
  price: string;
  unit?: string;
  meta?: string;
  cta: string;
  popular?: boolean;
  highlights: string[];
};

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
      "Community support",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    tagline: "Personal power user",
    price: "$75",
    unit: "/ seat / mo",
    cta: "Start building",
    popular: true,
    highlights: [
      "Everything in Free, plus:",
      "Hybrid + intelligent routing",
      "Full Knowledge + Trust Intelligence",
      "5M platform tokens / month",
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
    cta: "Start a team",
    highlights: [
      "Everything in Pro, plus:",
      "Per-org RBAC",
      "30M pooled tokens / month",
      "SOC 2 — coming 2027",
      "Email support (8h business)",
    ],
  },
  {
    tier: "enterprise",
    name: "Enterprise",
    tagline: "For regulated production",
    price: "Custom",
    cta: "Talk to sales",
    highlights: [
      "Everything in Team, plus:",
      "Dedicated CSM + SLA",
    ],
  },
];

type Row = { label: string; cells: [string, string, string, string] };
type Group = { category: string; rows: Row[] };

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
      { label: "Encryption — transport", cells: ["TLS to server", "TLS to server", "TLS to server", "TLS to server"] },
      { label: "Permissions & RBAC", cells: ["Self-only", "Per-cluster", "Per-org roles", "Per-org roles"] },
      { label: "Governance", cells: ["—", "Basic policy gates", "Per-org custom policies", "+ compliance reporting + export"] },
      { label: "Compliance posture", cells: ["—", "—", "SOC 2 — coming 2027", "SOC 2 — coming 2027"] },
    ],
  },
  {
    category: "Operations",
    rows: [
      { label: "Sign-in", cells: ["Email + Google", "Email + Google", "Email + Google", "Email + Google"] },
      { label: "Snapshots", cells: ["Manual", "Manual + 7 retained", "Auto-daily + 30 retained", "Custom + cross-region"] },
      { label: "Support", cells: ["Community", "Email (48h)", "Email (8h) + onboarding", "Slack + SLA + named CSM"] },
    ],
  },
  {
    category: "Usage",
    rows: [
      { label: "Included platform tokens / mo", cells: ["500K", "5M", "30M pooled / org", "Unlimited / 500M+ committed"] },
      { label: "Pre-query token estimate", cells: ["—", "Coming soon", "Coming soon", "Coming soon"] },
      { label: "Overage rate", cells: ["Hard cap", "$0.50 / 1M tokens", "$0.30 / 1M tokens", "Custom committed"] },
    ],
  },
];

const Pricing = () => {
  useDocumentTitle("Pricing – ButteryAI");

  const renderCell = (value: string) =>
    value === "—" ? null : (
      <span className={styles.cell}>
        {!/coming/i.test(value) && <CheckCircle className={styles.cellCheck} />}
        <span>{value}</span>
      </span>
    );

  return (
    <>
      <NavBar />

      <main className={styles.root}>
        <header className={styles.header}>
          <h1 className={styles.title}>Pricing</h1>
          <p className={styles.subtitle}>
            Own your AI. Pay only for what scales — local-first inference is always free and unlimited.
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
                {plan.tier === "enterprise" ? (
                  <button type="button" className={styles.btnGhost} onClick={openEnterpriseEmail}>
                    {plan.cta}
                  </button>
                ) : (
                  <Link to="/download" className={plan.popular ? styles.btnPrimary : styles.btnGhost}>
                    {plan.cta}
                  </Link>
                )}
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
          Every plan includes local-first inference and a step-by-step record of every answer. Prices in USD.
          Team requires a 3-seat minimum; Enterprise is custom-quoted on top of the published floor.
        </p>
      </main>

      <HomeFooter />
    </>
  );
};

export default Pricing;
