import { Link } from "react-router-dom";
import ClusterSample from "@assets/images/cluster-sample.svg?react";
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

const Cluster = ({ summaryCards, nodes, isLoading }: Props) => {
  const cards = summaryCards.length > 0 ? summaryCards : FALLBACK_CARDS;
  const firstNodeId = nodes.length > 0 ? nodes[0].id : null;

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
      <div className={styles.imgWrapper}>
        <ClusterSample className={styles.clusterSample} />
        <Link to={firstNodeId ? `/node/${firstNodeId}/overview` : "/node/overview"} className={styles.link1} />
        <Link to="/node/new" className={styles.link2} />
      </div>
      <Chat />
    </section>
  );
};

export default Cluster;
