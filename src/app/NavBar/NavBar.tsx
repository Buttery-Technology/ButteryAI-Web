import { Link, useLocation } from "react-router-dom";
import { openEnterpriseEmail } from "@common/contact";
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

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 9.5h17" />
    <path d="M8 3.5v3M16 3.5v3" />
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

      <button
        type="button"
        onClick={openEnterpriseEmail}
        className={styles.link}
        aria-label="Book a demo"
        title="Book a demo"
      >
        <CalendarIcon />
      </button>
    </nav>
  );
};

export default NavBar;
