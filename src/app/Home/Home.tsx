import { useDocumentTitle } from "@hooks";
import { NavBar } from "../NavBar";
import { HomeHero } from "./HomeHero";
import { HomeStakes } from "./HomeStakes";
import { HomeSteps } from "./HomeSteps";
import { HomeEngines } from "./HomeEngines";
import { HomeScoring } from "./HomeScoring";
import { HomeEvaluation } from "./HomeEvaluation";
import { HomeKnowledge } from "./HomeKnowledge";
import { HomeAssurance } from "./HomeAssurance";
import { HomeShared } from "./HomeShared";
import { HomeEnterprise } from "./HomeEnterprise";
import { HomeFooter } from "./HomeFooter";
import { ScrollCue } from "./ScrollCue";

const Home = () => {
  useDocumentTitle("ButteryAI — Build your own AI tech stack with AI specialists");

  return (
    <>
      <NavBar />
      <HomeHero />
      <ScrollCue />
      <HomeStakes />
      <HomeScoring />
      <HomeEvaluation />
      <HomeKnowledge />
      <HomeSteps />
      <HomeEngines />
      <HomeAssurance />
      <HomeShared />
      <HomeEnterprise />
      <HomeFooter />
    </>
  );
};

export default Home;
