import { type Message } from "../Chat";
import styles from "./History.module.scss";

type HistoryProps = {
  messages: Message[];
};

const History = ({ messages }: HistoryProps) => (
  <div className={styles.root}>
    <h2>Full Chat History:</h2>
    {messages.map(({ sender, text }, i) => (
      <p key={i} className={styles.message}>
        [{new Date().toLocaleTimeString()}] {sender.toUpperCase()}: {text}
      </p>
    ))}
  </div>
);

export default History;
