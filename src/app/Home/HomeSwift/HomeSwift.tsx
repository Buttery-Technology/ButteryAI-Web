import styles from "./HomeSwift.module.scss";
import swiftHexagon from "@assets/images/swift-hexagon.svg";
import CheckCircle from "@assets/icons/check-circle.svg?react";

const HomeSwift = () => {
  return (
    <section className={styles.root} data-section="swift">
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <img src={swiftHexagon} alt="Swift" className={styles.swiftIcon} />
        </div>

        <h1 className={styles.title}>Pioneering Swift Development</h1>
        <p className={styles.description}>
          We believe in the future of the Swift language. So much so that 99% of all our technology is developed in
          Swift. Even our custom AI models that are deeply integrated into{" "}
          <strong>ButteryIntelligence</strong> engines are built almost entirely in Swift,
          which gives us many advantages with speed, efficiency, and code safety. We call this out because as we open up
          to allow further and deeper customizations for you, we think it's important you understand where we think the
          future is going, which we believe will be one focused on safety, reliability, efficiency, and speed. All
          things Swift provides out of the box.
        </p>

        <div className={styles.features}>
          <div className={styles.card}>
            <h2>Speed</h2>
            <p>
              Through unique architecture and leveraging low-level API's and optimizations, we are seeing systems up to
              100x faster and up to 50x throughput versus Python.
            </p>
            <CheckCircle className={styles.checkIcon} />
          </div>
          <div className={styles.card}>
            <h2>Efficiency & Safety</h2>
            <p>
              With up to 10x concurrent connections coupled with up to 5x lower memory usage, our systems are light and
              nimble, while also avoiding data races and runtime bugs.
            </p>
            <CheckCircle className={styles.checkIcon} />
          </div>
          <div className={styles.card}>
            <h2>Future-proof</h2>
            <p>
              We believe Apple's push for type-safe code is correct and with amazing community support the future is
              very bright and we are planning major contributions in the future.
            </p>
            <CheckCircle className={styles.checkIcon} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSwift;
