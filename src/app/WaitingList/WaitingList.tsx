import { useDocumentTitle } from "@hooks";
import { INFO_EMAIL } from "@common/contact";
import { Header } from "./Header";
import { Form } from "./Form";
import styles from "./WaitingList.module.scss";

const WaitingList = () => {
  useDocumentTitle("Request access – ButteryAI");

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Header />
          <Form />
          <noscript>
            <style>{"form{display:none!important}"}</style>
            <p className={styles.noscript}>
              Turn on JavaScript to request access, or email <a href={`mailto:${INFO_EMAIL}`}>{INFO_EMAIL}</a>.
            </p>
          </noscript>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
