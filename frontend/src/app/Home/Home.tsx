import { useRef, useEffect, ReactNode } from "react";
import { HomeHero } from "./HomeHero";
import { HomeEfficiency } from "./HomeEfficiency";
import { HomeSmart } from "./HomeSmart";
import { HomeNextGen } from "./HomeNextGen";
import { HomeExtensions } from "./HomeExtensions";
import { HomeWorkflows } from "./HomeWorkflows";
import { HomeSecurity } from "./HomeSecurity";
import { HomeGovernance } from "./HomeGovernance";
import { HomeDesign } from "./HomeDesign";
import { HomeFooter } from "./HomeFooter";
import styles from "./Home.module.scss";

// Section wrapper with fade-out/fade-in effect
const Section = ({ children }: { children: ReactNode }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    const handleScroll = () => {
      if (!section) return;

      // Only update if scrollY actually changed (ignores resize-triggered events)
      const currentScrollY = window.scrollY;
      if (currentScrollY === lastScrollY.current) return;
      lastScrollY.current = currentScrollY;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Sections hidden until previous section scrolls away
      const distanceFromBottom = viewportHeight - rect.top;
      const showThreshold = viewportHeight * 0.3;

      if (distanceFromBottom < showThreshold) {
        section.style.opacity = "0";
      } else if (rect.top > 0) {
        const fadeInProgress = Math.min((distanceFromBottom - showThreshold) / (viewportHeight * 0.2), 1);
        section.style.opacity = `${fadeInProgress}`;
      } else {
        const scrolledPast = -rect.top;
        const sectionHeight = rect.height;
        const fadeProgress = Math.min(scrolledPast / (sectionHeight * 0.5), 1);
        section.style.opacity = `${1 - fadeProgress}`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial render - temporarily allow update
    const initialScrollY = lastScrollY.current;
    lastScrollY.current = -1;
    handleScroll();
    lastScrollY.current = initialScrollY;

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className={styles.section}>
      {children}
    </div>
  );
};

const Home = () => (
  <>
    <HomeHero />
    <Section>
      <HomeNextGen />
    </Section>
    <Section>
      <HomeEfficiency />
    </Section>
    <Section>
      <HomeSmart />
    </Section>
    <Section>
      <HomeExtensions />
    </Section>
    <Section>
      <HomeWorkflows />
    </Section>
    <Section>
      <HomeSecurity />
    </Section>
    <Section>
      <HomeGovernance />
    </Section>
    <Section>
      <HomeDesign />
    </Section>
    <Section>
      <HomeFooter />
    </Section>
  </>
);

export default Home;
