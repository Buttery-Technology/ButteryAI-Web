import { NavBar } from "../NavBar";
import { HomeHero } from "./HomeHero";
import { HomePillars } from "./HomePillars";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { HomeTrust } from "./HomeTrust";
import { HomeSecurity } from "./HomeSecurity";
import { HomeGovernance } from "./HomeGovernance";
import { HomeOwnership } from "./HomeOwnership";
import { HomeIntelligence } from "./HomeIntelligence";
import { HomeFooter } from "./HomeFooter";

const Home = () => (
  <>
    <NavBar />
    <HomeHero />
    <HomePillars />
    <HomeHowItWorks />
    <HomeTrust />
    <HomeSecurity />
    <HomeGovernance />
    <HomeOwnership />
    <HomeIntelligence />
    <HomeFooter />
  </>
);

export default Home;
