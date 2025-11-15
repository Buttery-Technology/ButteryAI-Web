import { Link } from "react-router-dom";
import { LinkButton } from "@global";
import transform from "@assets/images/transform.png";
import styles from "./HomeTransform.module.scss";

const HomeTransform = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <strong className={styles.superHeadline}>Do more, faster, verifiably, and securely.</strong>
      <h1 className={styles.title}>
        AI that <span>transforms</span> reality.
      </h1>
      <p>
        ButteryAI is the first distributed AI platform that combines simplicity with power. Built for companies looking
        for a flexible scalable system that’s trustworthy and secure, ButteryAI makes it easy to connect different AIs.
        Whether locally over a secure intranet or in remote locations, ButteryAI provides the backbone for a continuous
        flow of communication and information. Its core constantly verifies the reliability and safety of all
        interactions, ensuring that decisions are based on solid, verifiable data.
      </p>
      <p>
        Already invested in an LLM server? No problem. Simply upload the LLM or connect it to start leveraging
        ButteryAI’s amazing benefits.{" "}
        <Link to="/" className={styles.link}>
          Learn more
        </Link>
        .
      </p>
      <div className={styles.buttons}>
        <LinkButton to="/login" hasBackground>
          Get started for free
        </LinkButton>
        <LinkButton to="/">Schedule a demo</LinkButton>
      </div>
    </div>
    <img src={transform} alt="ButteryAI transforms reality" />
  </section>
);

export default HomeTransform;
