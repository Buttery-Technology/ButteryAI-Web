import { type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useForm, useUserContext } from "@hooks";
import { Input } from "./Input";
import { Button } from "./Button";
import { Loading } from "../../Helper/Loading";
import styles from "./Form.module.scss";

const Form = () => {

  const {
    value: email,
    error: emailError,
    onChange: onChangeEmail,
    onBlur: onBlurEmail,
    isValid: isValidEmail,
  } = useForm("email");

  const {
    value: password,
    error: passwordError,
    onChange: onChangePassword,
    onBlur: onBlurPassword,
    isValid: isValidPassword,
  } = useForm("password");

  const { isLoading, isUserSignedIn, signIn, signInWithGoogle, error } = useUserContext();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isValidEmail && isValidPassword) signIn(email, password);
  };

  if (isLoading) return <Loading />;

  if (isUserSignedIn) return <Navigate to="/dashboard/hive" />;

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={onChangeEmail}
          onBlur={onBlurEmail}
          error={emailError}
        />
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <Input
          type="password"
          name="password"
          placeholder="Shh..."
          value={password}
          onChange={onChangePassword}
          onBlur={onBlurPassword}
          error={passwordError}
        />
        <div className={styles.buttonsWrapper}>
          <Button type="submit" disabled={!isValidEmail || !isValidPassword}>
            Login
          </Button>
          <button type="button" onClick={signInWithGoogle}>
            <img src="https://developers.google.com/identity/images/branding_guideline_sample_lt_rd_lg.svg" />
          </button>
        </div>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
};

export default Form;
