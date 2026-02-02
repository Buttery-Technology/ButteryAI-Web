import { type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useForm, useUserContext } from "@hooks";
import { Input } from "./Input";
import { Button } from "./Button";
import { Loading } from "../../Helper/Loading";
import styles from "./Form.module.scss";

const Form = () => {
  const {
    value: username,
    error: usernameError,
    onChange: onChangeUsername,
    onBlur: onBlurUsername,
    isValid: isValidUsername,
  } = useForm("username");

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

    if (isValidUsername && isValidPassword) {
      signIn(username, password);
    }
  };

  if (isLoading) return <Loading />;

  if (isUserSignedIn) return <Navigate to="/dashboard/hive" />;

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <Input
          type="text"
          name="username"
          placeholder="Joana..."
          value={username}
          onChange={onChangeUsername}
          onBlur={onBlurUsername}
          error={usernameError}
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

        <Button
  type="submit"
  className={styles.button}
  disabled={!isValidUsername || !isValidPassword}
>
  Login
</Button>

<Button
  type="button"
  onClick={signInWithGoogle}
  className={styles.button}
>
  Sign in with Google
</Button>

      </form>

      {error && <p className={styles.error}>{error}</p>}
    </>
  );
};

export default Form;
