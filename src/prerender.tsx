import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { About } from "./app/About";
import { Download } from "./app/Download";
import { EvaluationMetrics } from "./app/EvaluationMetrics";
import { Pricing } from "./app/Pricing";
import { WaitingList } from "./app/WaitingList";

const PAGES = {
  "/download": Download,
  "/pricing": Pricing,
  "/waiting-list": WaitingList,
  "/about": About,
  "/evaluation-metrics": EvaluationMetrics,
};

export const render = (path: string) => {
  const Page = PAGES[path as keyof typeof PAGES];
  if (!Page) {
    throw new Error(`prerender: no page for ${path}`);
  }
  return renderToStaticMarkup(
    <StaticRouter location={path}>
      <Page />
    </StaticRouter>,
  );
};
