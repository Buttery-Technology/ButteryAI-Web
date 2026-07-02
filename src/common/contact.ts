export const ENTERPRISE_EMAIL = "sales@buttery.technology";

const SUBJECT = "ButteryAI Enterprise Inquiry";

const BODY = [
  "Hi ButteryAI team,",
  "",
  "I'd like to learn more about ButteryAI Enterprise for my organization.",
  "",
  "Company:",
  "Team size:",
  "Use case:",
].join("\n");

/** Opens the user's mail client with a prefilled enterprise-sales inquiry. */
export const openEnterpriseEmail = () => {
  const href = `mailto:${ENTERPRISE_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;
  window.open(href);
};
