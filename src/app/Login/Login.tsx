import { Header } from "./Header";
import { Form } from "./Form";
import styles from "./Login.module.scss";

const Login = () => (
  <div className={styles.root}>
    <div className={styles.wrapper}>
      <div>
        <Header />
        <Form />
      </div>
    </div>
  </div>
);

export default Login;
