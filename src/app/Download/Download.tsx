import { Link } from "react-router-dom";
import { useDocumentTitle } from "@hooks";
import { INFO_EMAIL } from "@common/contact";
import { NavBar } from "../NavBar";
import { useLatestRelease, type ReleaseState } from "./useLatestRelease";
import styles from "./Download.module.scss";

const TERMS_URL = "https://buttery.technology/terms";
const PRIVACY_URL = "https://buttery.technology/privacy";

const STEPS = [
  { title: "Open the download", text: "Open the file you downloaded to unpack ButteryAI." },
  {
    title: "Move it to Applications",
    text: "Drag ButteryAI into your Applications folder. ButteryAI installs updates only from there.",
  },
  { title: "Sign in", text: "Open ButteryAI and continue with Google or email, using the email address we approved." },
];

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 4v11" />
    <path d="m7 10.5 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

const formatSize = (bytes: number) => `${Math.max(1, Math.round(bytes / 1_000_000))} MB`;

const INVITE = "ButteryAI for Mac is open to approved accounts. Our team sets up each new account.";

const Status = ({ state }: { state: ReleaseState }) => {
  if (state.status === "invite") return <>{INVITE}</>;
  if (state.status === "ready") {
    const { version, size } = state.release;
    return <>{size ? `Version ${version} · ${formatSize(size)}` : `Version ${version}`}</>;
  }
  if (state.status === "error") {
    return (
      <>
        We couldn’t find the download. Select Download for Mac to try again, or email{" "}
        <a href={`mailto:${INFO_EMAIL}`}>{INFO_EMAIL}</a> for a download link.
      </>
    );
  }
  return <>Finding the latest version…</>;
};

const Download = () => {
  useDocumentTitle("Download for Mac – ButteryAI");
  const { state, download } = useLatestRelease();

  const label = (
    <>
      <DownloadIcon />
      <span>Download for Mac</span>
    </>
  );

  return (
    <>
      <NavBar />

      <main className={styles.root}>
        <header className={styles.hero}>
          <h1 className={styles.title}>
            Download <span>ButteryAI</span> for Mac
          </h1>
          <p className={styles.subtitle}>Build AI specialists on your Mac and grow your own AI tech stack.</p>

          <div className={styles.action} data-cta="download" data-state={state.status}>
            {state.status === "invite" ? (
              <Link className={styles.button} to="/waiting-list">
                Request access
              </Link>
            ) : state.status === "ready" ? (
              <a className={styles.button} href={state.release.url}>
                {label}
              </a>
            ) : (
              <button type="button" className={styles.button} onClick={() => void download()}>
                {label}
              </button>
            )}
            <p className={state.status === "error" ? `${styles.status} ${styles.error}` : styles.status} role="status">
              <Status state={state} />
            </p>
          </div>

          <noscript>
            <style>{"[data-cta=download]{display:none}"}</style>
            <p className={styles.noscript}>
              {INVITE} <a href="/waiting-list">Request access</a>
            </p>
          </noscript>

          <p className={styles.requirements}>Requires a Mac with Apple silicon and macOS 15 or later.</p>
        </header>

        <div className={styles.details}>
          <section aria-labelledby="download-steps">
            <h2 id="download-steps" className={styles.sectionTitle}>
              After you download
            </h2>
            <ol className={styles.steps}>
              {STEPS.map((step, i) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepText}>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="download-account">
            <h2 id="download-account" className={styles.sectionTitle}>
              Your account
            </h2>
            <p className={styles.body}>
              Our team approves every ButteryAI account by hand. <Link to="/waiting-list">Request access</Link> with the
              email you plan to use. Once it’s approved, open ButteryAI and continue with that email to set up your
              account.
            </p>
          </section>
        </div>

        <p className={styles.legal}>
          Read our{" "}
          <a href={TERMS_URL} target="_blank" rel="noreferrer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </p>
      </main>
    </>
  );
};

export default Download;
