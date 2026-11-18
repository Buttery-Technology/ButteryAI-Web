import { useEffect, useRef } from "react";
import styles from "./ScrollCue.module.scss";

const THRESHOLD = 16;
const DELAY = 800;

const ScrollCue = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ready = false;
    let frame = 0;

    const sync = () => {
      frame = 0;
      const state = ready && window.scrollY <= THRESHOLD ? "on" : "off";
      if (el.dataset.state !== state) el.dataset.state = state;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    const timer = window.setTimeout(() => {
      ready = true;
      sync();
    }, DELAY);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={styles.root} aria-hidden="true">
      <span className={styles.label}>Scroll to untangle</span>
      <svg
        className={styles.chevron}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 6l4.5 4.5L12.5 6" />
      </svg>
    </div>
  );
};

export default ScrollCue;
