import styles from "./HomeExtensions.module.scss";

const extensions = [
  {
    id: "aws",
    name: "AWS",
    title: "Storage, hosting, analytics...",
    description:
      "Choose AWS if you need a wide range of features, global infrastructure, and detailed control over how your extension runs. It's ideal for complex or large-scale projects, with strong support for customization, security, and performance across regions based on your AWS account.",
  },
  {
    id: "google-cloud",
    name: "Google Cloud",
    title: "Storage, Hosting, AI...",
    description:
      "Choose Google Cloud if you want powerful AI tools, a developer-friendly experience, and easy integration with Google services. It's a great choice for teams looking to build quickly, work with machine learning, or stay within the Google ecosystem based on your G account.",
  },
  {
    id: "openai",
    name: "OpenAI Platform",
    title: (
      <>
        LLMs <span>(chatGPT)</span>
      </>
    ),
    description:
      "Choose OpenAI to integrate OpenAI's LLMs for AI functionality, such as text generation, image generation, audio and speech generation, and more based on your OpenAI account.",
  },
  {
    id: "anthropic",
    name: "Anthropic Platform",
    title: (
      <>
        LLMs <span>(Claude)</span>
      </>
    ),
    description:
      "Choose Anthropic to integrate Anthropic's LLMs for AI functionality, such as text generation, image generation, audio and speech generation, and more based on your Anthropic account.",
  },
];

const HomeExtensions = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <h1 className={styles.title}>Extend AI functionality</h1>
      <p className={styles.description}>
        ButteryAI allows you to add extensions to your AI to simplify the tech stack or add functionality to make your
        AI better, smarter, and easier to manage. Extension support is growing every day.
      </p>
      <div className={styles.cards}>
        {extensions.map((ext) => (
          <div key={ext.id} className={styles.card}>
            <span className={styles.name}>{ext.name}</span>
            <h2 className={styles.cardTitle}>{ext.title}</h2>
            <p className={styles.cardDescription}>{ext.description}</p>
            <button className={styles.button}>Continue</button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomeExtensions;
