import CheckCircle from "@assets/icons/check-circle.svg?react";
import styles from "./HomeSecurity.module.scss";

const HomeSecurity = () => (
  <section className={styles.root} data-section="security">
    <div className={styles.grid}>
      <div className={styles.panel}>
        <div className={styles.miniCard}>
          <div>
            <div className={styles.miniLabel}>Conversation</div>
            <div className={styles.miniMeta}>AES-256-GCM · forward secrecy</div>
          </div>
          <span className={`${styles.tag} ${styles.enc}`}>🔒 Encrypted</span>
        </div>
        <div className={styles.miniCard}>
          <div>
            <div className={styles.miniLabel}>Node ↔ Router</div>
            <div className={styles.miniMeta}>mutual TLS · P-384</div>
          </div>
          <span className={`${styles.tag} ${styles.enc}`}>🔒 mTLS</span>
        </div>
        <div className={styles.miniCard}>
          <div>
            <div className={styles.miniLabel}>New device</div>
            <div className={styles.miniMeta}>awaiting approval · expires 24h</div>
          </div>
          <span className={`${styles.tag} ${styles.appr}`}>Pending</span>
        </div>
        <div className={styles.miniCard}>
          <div>
            <div className={styles.miniLabel}>Server access to plaintext</div>
            <div className={styles.miniMeta}>zero-knowledge architecture</div>
          </div>
          <span className={`${styles.tag} ${styles.deny}`}>None</span>
        </div>
      </div>

      <div>
        <h2 className={styles.title}>
          Encrypted end-to-end. <span>Yours alone.</span>
        </h2>
        <p className={styles.kicker}>Security that never rests.</p>
        <p className={styles.body}>
          ButteryAI starts from zero trust and works backwards. The server never sees your plaintext, and your data never
          has to leave your walls.
        </p>
        <div className={styles.list}>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>End-to-end encryption.</b> Signal-protocol E2EE with forward secrecy — a zero-knowledge server by
              design.
            </span>
          </div>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Verified by certificate.</b> Every client, API, and node authenticates over mutual TLS. No cert, no
              entry.
            </span>
          </div>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Local-first & on-prem.</b> Run entirely inside your own infrastructure — your IP stays your IP.
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HomeSecurity;
