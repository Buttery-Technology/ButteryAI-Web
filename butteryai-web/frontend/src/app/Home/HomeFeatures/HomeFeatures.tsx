import { LinkButton } from "../../Global/LinkButton";
import visualAuditTrail from "../../../assets/images/visual-audit-trail.svg";
import styles from "./HomeFeatures.module.scss";

const HomeFeatures = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <strong className={styles.superHeadline}>Trust the source, by defining the truth.</strong>
      <h1 className={styles.title}>
        <span>Define</span> the narrative.
      </h1>
      <p>
        ButteryAI is always making sure those connected to the Hive are communicating against known sources-of-truth and
        evaluating their trustworthiness. This gives greater control and security for the ButteryAI platform. Enterprise
        customers get even deeper control through customizing the sources-of-truth ButteryAI uses for their Hive.
      </p>
      <LinkButton to="/login" hasBackground>
        Start defining truth
      </LinkButton>
    </div>
    <img src={visualAuditTrail} alt="ButteryAI — Visual Audit Trail" />
  </section>
);

export default HomeFeatures;
