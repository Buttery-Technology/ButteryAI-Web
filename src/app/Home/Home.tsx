import { useDocumentTitle } from "@hooks";
import { NavBar } from "../NavBar";
import { HomeHero } from "./HomeHero";
import { HomePillars } from "./HomePillars";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { HomeEngines } from "./HomeEngines";
import { HomeTrust } from "./HomeTrust";
import { HomeSecurity } from "./HomeSecurity";
import { HomeGovernance } from "./HomeGovernance";
import { HomeOwnership } from "./HomeOwnership";
import { HomeIntelligence } from "./HomeIntelligence";
import { HomeFooter } from "./HomeFooter";

const Home = () => {
  useDocumentTitle("ButteryAI — Build AI you can trust and own");

  return (
    <>
      <NavBar />
      <HomeHero />
      <HomePillars />
      <HomeHowItWorks />
      <HomeEngines />
      <HomeTrust />
      <HomeSecurity />
      <HomeGovernance />
      <HomeOwnership />
      <HomeIntelligence />
      <HomeFooter />
    </>
  );
};

export default Home;
