import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@hooks";
import { UPDATE_PROFILE } from "../../api";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import styles from "./Setup.module.scss";

type Step = "profile" | "cluster";

const Setup = () => {
  const { user, refreshUser } = useUserContext();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("profile");
  const [name, setName] = useState(user?.name ?? "");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = name.trim().length > 0 && country.trim().length > 0;

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: Parameters<typeof UPDATE_PROFILE>[0] = {
        name: name.trim(),
        country: country.trim(),
      };
      if (industry.trim()) payload.industry = industry.trim();
      if (purpose.trim()) payload.purpose = purpose.trim();

      const { url, options } = UPDATE_PROFILE(payload);
      const response = await fetch(url, options);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Failed to save profile");
      }

      await refreshUser();
      setStep("cluster");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClusterChoice(_choice: "create" | "join") {
    navigate("/dashboard");
  }

  if (step === "cluster") {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <img src={butteryaiLogo} alt="ButteryAI" className={styles.logo} />
          <h1 className={styles.clusterHeading}>
            Almost there!
          </h1>
          <p className={styles.clusterSubheading}>
            Would you like to create a new cluster or join an existing one?
          </p>
          <div className={styles.clusterCards}>
            <button
              type="button"
              className={styles.clusterCard}
              onClick={() => handleClusterChoice("create")}
            >
              <div className={styles.clusterCardTitle}>Create a cluster</div>
              <div className={styles.clusterCardDescription}>
                Start fresh with your own AI cluster
              </div>
            </button>
            <button
              type="button"
              className={styles.clusterCard}
              onClick={() => handleClusterChoice("join")}
            >
              <div className={styles.clusterCardTitle}>Join a cluster</div>
              <div className={styles.clusterCardDescription}>
                Connect to an existing cluster with an invite
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <img src={butteryaiLogo} alt="ButteryAI" className={styles.logo} />

        {user?.profileImageURL ? (
          <div className={styles.profileImageWrapper}>
            <img
              src={user.profileImageURL}
              alt="Profile"
              className={styles.profileImage}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className={styles.profileImageWrapper}>
            <div className={styles.profileImagePlaceholder}>
              {name.charAt(0).toUpperCase() || "?"}
            </div>
          </div>
        )}

        <h1 className={styles.heading}>
          Let's setup your <span className={styles.headingGradient}>profile.</span>
        </h1>

        <form onSubmit={handleProfileSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>
              Name<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Country<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="Your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Industry</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Your industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Purpose</label>
            <input
              type="text"
              className={styles.input}
              placeholder="What will you use ButteryAI for?"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.continueButton}
            disabled={!canContinue || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
