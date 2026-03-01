import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm, useUserContext } from "@hooks";
import { CHECK_WAITLIST_APPROVAL } from "../../../api";
import { Loading } from "../../Helper/Loading";
import styles from "./Form.module.scss";

const GoogleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Form = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "password">("email");
  const [checkingApproval, setCheckingApproval] = useState(false);

  const {
    value: email,
    error: emailError,
    onChange: onChangeEmail,
    onBlur: onBlurEmail,
    isValid: isValidEmail,
    validate: validateEmail,
  } = useForm("email");

  const {
    value: password,
    error: passwordError,
    onChange: onChangePassword,
    onBlur: onBlurPassword,
    isValid: isValidPassword,
  } = useForm("password");

  const { isLoading, isUserSignedIn, signIn, signInWithGoogle, error } = useUserContext();

  const handleEmailContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateEmail()) return;

    setCheckingApproval(true);
    try {
      const { url, options } = CHECK_WAITLIST_APPROVAL(email);
      const res = await fetch(url, options);
      const data = await res.json();
      if (data.isApproved) {
        setStep("password");
      } else {
        navigate("/waiting-list");
      }
    } catch {
      navigate("/waiting-list");
    } finally {
      setCheckingApproval(false);
    }
  };

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidEmail && isValidPassword) signIn(email, password);
  };

  if (isLoading || checkingApproval) return <Loading />;

  if (isUserSignedIn) return <Navigate to="/dashboard/hive" />;

  if (step === "password") {
    return (
      <form className={styles.form} onSubmit={handleSignIn}>
        <p className={styles.emailLabel}>{email}</p>
        <div className={styles.inputWrapper}>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password…"
            value={password}
            onChange={onChangePassword}
            onBlur={onBlurPassword}
            className={styles.input}
            autoFocus
          />
          {passwordError && <p className={styles.inputError}>{passwordError}</p>}
        </div>
        <button type="submit" className={styles.continueButton} disabled={!isValidPassword}>
          Sign in
        </button>
        <button type="button" className={styles.backLink} onClick={() => setStep("email")}>
          Use a different email
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleEmailContinue}>
      <button type="button" className={styles.googleButton} onClick={signInWithGoogle}>
        <GoogleLogo />
        <span>Continue with Google</span>
      </button>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>OR</span>
        <div className={styles.dividerLine} />
      </div>

      <div className={styles.inputWrapper}>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your work or personal email…"
          value={email}
          onChange={onChangeEmail}
          onBlur={onBlurEmail}
          className={styles.input}
        />
        {emailError && <p className={styles.inputError}>{emailError}</p>}
      </div>

      <button type="submit" className={styles.continueButton}>
        Continue with email
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default Form;
