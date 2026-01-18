import styles from "./ResetButton.module.scss";

type ResetButtonProps = {
  resetChat: () => void;
};

const ResetButton = ({ resetChat }: ResetButtonProps) => (
  <button className={styles.resetButton} onClick={resetChat}>
    Reset Chat
  </button>
);

export default ResetButton;
