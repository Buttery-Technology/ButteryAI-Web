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
  features: string[];
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
    features: [
      "Local-first inference (unlimited)",
      "500K platform tokens / month",
      "5 premium-engine queries / day",
      "Local file knowledge base",
      "Email + Google + Passkey sign-in",
      "Manual cluster snapshots",
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
    founderNote: "Founding Member: $50 / seat for your first year",
    cta: "Start building",
    popular: true,
    features: [
      "Everything in Free, plus:",
      "Hybrid + intelligent routing",
      "Full KnowledgeIntelligence + TrustIntelligence",
      "Remote embeddings & vector search",
      "mTLS between nodes, E2EE for chat",
      "5M platform tokens / month",
      "30-day audit retention",
      "Token usage estimation (coming soon)",
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
    founderNote: "Founding Member: $75 / seat for your first year",
    cta: "Start a team",
    features: [
      "Everything in Pro, plus:",
      "Per-org RBAC (owner/admin/member/viewer)",
      "Multi-cluster routing within org",
      "Cross-cluster knowledge sync",
      "30M pooled platform tokens / month",
      "90-day audit retention",
      "SOC 2 Type I",
      "Microsoft + OIDC sign-in",
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
    features: [
      "Everything in Team, plus:",
      "SAML SSO + SCIM auto-provision",
      "BYOK / HSM encryption",
      "Federated routing + trust across orgs",
      "Audit log export, compliance reporting",
      "SOC 2 Type II + HIPAA + BAA",
      "Custom data residency",
      "Dedicated CSM + SLA",
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
          <p className={styles.eyebrow}>Pricing</p>
          <h1 className={styles.title}>
            Own your AI. Pay only for what <span>scales</span>.
          </h1>
          <p className={styles.subtitle}>
            Local-first inference is always free and unlimited — you only pay for the platform that orchestrates,
            scores, secures, and audits it.
          </p>
        </header>

        <div className={styles.founderBanner}>
          🚀 <strong>Founding Member</strong> — sign up in the first 90 days and lock launch pricing for 12 months.
        </div>

        <div className={styles.grid}>
          {PLANS.map((plan) => (
            <article key={plan.tier} className={`${styles.card} ${plan.popular ? styles.popular : ""}`}>
              {plan.popular && <span className={styles.badge}>Most popular</span>}
              <h2 className={styles.planName}>{plan.name}</h2>
              <p className={styles.tagline}>{plan.tagline}</p>

              <div className={styles.priceRow}>
                <span className={styles.price}>{plan.price}</span>
                {plan.unit && <span className={styles.unit}>{plan.unit}</span>}
              </div>
              {plan.meta && <p className={styles.meta}>{plan.meta}</p>}
              {plan.founderNote && <p className={styles.founderNote}>{plan.founderNote}</p>}

              <button
                type="button"
                className={plan.popular ? styles.btnPrimary : styles.btnGhost}
                onClick={() => handleCta(plan.tier)}
              >
                {plan.cta}
              </button>

              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature} className={feature.endsWith("plus:") ? styles.featureHead : undefined}>
                    {!feature.endsWith("plus:") && <CheckCircle className={styles.check} />}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

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
