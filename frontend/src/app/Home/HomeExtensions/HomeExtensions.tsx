import styles from "./HomeExtensions.module.scss";

const HomeExtensions = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <h1 className={styles.title}>Extend AI functionality</h1>
      <p>
        ButteryAI allows you to add extensions to your AI to simplify the tech stack or add functionality to make your
        AI better, smarter, and easier to manage. Extension support is growing every day.
      </p>
      <ul>
        <li>
          <span>AWS</span>
          <h2>Storage, hosting, analytics…</h2>
          <p>
            Choose AWS if you need a wide range of features, global infrastructure, and detailed control over how your
            extension runs. It's ideal for complex or large-scale projects, with strong support for customization,
            security, and performance across regions based on your AWS account.
          </p>
          <button>Continue</button>
        </li>
        <li>
          <span>Google Cloud</span>
          <h2>Storage, Hosting, AI…</h2>
          <p>
            Choose Google Cloud if you want powerful AI tools, a developer-friendly experience, and easy integration
            with Google services. It's a great choice for teams looking to build quickly, work with machine learning, or
            stay within the Google ecosystem based on your G account.
          </p>
          <button>Continue</button>
        </li>
        <li>
          <span>OpenAI Platform</span>
          <h2>LLMs (chatGPT)</h2>
          <p>
            Choose OpenAI to integrate OpenAI’s LLMs for AI functionality, such as text generation, image generation,
            audio and speech generation, and more based on your OpenAI account.{" "}
          </p>
          <button>Continue</button>
        </li>
        <li>
          <span>Anthropic Platform</span>
          <h2>LLMs (Claude)</h2>
          <p>
            Choose Anthropic to integrate Anthropic’s LLMs for AI functionality, such as text generation, image
            generation, audio and speech generation, and more based on your Anthropic account.{" "}
          </p>
          <button>Continue</button>
        </li>
      </ul>
    </div>
  </section>
);

export default HomeExtensions;
