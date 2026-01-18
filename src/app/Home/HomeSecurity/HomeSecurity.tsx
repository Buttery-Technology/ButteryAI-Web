import { HexIcon } from "@common/icons";
import Padlock from "@assets/icons/padlock.svg?react";
import Checkmark from "@assets/icons/checkmark.svg?react";
import styles from "./HomeSecurity.module.scss";

const HomeSecurity = () => (
  <section className={styles.root} data-section="security">
    <div className={styles.content}>
      <HexIcon color="#CB257E" icon={<Padlock />} className={styles.hexIcon} />
      <h1 className={styles.title}>Advanced Security</h1>
      <p>
        ButteryAI uses advanced security to ensure your AI is secure and private. For instance, all clients, API’s, and
        systems must use security certificates when communicating with ButteryAI and must establish E2EE when possible.
        This means ButteryAI is starts from a point of no trust and works backwards from there.
      </p>
      <ul className={styles.list}>
        <li className={styles.item}>
          <h2>Encryption</h2>
          <p>
            ButteryAI uses E2EE for peak privacy and security. Additionally, ButteryAI encrypts all data and can only be
            decrypted by the user.
          </p>
          <Checkmark />
        </li>
        <li className={styles.item}>
          <h2>Advanced Verification</h2>
          <p>
            ButteryAI uses security certificates to ensure all communications within and to ButteryAI is verified and
            authentic.
          </p>
          <Checkmark />
        </li>
        <li className={styles.item}>
          <h2>IP Secure</h2>
          <p>
            ButteryAI protects your intellectual property. Encrypted conversations ensure your IP is secure and your
            data can only be accessed by you.
          </p>
          <Checkmark />
        </li>
      </ul>
    </div>
  </section>
);

export default HomeSecurity;
