import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@hooks";
import type { SummaryCard, Extension, ExtensionTemplate } from "../../../types/api";
import { ExtensionLogo } from "./ExtensionLogo";
import { SetUpExtension } from "./SetUpExtension";
import { SetUpExtensionForm } from "./SetUpExtensionForm";
import styles from "./Settings.module.scss";

interface Props {
  valueCards: SummaryCard[];
  trustCards: SummaryCard[];
  extensions: Extension[];
  extensionTemplates: ExtensionTemplate[];
  isLoading: boolean;
}

const fallbackCards: SummaryCard[] = [
  { type: "value", header: "Summary", title: "—", description: "Loading...", actionType: "none", actionTarget: "", order: 1 },
  { type: "value", header: "Value", title: "—", description: "Loading...", actionType: "none", actionTarget: "", order: 2 },
  { type: "security", header: "Security", title: "—", description: "Loading...", actionType: "none", actionTarget: "", order: 3 },
  { type: "activity", header: "Activity", title: "—", description: "Loading...", actionType: "none", actionTarget: "", order: 4 },
];

const extensionFunctionLabel: Record<string, string> = {
  aiModel: "AI Model",
  all: "All Functions",
  storage: "Storage",
  analytics: "Analytics",
  advancedMetrics: "Advanced Metrics",
  mcp: "MCP",
};

const Settings = ({ valueCards, trustCards, extensions, extensionTemplates, isLoading }: Props) => {
  const { signOut } = useUserContext();
  const navigate = useNavigate();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ExtensionTemplate | null>(null);

  const handleCardClick = useCallback((card: SummaryCard) => {
    switch (card.actionType) {
      case "navigate":
        if (card.actionTarget) navigate(card.actionTarget);
        break;
      case "sheet":
        // Sheet handling can be added when needed
        break;
      case "external":
        if (card.actionTarget) window.open(card.actionTarget, "_blank");
        break;
      case "none":
        break;
    }
  }, [navigate]);

  const displayValueCards = valueCards.length > 0 ? valueCards : fallbackCards;
  const displayTrustCards = trustCards.length > 0 ? trustCards : fallbackCards;

  const valueSummary = displayValueCards.find((c) => c.header === "Summary");
  const trustSummary = displayTrustCards.find((c) => c.header === "Summary");

  return (
  <section className={styles.root}>
    <div className={styles.section}>
      <div className={styles.sectionHeader}><strong>Knowledge Engine</strong></div>
      <p>{valueSummary?.metric != null ? `${valueSummary.title} Value Score` : "No values, knowledge, or experience learned yet."}</p>
      <ul className={styles.infoCards}>
        {displayValueCards.map((card, i) => (
          <li
            key={card.header + i}
            className={`${card.status ? styles[card.status] : ""} ${card.actionType !== "none" ? styles.clickable : styles.noAction}`}
            onClick={card.actionType !== "none" ? () => handleCardClick(card) : undefined}
          >
            <h2>{card.header}</h2>
            <h3>{isLoading ? "—" : card.title}{card.trend === "up" ? " ↑" : card.trend === "down" ? " ↓" : ""}</h3>
            <p>{card.description}</p>
          </li>
        ))}
      </ul>
    </div>

    <div className={styles.section}>
      <div className={styles.sectionHeader}><strong>Trust Engine</strong></div>
      <p>{trustSummary?.metric != null ? `${trustSummary.title} Trust Score` : "No trust values or scores learned yet."}</p>
      <ul className={styles.infoCards}>
        {displayTrustCards.map((card, i) => (
          <li
            key={card.header + i}
            className={`${card.status ? styles[card.status] : ""} ${card.actionType !== "none" ? styles.clickable : styles.noAction}`}
            onClick={card.actionType !== "none" ? () => handleCardClick(card) : undefined}
          >
            <h2>{card.header}</h2>
            <h3>{isLoading ? "—" : card.title}{card.trend === "up" ? " ↑" : card.trend === "down" ? " ↓" : ""}</h3>
            <p>{card.description}</p>
          </li>
        ))}
      </ul>
    </div>

    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <strong>Extensions</strong>
        <button className={styles.addButton} type="button" aria-label="Add extension" onClick={() => setShowSetupModal(true)} />
      </div>
      <p>Extensions allow you to extend or continue functionality or workflow through an application, API, or even a node.</p>
      {extensions.length > 0 ? (
        <ul className={styles.extensionCards}>
          {extensions.map((ext) => (
            <li key={ext.id} className={styles.extensionCard}>
              <ExtensionLogo />
              <h2>{ext.name}</h2>
              <h3>{ext.mainFunction ? (extensionFunctionLabel[ext.mainFunction.type] ?? ext.mainFunction.type) : ext.description}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyState}>No extensions configured yet.</p>
      )}
    </div>

    <div className={styles.section}>
      <div className={styles.sectionHeader}><strong>Developer</strong></div>
      <p>Manage API keys for external integrations and scripts.</p>
      <Link to="/dashboard/api-keys" className={styles.apiKeysLink}>
        Manage API Keys &rarr;
      </Link>
    </div>

    <button className={styles.logoutButton} onClick={signOut}>
      Log out
    </button>

    {showSetupModal && (
      <SetUpExtension
        templates={extensionTemplates}
        onSelect={(template) => {
          setShowSetupModal(false);
          setSelectedTemplate(template);
        }}
        onClose={() => setShowSetupModal(false)}
      />
    )}

    {selectedTemplate && (
      <SetUpExtensionForm
        template={selectedTemplate}
        onBack={() => {
          setSelectedTemplate(null);
          setShowSetupModal(true);
        }}
        onClose={() => setSelectedTemplate(null)}
        onFinish={() => setSelectedTemplate(null)}
      />
    )}
  </section>
  );
};

export default Settings;
