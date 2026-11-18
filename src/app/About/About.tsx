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
          We make AI specialists <span>easy</span>.
        </h1>
        <p className={styles.intro}>
          ButteryAI is the operating system for AI specialists. We collapsed the AI tech stack into one system, so any
          company can build, deploy and share its own AI specialists on almost any model.
        </p>
      </header>

      <div className={styles.visual}>
        <ProductWindow
          clusterName="Support Team"
          conversationTitle="Return Window Question"
          userMessage="a customer wants to return a jacket after 40 days. can they?"
          metrics={[
            { label: "specialist", value: "Support Specialist", tone: "blue" },
            { label: "route", value: "Re-routed", tone: "muted" },
            { label: "trust", value: "Trusted", tone: "good" },
          ]}
        >
          Not for a refund. Refunds close at <b>30 days</b>, but your <b>Returns Policy</b> allows store credit up to{" "}
          <b>60 days</b>. Offer store credit.
        </ProductWindow>
      </div>

      <section className={styles.info}>
        <h2 className={styles.infoHeading}>The future of AI is specialized. We built the system for it.</h2>
        <div className={styles.infoBody}>
          <p>
            Companies don&apos;t need one AI that does everything. They need AI specialists, each built for its job and
            grounded in what the company knows.
          </p>
          <p>
            Building AI usually means stitching together a pile of tools: vector databases, orchestration frameworks,
            model routers, eval tools, guardrails, monitoring and the glue code between them. ButteryAI replaces the
            pile. Bring almost any model. We handle the orchestration, routing, trust and knowledge.
          </p>
          <p>
            Inside, our real-time metric system tracks and scores every answer. It catches hallucinations and makes the
            AI retry under new guidance, or re-routes the work to a better-fit specialist. The more your specialists
            work, the smarter they get. And you can publish and share them securely.
          </p>
        </div>
      </section>

      <HomeTeam />
      <HomeFooter />
    </>
  );
};

export default About;
