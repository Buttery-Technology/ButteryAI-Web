import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUserContext } from "@hooks";
import { UPDATE_PROFILE, REDEEM_CLUSTER_INVITE } from "../../api";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { COUNTRIES } from "./countries";
import styles from "./Setup.module.scss";

type Step = "profile" | "cluster" | "join";

const Setup = () => {
  const { user, refreshUser } = useUserContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialStep = searchParams.get("step") === "cluster" ? "cluster" as Step : "profile" as Step;
  const [step, setStep] = useState<Step>(initialStep);
  const [name, setName] = useState(user?.name ?? "");
  const [country, setCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [industry, setIndustry] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Join step state
  const [inviteCode, setInviteCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const term = countrySearch.toLowerCase();
    return COUNTRIES.filter((c) => c.toLowerCase().includes(term));
  }, [countrySearch]);

  const canContinue = name.trim().length > 0 && country.length > 0;

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

      // Capture cluster status before refresh (profile save doesn't change it)
      const alreadyHasCluster = user?.hasCluster;
      await refreshUser();

      // Skip cluster step if user already belongs to a cluster
      if (alreadyHasCluster) {
        navigate("/dashboard");
      } else {
        setStep("cluster");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClusterChoice(choice: "create" | "join") {
    if (choice === "join") {
      setStep("join");
    } else {
      navigate("/dashboard");
    }
  }

  async function handleJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inviteCode.length !== 8 || isJoining) return;

    setIsJoining(true);
    setJoinError(null);

    try {
      const { url, options } = REDEEM_CLUSTER_INVITE(inviteCode);
      const response = await fetch(url, options);

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Invalid or expired invite code");
      }

      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsJoining(false);
    }
  }

  if (step === "join") {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <Link to="/" className={styles.logoLink}>
            <img src={butteryaiLogo} alt="ButteryAI" />
          </Link>
          <h1 className={styles.clusterHeading}>Enter your invite code</h1>
          <p className={styles.clusterSubheading}>
            Ask your cluster admin for an 8-character invite code.
          </p>
          <form onSubmit={handleJoinSubmit}>
            <input
              type="text"
              className={`${styles.input} ${styles.inviteInput}`}
              placeholder="ABC12345"
              value={inviteCode}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                if (val.length <= 8) setInviteCode(val);
              }}
              maxLength={8}
              autoFocus
            />
            {joinError && <p className={styles.error}>{joinError}</p>}
            <button
              type="submit"
              className={styles.continueButton}
              disabled={inviteCode.length !== 8 || isJoining}
            >
              {isJoining ? "Joining..." : "Join"}
            </button>
          </form>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => {
              setStep("cluster");
              setInviteCode("");
              setJoinError(null);
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (step === "cluster") {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <Link to="/" className={styles.logoLink}>
            <img src={butteryaiLogo} alt="ButteryAI" />
          </Link>
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
        <Link to="/" className={styles.logoLink}>
          <img src={butteryaiLogo} alt="ButteryAI" />
        </Link>

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
            <div className={styles.selectWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="Search for a country"
                value={country || countrySearch}
                onChange={(e) => {
                  setCountrySearch(e.target.value);
                  setCountry("");
                  setShowCountryDropdown(true);
                }}
                onFocus={() => setShowCountryDropdown(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowCountryDropdown(false);
                    if (!country && countrySearch.trim()) {
                      const match = COUNTRIES.find(
                        (c) => c.toLowerCase() === countrySearch.trim().toLowerCase(),
                      );
                      if (match) {
                        setCountry(match);
                        setCountrySearch("");
                      } else {
                        setCountrySearch("");
                      }
                    }
                  }, 150);
                }}
              />
              {showCountryDropdown && filteredCountries.length > 0 && (
                <ul className={styles.dropdown}>
                  {filteredCountries.map((c) => (
                    <li key={c}>
                      <button
                        type="button"
                        className={styles.dropdownItem}
                        onMouseDown={() => {
                          setCountry(c);
                          setCountrySearch("");
                          setShowCountryDropdown(false);
                        }}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
