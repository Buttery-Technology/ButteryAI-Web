import { useDocumentTitle } from "@hooks";
import { NavBar } from "../NavBar";
import { HomeHero } from "./HomeHero";
import { HomePillars } from "./HomePillars";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { HomeEngines } from "./HomeEngines";
import { HomeTrust } from "./HomeTrust";
import { HomeEnterprise } from "./HomeEnterprise";
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
      <HomeEnterprise />
      <HomeIntelligence />
      <HomeFooter />
    </>
  );
};

export default Home;
