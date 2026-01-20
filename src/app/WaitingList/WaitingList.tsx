import { Header } from "./Header";
import { Form } from "./Form";
import styles from "./WaitingList.module.scss";

const WaitingList = () => (
  <div className={styles.root}>
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Header />
        <Form />
      </div>
    </div>
  </div>
);

export default WaitingList;
