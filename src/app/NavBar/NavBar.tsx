import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.scss";

const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.5v19" />
    <path d="M16.5 6.3c0-1.9-2-2.9-4.5-2.9s-4.5 1-4.5 3.1c0 2.2 1.9 2.9 4.5 3.5s4.5 1.1 4.5 3.5c0 2.1-2 3.2-4.5 3.2s-4.5-1-4.5-2.9" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 11v5" />
    <path d="M12 7.8v.01" />
  </svg>
);

const ITEMS = [
  { to: "/", label: "Home", Icon: HouseIcon },
  { to: "/pricing", label: "Pricing", Icon: DollarIcon },
  { to: "/about", label: "About", Icon: InfoIcon },
];

const NavBar = () => {
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav} aria-label="Primary">
      {ITEMS.map((item, i) => {
        const active = pathname === item.to;
        return (
          <span className={styles.cell} key={item.to}>
            {i > 0 && <span className={styles.divider} aria-hidden="true" />}
            <Link
              to={item.to}
              className={`${styles.link} ${active ? styles.active : ""}`}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              title={item.label}
            >
              <item.Icon />
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default NavBar;
