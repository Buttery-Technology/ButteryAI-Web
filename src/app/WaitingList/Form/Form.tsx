import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { CHECK_WAITLIST_APPROVAL, JOIN_WAITLIST } from "../../../api";
import styles from "./Form.module.scss";

const Form = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buildDescription, setBuildDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Firebase connection
    try {
      await addDoc(collection(db, "waitlist"), { name, email, buildDescription });
      setSuccessMessage("You've been added to the waitlist!");
      setIsSubmitted(true);
    } catch (e) {
      setError("Error adding email to waitlist.");
    } finally {
      setIsSubmitting(false);
    }

    // try {
    //   // Check if user is approved
    //   const checkRequest = CHECK_WAITLIST_APPROVAL(email);
    //   const checkResponse = await fetch(checkRequest.url, checkRequest.options);

    //   if (!checkResponse.ok) {
    //     throw new Error("Failed to check approval status");
    //   }

    //   const checkData = await checkResponse.json();

    //   if (checkData.isApproved) {
    //     // User is approved, navigate to login
    //     navigate("/login");
    //     return;
    //   }

    //   // User is not approved, add to waitlist
    //   const joinRequest = JOIN_WAITLIST(name, email, buildDescription || undefined);
    //   const joinResponse = await fetch(joinRequest.url, joinRequest.options);

    //   if (!joinResponse.ok) {
    //     throw new Error("Failed to join waitlist");
    //   }

    //   const joinData = await joinResponse.json();
    //   setSuccessMessage(joinData.message || "You've been added to the waitlist!");
    //   setIsSubmitted(true);
    // } catch (err) {
    //   setError("Uh, oh… looks like someone turned the lights off. Give us a few minutes and try again.");
    //   console.error("Waitlist error:", err);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  if (isSubmitted) {
    return (
      <div className={styles.success}>
        <h2 className={styles.successTitle}>You're on the list!</h2>
        <p className={styles.successMessage}>
          {successMessage || "We'll reach out when it's your turn. Keep an eye on your inbox!"}
        </p>
        <Link to="/" className={styles.backButton}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>
          Name<span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Joana"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>
          Email<span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="joana@buttery.technology"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="buildDescription" className={styles.label}>
          What are you wanting to build?
        </label>
        <textarea
          id="buildDescription"
          name="buildDescription"
          placeholder="Tell us about your project..."
          value={buildDescription}
          onChange={(e) => setBuildDescription(e.target.value)}
          className={styles.textarea}
          disabled={isSubmitting}
          rows={4}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.privacy}>
        By creating an account, you agree with our{" "}
        <Link to="/privacy" className={styles.privacyLink}>
          Privacy Policy
        </Link>
        .
      </p>

      <button type="submit" className={styles.button} disabled={isSubmitting}>
        {isSubmitting ? "Checking..." : "Continue"}
      </button>
    </form>
  );
};

export default Form;
