import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDocumentTitle } from "@hooks";
import { NavBar } from "../NavBar";
import { HomeHero } from "./HomeHero";
import { HomeSpecialists } from "./HomeSpecialists";
import { HomeStakes } from "./HomeStakes";
import { HomeSteps } from "./HomeSteps";
import { HomeEngines } from "./HomeEngines";
import { HomeScoring } from "./HomeScoring";
import { HomeEvaluation } from "./HomeEvaluation";
import { HomeTransparency } from "./HomeTransparency";
import { HomeKnowledge } from "./HomeKnowledge";
import { HomeAssurance } from "./HomeAssurance";
import { HomeShared } from "./HomeShared";
import { HomeEnterprise } from "./HomeEnterprise";
import { HomeFooter } from "./HomeFooter";
import { ScrollCue } from "./ScrollCue";

const Home = () => {
  useDocumentTitle("ButteryAI — Build your own AI tech stack with AI specialists");
  const { hash } = useLocation();

  useEffect(() => {
    if (hash !== "#enterprise") return;
    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() =>
      requestAnimationFrame(() => alive && document.getElementById("enterprise")?.scrollIntoView({ block: "start" })),
    );
    return () => {
      alive = false;
    };
  }, [hash]);

  return (
    <>
      <NavBar />
      <HomeHero />
      <ScrollCue />
      <HomeSpecialists />
      <HomeStakes />
      <HomeScoring />
      <HomeEvaluation />
      <HomeTransparency />
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
