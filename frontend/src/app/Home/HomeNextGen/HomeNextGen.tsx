import styles from "./HomeNextGen.module.scss";
import CheckCircle from "@assets/icons/check-circle.svg?react";

const HomeNextGen = () => (
  <section className={styles.root}>
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
            fill="#F9C000"
          />
        </svg>
        <svg className={styles.brainSvg} viewBox="0 0 369 307" fill="none">
          <path d="M299.687 307C276.45 307 259.889 286.619 255.081 262.242C253.078 262.242 250.674 262.376 246.267 262.376C226.368 262.376 211.811 247.723 212.345 229.074C213.943 168.26 314 174.948 332.366 83.1681C332.477 82.6158 332.818 82.0674 333.38 82.0984C340.445 82.4884 369 118.568 369 142.755C369 172.594 348.7 189.378 317.583 186.714C309.036 185.915 301.958 193.241 301.958 201.766C301.958 210.158 308.502 216.419 317.049 217.085C329.938 217.942 341.699 216.436 351.813 212.98C353.111 212.536 354.499 213.45 354.546 214.821C354.637 217.519 354.71 220.396 354.71 223.346C354.71 269.302 334.143 307 299.687 307Z" fill="#288ED2"/>
          <path d="M71.7166 228.141C29.7818 228.141 0 193.374 0 147.551C0 125.572 6.78437 92.7548 19.3648 89.3394C28.6653 84.5706 37.3835 103.667 58.7515 103.667C67.1652 103.667 69.692 96.9006 69.692 95.4829C69.692 94.0653 69.692 87.2987 64.2218 84.5706C51.0477 78.0005 41.6678 70.424 41.6678 56.0376C41.6678 32.1935 66.6417 13.0117 99.228 13.0117C104.704 13.0117 112.616 13.0117 115.388 14.8766C121.659 19.0966 110.046 32.9928 109.912 42.8501C109.779 52.441 116.189 59.1014 125.003 59.1014C133.55 59.1014 139.961 53.3735 140.094 42.7169C140.629 14.477 155.122 0 181.832 0C207.447 5.70127 206.448 21.8247 220.123 24.5528C231.064 24.5528 236.534 19.0966 252.945 19.0966C285.766 19.0966 302.225 39.6531 302.225 70.8236C302.225 149.949 181.362 148.883 181.362 236.4C181.362 240.396 182.564 244.434 182.564 249.321C182.564 251.137 172.163 250.984 168.156 250.984C154.316 250.984 130.558 243.85 127.365 241.056C127.045 240.776 126.827 240.349 126.84 239.924C126.99 234.638 153.182 206.812 153.182 184.449C153.182 184.449 149 189 137 189C127.448 189 123.134 182.185 123.134 182.185C123.134 209.626 102.7 228.141 71.7166 228.141Z" fill="#288ED2"/>
        </svg>
      </div>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Next-gen AI Intelligence</h1>
        <svg className={styles.titleUnderline} viewBox="0 0 486 10" fill="none" preserveAspectRatio="none">
          <line x1="5" y1="5" x2="481" y2="5" stroke="#FFD74D" strokeWidth="10" strokeLinecap="round"/>
        </svg>
      </div>
      <p className={styles.description}>
        ButteryAI is pioneering a new wave of AI intelligence called ButteryIntelligence. You can now create knowledge,
        experience, and skills that are used as sources-of-truth for the AI to use and lives separate from the AI model.
        This allows for AI to take the next frontier.
      </p>
      <div className={styles.features}>
        <div className={styles.card}>
          <h2>Scalable Intelligence</h2>
          <p>
            ButteryAI's intelligence engines are built for scale so they're automatically working in the background to
            manage and grow its intelligence.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
        <div className={styles.card}>
          <h2>Dynamic Context</h2>
          <p>
            ButteryAI is the first to offer dynamic knowledge that can then be injected into a model for better accuracy
            and context.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
      </div>
    </div>
  </section>
);

export default HomeNextGen;
