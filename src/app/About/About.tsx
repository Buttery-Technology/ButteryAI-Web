import { useDocumentTitle } from "@hooks";
import { HomeTeam } from "../Home/HomeTeam";
import { HomeFooter } from "../Home/HomeFooter";
import { NavBar } from "../NavBar";
import { ProductWindow } from "../ProductWindow";
import styles from "./About.module.scss";

const About = () => {
  useDocumentTitle("About – ButteryAI");

  return (
    <>
      <NavBar />

      <header className={styles.hero}>
        <h1 className={styles.title}>
          Building AI you can trust — <span>and own</span>.
        </h1>
        <p className={styles.intro}>
          ButteryAI is a pure-Swift platform for building distributed AI systems you can actually trust — every answer
          is scored for accuracy, encrypted end-to-end, and fully audited, and the whole stack is yours to own.
        </p>
      </header>

      <div className={styles.visual}>
        <ProductWindow
          clusterName="Sales Assistant"
          conversationTitle="Enterprise Plan Inquiry"
          userMessage="Does our Enterprise plan include SAML SSO?"
          metrics={[
            { label: "tokens", value: "9.1k", tone: "blue" },
            { label: "time", value: "1.8s", tone: "muted" },
            { label: "accuracy", value: "100%", tone: "good" },
          ]}
        >
          Yes — <b>SAML SSO</b> and SCIM provisioning are included on Enterprise, alongside BYOK encryption and SOC 2
          Type II. Grounded in your <b>Plans Knowledge Base</b> (source: plan-catalog v3).
        </ProductWindow>
      </div>

      <section className={styles.info}>
        <h2 className={styles.infoHeading}>Built different, from the ground up.</h2>
        <div className={styles.infoBody}>
          <p>
            Most AI tools can&apos;t tell you whether their output is right, where your data went, or who&apos;s
            accountable when something breaks. We started ButteryAI to fix exactly that.
          </p>
          <p>
            Our proprietary DAIS technology lets anyone compose a distributed network of specialized AI nodes — local
            models, RAG, or remote APIs — and deploy it anywhere, from a laptop to on-prem. Every node is intelligently
            orchestrated, scored for trust and accuracy, and governed by policy on every query.
          </p>
          <p>
            It&apos;s pure Swift and local-first: no Python, no per-token lock-in, and your data never has to leave your
            walls. The result is AI that&apos;s fast, accountable, and entirely yours.
          </p>
        </div>
      </section>

      <HomeTeam />
      <HomeFooter />
    </>
  );
};

export default About;
