import { Link } from "react-router-dom";
import { Chat } from "../Chat";
import type { SummaryCard, NodeResponse } from "../../../types/api";
import styles from "./Cluster.module.scss";

interface Props {
  summaryCards: SummaryCard[];
  nodes: NodeResponse[];
  isLoading: boolean;
}

const FALLBACK_CARDS: SummaryCard[] = [
  { header: "Value", title: "—", description: "Loading...", endpoint: "", order: 1 },
  { header: "Trust", title: "—", description: "Loading...", endpoint: "", order: 2 },
  { header: "Bias", title: "—", description: "Loading...", endpoint: "", order: 3 },
  { header: "Accuracy", title: "—", description: "Loading...", endpoint: "", order: 4 },
];

const HEX_PATH =
  "M273 22 L427 112 Q468 135 468 180 L468 360 Q468 405 427 428 L273 518 Q234 540 195 518 L41 428 Q0 405 0 360 L0 180 Q0 135 41 112 L195 22 Q234 0 273 22 Z";

const MOCK_NODES: NodeResponse[] = [
  {
    id: "1",
    name: "chatGPT 4-o mini",
    isOnline: true,
    grade: {
      overallScore: { value: 92, status: "defined" },
      trust: { value: 88, status: "defined" },
      bias: { value: 15, status: "defined" },
      accuracy: { value: 95, status: "defined" },
    },
  },
  {
    id: "2",
    name: "Meta Llama",
    isOnline: false,
    grade: {
      overallScore: { value: 85, status: "defined" },
      trust: { value: 82, status: "defined" },
      bias: { value: 20, status: "defined" },
      accuracy: { value: 88, status: "defined" },
    },
  },
  {
    id: "3",
    name: "MediScan AI",
    isOnline: true,
    grade: {
      overallScore: { value: 94, status: "defined" },
      trust: { value: 91, status: "defined" },
      bias: { value: 10, status: "defined" },
      accuracy: { value: 97, status: "defined" },
    },
  },
  {
    id: "4",
    name: "Dr. Oracle",
    isOnline: true,
    grade: {
      overallScore: { value: 89, status: "defined" },
      trust: { value: 86, status: "defined" },
      bias: { value: 18, status: "defined" },
      accuracy: { value: 92, status: "defined" },
    },
  },
];

function NodeHex({ node, delay }: { node: NodeResponse; delay: string }) {
  return (
    <Link
      to={`/node/${node.id}/overview`}
      state={{ node }}
      className={styles.hexCell}
      style={{ "--delay": delay } as React.CSSProperties}
    >
      <svg viewBox="0 0 468 540" className={styles.hexBg}>
        <path d={HEX_PATH} fill={node.isOnline ? "#22908C" : "#8E9BA6"} />
      </svg>
      <div className={styles.hexContent}>
        <span className={styles.hexName}>{node.name}</span>
        <span className={styles.hexLinkBadge}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 10L10 2M10 2H4M10 2V8"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

const Cluster = ({ summaryCards, nodes, isLoading }: Props) => {
  const cards = summaryCards.length > 0 ? summaryCards : FALLBACK_CARDS;
  const displayNodes = nodes.length > 0 ? nodes : MOCK_NODES;

  return (
    <section className={styles.root}>
      <ul className={styles.cards}>
        {cards.map((card, i) => (
          <li key={card.header + i}>
            <h2>{card.header}</h2>
            <h3 className={i === 4 ? styles.gradient : undefined}>{isLoading ? "—" : card.title}</h3>
            <p>{card.description}</p>
          </li>
        ))}
      </ul>

      <div className={styles.cluster}>
        {/* Row 0: offset row — up to 2 node hexes */}
        {(displayNodes[0] || displayNodes[1]) && (
          <div className={`${styles.hexRow} ${styles.offsetRow}`}>
            {displayNodes[0] && <NodeHex node={displayNodes[0]} delay="0.1s" />}
            {displayNodes[1] && <NodeHex node={displayNodes[1]} delay="0.12s" />}
          </div>
        )}

        {/* Row 1: base row — node, Core, Add Node */}
        <div className={styles.hexRow}>
          {displayNodes[2] && <NodeHex node={displayNodes[2]} delay="0.1s" />}
          <div
            className={styles.hexCell}
            style={{ "--delay": "0s" } as React.CSSProperties}
          >
            <svg viewBox="0 0 468 540" className={styles.hexBg}>
              <path d={HEX_PATH} fill="#F9C000" />
            </svg>
            <div className={styles.hexContent}>
              <span className={styles.coreName}>Core</span>
            </div>
          </div>
          <Link
            to="/node/new"
            className={`${styles.hexCell} ${styles.addNode}`}
            style={{ "--delay": "0.14s" } as React.CSSProperties}
          >
            <svg viewBox="0 0 468 540" className={styles.hexBg}>
              <path d={HEX_PATH} fill="#D4D8DC" />
            </svg>
            <div className={styles.hexContent}>
              <svg className={styles.plusIcon} viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="#9BA3AB" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" stroke="#9BA3AB" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Row 2: offset row — 1 node hex */}
        {displayNodes[3] && (
          <div className={`${styles.hexRow} ${styles.offsetRow}`}>
            <NodeHex node={displayNodes[3]} delay="0.2s" />
          </div>
        )}
      </div>

      <Chat />
    </section>
  );
};

export default Cluster;
