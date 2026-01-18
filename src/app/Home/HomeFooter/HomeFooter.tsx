import styles from "./HomeFooter.module.scss";

const HomeFooter = () => (
  <div className={styles.root}>
    <h2>Connect with us</h2>
    <ul>
      <li>
        <a href="#">Facebook</a>
      </li>
      <li>
        <a href="#">Email</a>
      </li>
      <li>
        <a href="#">Instagram</a>
      </li>
    </ul>
    <p>Product by</p>
    <p>Buttery logo</p>
    <p className={styles.copyright}>© 2026 Buttery Technology Inc.</p>
    <ul>
      <li>
        <a href="#">Terms of Service</a>
      </li>
      <li>
        <a href="#">Privacy Policy</a>
      </li>
    </ul>
  </div>
);

export default HomeFooter;
