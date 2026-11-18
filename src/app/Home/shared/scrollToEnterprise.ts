import { openEnterpriseEmail } from "@common/contact";
import { prefersReducedMotion } from "./useInView";

export const scrollToEnterprise = () => {
  const target = document.getElementById("enterprise");
  if (!target) {
    openEnterpriseEmail();
    return;
  }
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
};
