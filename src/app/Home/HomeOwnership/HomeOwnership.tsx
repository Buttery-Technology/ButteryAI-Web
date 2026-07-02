import styles from "./HomeOwnership.module.scss";

const CHIPS = [
  "Pure Swift · no Python",
  "Metal & Vulkan acceleration",
  "Local · cloud · Kubernetes · on-prem",
  "No per-token lock-in",
  "Your models · your data · your infra",
  "Any GGUF model — LLaMA · Mistral · Qwen · Gemma",
];

const HomeOwnership = () => (
  <section className={styles.root} data-section="ownership">
    <h2 className={styles.title}>
      Own the whole stack. <span>No lock-in.</span>
    </h2>
    <p className={styles.body}>
      Pure Swift, no Python runtime, GPU-accelerated on Apple Silicon and Linux. Bring any open model and run it on your
      own terms — no per-token vendor tax.
    </p>
    <div className={styles.chips}>
      {CHIPS.map((chip) => (
        <span key={chip} className={styles.chip}>
          {chip}
        </span>
      ))}
    </div>
  </section>
);

export default HomeOwnership;
