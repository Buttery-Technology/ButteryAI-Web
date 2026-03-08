import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { SummaryCard } from "../../types/api";
import styles from "./SummaryCards.module.scss";

interface Props {
  cards: SummaryCard[];
  isLoading?: boolean;
}

const SummaryCards = ({ cards, isLoading }: Props) => {
  const navigate = useNavigate();

  const handleCardClick = useCallback(
    (card: SummaryCard) => {
      switch (card.actionType) {
        case "navigate":
          if (card.actionTarget) navigate(card.actionTarget);
          break;
        case "external":
          if (card.actionTarget) window.open(card.actionTarget, "_blank");
          break;
        case "none":
          break;
      }
    },
    [navigate],
  );

  if (cards.length === 0) return null;

  return (
    <ul className={styles.cards}>
      {cards.map((card, i) => (
        <li
          key={card.header + i}
          className={`${card.status ? styles[card.status] : ""} ${card.actionType !== "none" ? styles.clickable : styles.noAction}`}
          onClick={card.actionType !== "none" ? () => handleCardClick(card) : undefined}
        >
          <h2>{card.header}</h2>
          <h3>
            {isLoading ? "—" : card.title}
            {card.trend === "up" ? " ↑" : card.trend === "down" ? " ↓" : ""}
          </h3>
          <p>{card.description}</p>
        </li>
      ))}
    </ul>
  );
};

export { SummaryCards };
export default SummaryCards;
