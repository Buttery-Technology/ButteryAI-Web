import { FocusEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import styles from "./NavBar.module.scss";

const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="3" y2="21" />
    <path d="M16 8.5C16 6.8 14.2 5.5 12 5.5S8 6.8 8 8.5C8 10.5 10 11.3 12 12C14 12.7 16 13.5 16 15.5C16 17.2 14.2 18.5 12 18.5S8 17.2 8 15.5" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 11v5" />
    <path d="M12 7.8v.01" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7.9" r="3.9" />
    <path d="M4.7 20.3c0-3.8 3.3-6.5 7.3-6.5s7.3 2.7 7.3 6.5c0 .5-.4.9-.9.9H5.6c-.5 0-.9-.4-.9-.9z" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path className={styles.halo} d="M1.75 1.75 6.25 7l-4.5 5.25" />
    <path d="M1.75 1.75 6.25 7l-4.5 5.25" />
  </svg>
);

const ITEMS = [
  { to: "/", label: "Home", Icon: HouseIcon },
  { to: "/pricing", label: "Pricing", Icon: DollarIcon },
  { to: "/about", label: "About", Icon: InfoIcon },
];

let hintPlayed = false;

const NavBar = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [nudge] = useState(() => !hintPlayed);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef(0);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const hide = (delay = 180) => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), delay);
  };

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse") show();
  };

  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") hide();
  };

  const onBlur = (e: FocusEvent) => {
    if (!navRef.current?.contains(e.relatedTarget as Node | null)) hide(0);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    hintPlayed = true;
  }, []);

  return (
    <nav
      ref={navRef}
      className={styles.nav}
      aria-label="Primary"
      data-open={open ? "1" : "0"}
      onPointerLeave={onLeave}
      onBlur={onBlur}
      onKeyDown={(e) => e.key === "Escape" && hide(0)}
    >
      <Link
        to="/"
        className={styles.brand}
        data-scrolled={scrolled ? "1" : "0"}
        aria-label="ButteryAI home"
        onPointerEnter={onEnter}
        onFocus={show}
      >
        <img src={butteryaiLogo} alt="" className={styles.brandMark} />
      </Link>

      <span
        className={nudge ? `${styles.hint} ${styles.nudge}` : styles.hint}
        aria-hidden="true"
        onPointerEnter={onEnter}
      >
        <ChevronIcon />
      </span>

      <div className={styles.menu} onPointerEnter={onEnter} onFocus={show}>
        {ITEMS.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`${styles.link} ${active ? styles.active : ""}`}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              title={item.label}
            >
              <item.Icon />
            </Link>
          );
        })}

        <span className={styles.divider} aria-hidden="true" />

        <Link to="/login" className={styles.link} aria-label="Sign in" title="Sign in">
          <PersonIcon />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
