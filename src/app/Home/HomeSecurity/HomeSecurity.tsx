import Padlock from "@assets/icons/padlock.svg?react";
import CheckCircle from "@assets/icons/check-circle.svg?react";
import styles from "./HomeSecurity.module.scss";

const HomeSecurity = () => (
  <section className={styles.root} data-section="security">
    <div className={styles.content}>
      <div className={styles.hexIcon}>
        <svg viewBox="0 0 468 540" className={styles.hexSvg}>
          <path
            d="M273 22
               L427 112
               Q468 135 468 180
               L468 360
               Q468 405 427 428
               L273 518
               Q234 540 195 518
               L41 428
               Q0 405 0 360
               L0 180
               Q0 135 41 112
               L195 22
               Q234 0 273 22
               Z"
            fill="#CB257E"
          />
        </svg>
        <Padlock className={styles.securityIcon} />
      </div>
      <h1 className={styles.title}>Advanced Security</h1>
      <p className={styles.description}>
        ButteryAI uses advanced security to ensure your AI is secure and private. For instance, all clients, API's, and
        systems must use security certificates when communicating with ButteryAI and must establish E2EE when possible.
        This means ButteryAI starts from a point of no trust and works backwards from there.
      </p>
      <ul className={styles.list}>
        <li className={styles.item}>
          <h2>Encryption</h2>
          <p>
            ButteryAI uses E2EE for peak privacy and security. Additionally, ButteryAI encrypts all data and can only be
            decrypted by the user.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </li>
        <li className={styles.item}>
          <h2>Advanced Verification</h2>
          <p>
            ButteryAI uses security certificates to ensure all communications within and to ButteryAI is verified and
            authentic.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </li>
        <li className={styles.item}>
          <h2>IP Secure</h2>
          <p>
            ButteryAI protects your intellectual property. Encrypted conversations ensure your IP is secure and your
            data can only be accessed by you.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </li>
      </ul>
    </div>
  </section>
);

export default HomeSecurity;
