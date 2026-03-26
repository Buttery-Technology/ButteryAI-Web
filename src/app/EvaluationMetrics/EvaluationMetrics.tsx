import styles from "./EvaluationMetrics.module.scss";
import { HomeFooter } from "../Home/HomeFooter";

const EvaluationMetrics = () => (
  <>
    <article className={styles.root}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Transparency</p>
          <h1 className={styles.title}>Understanding Evaluation Metrics</h1>
          <p className={styles.subtitle}>
            Every response from your AI is evaluated across three dimensions: Value, Trust, and Accuracy.
            Here's how we measure them and why scores are calibrated the way they are.
          </p>
        </header>

        {/* Metric Definitions */}
        <section className={styles.metrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ background: "#288ED2" }}>V</div>
            <h3>Value</h3>
            <p>
              Measures how much useful, relevant information the response provides. A high value score means
              the response directly addresses your query with substantive content. Conversational responses
              score lower because they're appropriate but not deeply informative.
            </p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ background: "#2EBD6B" }}>T</div>
            <h3>Trust</h3>
            <p>
              Reflects the system's confidence in the reliability of the response. It combines source credibility
              assessment with content truthfulness evaluation, powered by the Output Assurance System.
            </p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ background: "#F5A623" }}>A</div>
            <h3>Accuracy</h3>
            <p>
              Indicates the system's confidence that the information is correct and precise. It evaluates
              specificity, factual consistency, and whether claims can be verified. This is the system's
              confidence in its own assessment, not a guarantee of correctness.
            </p>
          </div>
        </section>

        {/* Why Not 100% */}
        <section className={styles.section}>
          <h2>Why Scores Never Reach 100%</h2>
          <p className={styles.sectionIntro}>
            You might notice that even perfectly appropriate responses don't score 100%. This is by design.
            Here's why.
          </p>

          <div className={styles.principle}>
            <h3>1. AI Responses Are Patterns, Not Truths</h3>
            <p>
              When an AI says "I'm doing well, thanks for asking!" — it isn't actually doing well. It doesn't
              have feelings or experiences. The response is a <em>socially appropriate pattern</em>, not a
              truthful statement about its state. Scoring it at 100% truthfulness would validate a technically
              false claim. The system acknowledges this with a slight reduction: "this is an appropriate
              response, but it's not a verifiable fact."
            </p>
          </div>

          <div className={styles.principle}>
            <h3>2. Audit Systems Should Reflect Honest Uncertainty</h3>
            <p>
              This is a core principle in compliance and audit frameworks. A score of 100% implies absolute
              certainty, which is epistemologically impossible for AI-generated content. Even the most benign
              response could contain subtle issues — tone mismatches, cultural assumptions, or contextual
              misreads. A ceiling below 100% reflects the honest uncertainty that any responsible audit system
              should communicate.
            </p>
          </div>

          <div className={styles.principle}>
            <h3>3. Preserving Signal Quality</h3>
            <p>
              If every casual response scores 100% and a deeply-researched factual response also scores 100%,
              the scoring system can't differentiate quality. By keeping conversational responses in the 80–95%
              range, we preserve meaningful headroom:
            </p>
            <ul className={styles.scoreRanges}>
              <li><span className={styles.rangeBadge} data-tier="excellent">90–100%</span> Verified factual claims with citations</li>
              <li><span className={styles.rangeBadge} data-tier="good">75–89%</span> Appropriate, well-formed responses</li>
              <li><span className={styles.rangeBadge} data-tier="moderate">50–74%</span> Reasonable but could be improved</li>
              <li><span className={styles.rangeBadge} data-tier="low">Below 50%</span> Needs review</li>
            </ul>
            <p>
              When everything scores 100%, users learn to ignore the scores entirely. Calibrated scores
              maintain their meaning.
            </p>
          </div>

          <div className={styles.principle}>
            <h3>4. Value Measures Substance, Not Appropriateness</h3>
            <p>
              A greeting is <em>appropriate</em>, but it isn't <em>high-value</em> — it doesn't teach anything,
              solve a problem, or provide new information. An 80% value score says: "this response fits the
              context, but it's not the most valuable thing the AI could produce." That's an accurate
              characterization, and it helps you distinguish between polite acknowledgments and substantive answers.
            </p>
          </div>

          <div className={styles.principle}>
            <h3>5. Accuracy Reflects Confidence, Not Correctness</h3>
            <p>
              A 95% accuracy score means the system is 95% confident the response is appropriate and factually
              sound — but leaves room for edge cases. The greeting might be culturally inappropriate in certain
              contexts, overly familiar, or misread the user's tone. That 5% margin is the system being honest
              about what it can't fully evaluate.
            </p>
          </div>

          <div className={styles.principle}>
            <h3>6. Preventing Trust Erosion</h3>
            <p>
              If users see 100% on a greeting and then 100% on a medical claim, they'll trust both equally.
              By showing different scores for different response types, users develop an intuition: "casual
              responses are 80–95%, so when I see 98% on a factual answer, that actually means something."
              This distinction is essential for responsible AI use.
            </p>
          </div>
        </section>

        {/* Score Floors Table */}
        <section className={styles.section}>
          <h2>How Response Types Are Scored</h2>
          <p className={styles.sectionIntro}>
            The system classifies each response and applies appropriate scoring floors based on the type of
            content. Factual claims must earn their scores; conversational responses receive appropriate baselines.
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Response Type</th>
                  <th>Value Floor</th>
                  <th>Trust Floor</th>
                  <th>Accuracy Floor</th>
                  <th>Rationale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Conversational</strong></td>
                  <td>80%</td>
                  <td>85%</td>
                  <td>90%</td>
                  <td>Appropriate but low-information content</td>
                </tr>
                <tr>
                  <td><strong>Procedural</strong></td>
                  <td>70%</td>
                  <td>Helpfulness-based</td>
                  <td>Raw assessment</td>
                  <td>Steps and instructions need verification</td>
                </tr>
                <tr>
                  <td><strong>Opinion</strong></td>
                  <td>65%</td>
                  <td>Transparency-boosted</td>
                  <td>60%</td>
                  <td>Inherently subjective content</td>
                </tr>
                <tr>
                  <td><strong>Factual</strong></td>
                  <td>Earned</td>
                  <td>Earned</td>
                  <td>Earned</td>
                  <td>Must demonstrate evidence and accuracy</td>
                </tr>
                <tr>
                  <td><strong>General</strong></td>
                  <td>55%</td>
                  <td>50%</td>
                  <td>50%</td>
                  <td>Unknown category — scored cautiously</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Philosophy */}
        <section className={styles.section}>
          <div className={styles.philosophy}>
            <p>
              The system is designed so that <strong>trust must be earned, not assumed</strong>. Even for safe
              responses, the small gap below 100% is the system being honest about what it can and can't
              guarantee. We believe this transparency makes AI more trustworthy, not less.
            </p>
          </div>
        </section>
      </div>
    </article>
    <HomeFooter />
  </>
);

export default EvaluationMetrics;
