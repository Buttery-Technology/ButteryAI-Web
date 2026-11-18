export type ToolId = "models" | "orch" | "vector" | "routing" | "evals" | "guard" | "monitor" | "glue";
export type HexKey = "tl" | "tr" | "l" | "c" | "r" | "bl" | "br";
export type Variant = "wide" | "compact" | "narrow";
export type Status = "routed" | "scored" | "caught" | "retry" | "trusted";
export type Glyph = "doc" | "chat" | "search" | "chart" | "trend";
type Pill = { text: string; at: ToolId; dx: number; dy: number; tone?: "warn" };

export const HUB_CX = 47;
export const HUB_CY = 42;
export const HUB_SPAN = 86;

export const HEXES: { key: HexKey; fill: string; cx: number; cy: number; order: number; d: string }[] = [
  {
    key: "tl",
    fill: "#31AFF5",
    cx: 33,
    cy: 18,
    order: 0,
    d: "M30.5 3.44338C32.047 2.55021 33.953 2.55021 35.5 3.44338L44.3564 8.55662C45.9034 9.44979 46.8564 11.1004 46.8564 12.8868V23.1132C46.8564 24.8996 45.9034 26.5502 44.3564 27.4434L35.5 32.5566C33.953 33.4498 32.047 33.4498 30.5 32.5566L21.6436 27.4434C20.0966 26.5502 19.1436 24.8996 19.1436 23.1132V12.8868C19.1436 11.1004 20.0966 9.44979 21.6436 8.55662L30.5 3.44338Z",
  },
  {
    key: "tr",
    fill: "#288ED2",
    cx: 61,
    cy: 18,
    order: 1,
    d: "M58.5 3.44338C60.047 2.55021 61.953 2.55021 63.5 3.44338L72.3564 8.55662C73.9034 9.44979 74.8564 11.1004 74.8564 12.8868V23.1132C74.8564 24.8996 73.9034 26.5502 72.3564 27.4434L63.5 32.5566C61.953 33.4498 60.047 33.4498 58.5 32.5566L49.6436 27.4434C48.0966 26.5502 47.1436 24.8996 47.1436 23.1132V12.8868C47.1436 11.1004 48.0966 9.44979 49.6436 8.55662L58.5 3.44338Z",
  },
  {
    key: "r",
    fill: "#755CBA",
    cx: 75,
    cy: 42,
    order: 2,
    d: "M72.5 27.4434C74.047 26.5502 75.953 26.5502 77.5 27.4434L86.3564 32.5566C87.9034 33.4498 88.8564 35.1004 88.8564 36.8868V47.1132C88.8564 48.8996 87.9034 50.5502 86.3564 51.4434L77.5 56.5566C75.953 57.4498 74.047 57.4498 72.5 56.5566L63.6436 51.4434C62.0966 50.5502 61.1436 48.8996 61.1436 47.1132V36.8868C61.1436 35.1004 62.0966 33.4498 63.6436 32.5566L72.5 27.4434Z",
  },
  {
    key: "br",
    fill: "#D12A89",
    cx: 61,
    cy: 66,
    order: 3,
    d: "M58.5 51.4434C60.047 50.5502 61.953 50.5502 63.5 51.4434L72.3564 56.5566C73.9034 57.4498 74.8564 59.1004 74.8564 60.8868V71.1132C74.8564 72.8996 73.9034 74.5502 72.3564 75.4434L63.5 80.5566C61.953 81.4498 60.047 81.4498 58.5 80.5566L49.6436 75.4434C48.0966 74.5502 47.1436 72.8996 47.1436 71.1132V60.8868C47.1436 59.1004 48.0966 57.4498 49.6436 56.5566L58.5 51.4434Z",
  },
  {
    key: "bl",
    fill: "#D22839",
    cx: 33,
    cy: 66,
    order: 4,
    d: "M30.5 51.4434C32.047 50.5502 33.953 50.5502 35.5 51.4434L44.3564 56.5566C45.9034 57.4498 46.8564 59.1004 46.8564 60.8868V71.1132C46.8564 72.8996 45.9034 74.5502 44.3564 75.4434L35.5 80.5566C33.953 81.4498 32.047 81.4498 30.5 80.5566L21.6436 75.4434C20.0966 74.5502 19.1436 72.8996 19.1436 71.1132V60.8868C19.1436 59.1004 20.0966 57.4498 21.6436 56.5566L30.5 51.4434Z",
  },
  {
    key: "l",
    fill: "#0F9B81",
    cx: 19,
    cy: 42,
    order: 5,
    d: "M16.5 27.4434C18.047 26.5502 19.953 26.5502 21.5 27.4434L30.3564 32.5566C31.9034 33.4498 32.8564 35.1004 32.8564 36.8868V47.1132C32.8564 48.8996 31.9034 50.5502 30.3564 51.4434L21.5 56.5566C19.953 57.4498 18.047 57.4498 16.5 56.5566L7.64359 51.4434C6.09659 50.5502 5.14359 48.8996 5.14359 47.1132V36.8868C5.14359 35.1004 6.09659 33.4498 7.64359 32.5566L16.5 27.4434Z",
  },
  {
    key: "c",
    fill: "#FFC300",
    cx: 46,
    cy: 41,
    order: 6,
    d: "M43.5 27.4434C45.047 26.5502 46.953 26.5502 48.5 27.4434L56.4904 32.0566C58.0374 32.9498 58.9904 34.6004 58.9904 36.3868V45.6132C58.9904 47.3996 58.0374 49.0502 56.4904 49.9434L48.5 54.5566C46.953 55.4498 45.047 55.4498 43.5 54.5566L35.5096 49.9434C33.9626 49.0502 33.0096 47.3996 33.0096 45.6132V36.3868C33.0096 34.6004 33.9626 32.9498 35.5096 32.0566L43.5 27.4434Z",
  },
];

export const HEX_BY = Object.fromEntries(HEXES.map((h) => [h.key, h])) as Record<HexKey, (typeof HEXES)[number]>;

export const HUB_BACKING =
  "M43.1819 12.9229C44.8816 11.7631 47.1184 11.7631 48.8181 12.9229L62.8707 22.5112C64.2359 23.4428 65.0526 24.9887 65.0526 26.6414V47.3586C65.0526 49.0113 64.2359 50.5572 62.8707 51.4888L48.8181 61.0771C47.1184 62.2369 44.8816 62.2369 43.1819 61.0771L29.1293 51.4888C27.7641 50.5572 26.9474 49.0113 26.9474 47.3586V26.6414C26.9474 24.9887 27.7641 23.4428 29.1293 22.5112L43.1819 12.9229Z";

export const HUB_GLYPH =
  "M42.3135 50H48.663C52.5482 50 55 47.9666 55 44.8109C55 42.4159 53.0637 40.6072 50.6119 40.4948V40.3949C52.6237 40.1205 54.1576 38.5114 54.1576 36.4908C54.1576 33.709 52.0076 32 48.4367 32H42.3135C40.855 32 40 32.8731 40 34.395V47.605C40 49.1269 40.855 50 42.3135 50ZM44.6144 39.3346V35.2433H47.2171C48.7636 35.2433 49.6689 35.9916 49.6689 37.2515C49.6689 38.549 48.663 39.3346 46.9908 39.3346H44.6144ZM44.6144 46.7567V42.1163H47.3303C49.2289 42.1163 50.3101 42.9398 50.3101 44.4117C50.3101 45.9336 49.254 46.7567 47.3554 46.7567H44.6144Z";

export const HUB_SLOT = "M91 42 69 80.1H25L3 42 25 3.9h44z";

export const TOOLS: { id: ToolId; label: string; hex: HexKey | null }[] = [
  { id: "routing", label: "Routing", hex: "tl" },
  { id: "orch", label: "Orchestration", hex: "c" },
  { id: "models", label: "Model APIs", hex: "tr" },
  { id: "vector", label: "Vector database", hex: "l" },
  { id: "glue", label: "Glue code", hex: null },
  { id: "evals", label: "Evals", hex: "r" },
  { id: "guard", label: "Guardrails", hex: "bl" },
  { id: "monitor", label: "Monitoring", hex: "br" },
];

export const TOOL_BY = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<ToolId, (typeof TOOLS)[number]>;

export const EDGES: { a: ToolId; b: ToolId; primary: boolean }[] = [
  { a: "models", b: "orch", primary: true },
  { a: "orch", b: "routing", primary: true },
  { a: "vector", b: "routing", primary: true },
  { a: "routing", b: "evals", primary: true },
  { a: "evals", b: "glue", primary: true },
  { a: "guard", b: "glue", primary: true },
  { a: "monitor", b: "vector", primary: true },
  { a: "models", b: "vector", primary: false },
  { a: "models", b: "evals", primary: false },
  { a: "models", b: "glue", primary: false },
  { a: "orch", b: "monitor", primary: false },
  { a: "orch", b: "glue", primary: false },
  { a: "vector", b: "guard", primary: false },
  { a: "vector", b: "glue", primary: false },
  { a: "routing", b: "glue", primary: false },
  { a: "evals", b: "monitor", primary: false },
  { a: "guard", b: "models", primary: false },
  { a: "monitor", b: "glue", primary: false },
];

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const EDGE_BEND = EDGES.map(() => {
  const a1 = rnd() * Math.PI * 2;
  const a2 = rnd() * Math.PI * 2;
  const l1 = 90 + rnd() * 130;
  const l2 = 90 + rnd() * 130;
  return { o1x: Math.cos(a1) * l1, o1y: Math.sin(a1) * l1, o2x: Math.cos(a2) * l2, o2y: Math.sin(a2) * l2 };
});

export const edgesFor = (tools: ToolId[]) =>
  EDGES.map((edge, i) => ({ ...edge, i, bend: EDGE_BEND[i] })).filter(
    (edge) => tools.includes(edge.a) && tools.includes(edge.b),
  );

export const SPECS: { name: string; color: string; glyph: Glyph; hex: HexKey; rest: Status; delay: number }[] = [
  { name: "Contracts", color: "#288ED2", glyph: "doc", hex: "tr", rest: "trusted", delay: 0.3 },
  { name: "Support", color: "#0F9B81", glyph: "chat", hex: "l", rest: "routed", delay: 1.5 },
  { name: "Research", color: "#31AFF5", glyph: "search", hex: "tl", rest: "scored", delay: 2.7 },
  { name: "Finance", color: "#D12A89", glyph: "chart", hex: "br", rest: "trusted", delay: 3.9 },
  { name: "Sales", color: "#755CBA", glyph: "trend", hex: "r", rest: "routed", delay: 5.1 },
];

export const GHOST_HEX: HexKey = "bl";

export const REST: Status[] = SPECS.map((s) => s.rest);

const CYCLE = 7.2;

export const statusAt = (i: number, t: number): Status => {
  const local = t - SPECS[i].delay;
  if (local < 0) return SPECS[i].rest;
  const cyc = Math.floor(local / CYCLE);
  const tau = local - cyc * CYCLE;
  const caught = (cyc + i) % 3 === 2;
  if (tau < 1.1) return "routed";
  if (tau < 2.3) return "scored";
  if (caught && tau < 3.3) return "caught";
  if (caught && tau < 4.4) return "retry";
  return "trusted";
};

type Config = {
  tools: ToolId[];
  mess: Partial<Record<ToolId, [number, number]>>;
  tidy: Partial<Record<ToolId, number | null>>;
  ring: [number, number];
  slots: number[];
  slotPos: [number, number][];
  emerge: number[];
  hubW: number;
  pad: number;
  bend: number;
  pills: Pill[];
};

const WIDE_MESS: Config["mess"] = {
  routing: [0.3, 0.15],
  orch: [0.62, 0.21],
  models: [0.86, 0.33],
  vector: [0.12, 0.42],
  glue: [0.47, 0.53],
  guard: [0.25, 0.8],
  monitor: [0.62, 0.85],
  evals: [0.85, 0.7],
};

const WIDE_TIDY: Config["tidy"] = {
  orch: -90,
  models: -38,
  evals: 13,
  monitor: 64,
  guard: 116,
  vector: 167,
  routing: -142,
  glue: null,
};

const ALL_TOOLS: ToolId[] = ["routing", "orch", "models", "vector", "glue", "evals", "guard", "monitor"];

export const CONFIG: Record<Variant, Config> = {
  wide: {
    tools: ALL_TOOLS,
    mess: WIDE_MESS,
    tidy: WIDE_TIDY,
    ring: [0.31, 0.36],
    slots: [2, 1, -1, 0, 4, 3],
    slotPos: [
      [0.2, 0.2],
      [0.13, 0.5],
      [0.2, 0.8],
      [0.8, 0.2],
      [0.87, 0.5],
      [0.8, 0.8],
    ],
    emerge: [0, 2, 5, 1, 3, 4],
    hubW: 116,
    pad: 28,
    bend: 1,
    pills: [
      { text: "rate limited", at: "routing", dx: -30, dy: -38 },
      { text: "retry loop", at: "orch", dx: 60, dy: -38 },
      { text: "cost spike", at: "models", dx: 30, dy: -38, tone: "warn" },
      { text: "timeout", at: "vector", dx: 34, dy: -38 },
      { text: "who owns this?", at: "glue", dx: 54, dy: -38, tone: "warn" },
      { text: "version mismatch", at: "evals", dx: -24, dy: -38 },
      { text: "false positive", at: "guard", dx: 30, dy: -38 },
      { text: "no audit trail", at: "monitor", dx: 30, dy: -38, tone: "warn" },
    ],
  },
  compact: {
    tools: ALL_TOOLS,
    mess: WIDE_MESS,
    tidy: WIDE_TIDY,
    ring: [0.33, 0.37],
    slots: [2, 1, -1, 0, 4, 3],
    slotPos: [
      [0.2, 0.22],
      [0.13, 0.5],
      [0.2, 0.78],
      [0.8, 0.22],
      [0.87, 0.5],
      [0.8, 0.78],
    ],
    emerge: [0, 2, 5, 1, 3, 4],
    hubW: 104,
    pad: 20,
    bend: 0.75,
    pills: [
      { text: "rate limited", at: "routing", dx: -24, dy: 34 },
      { text: "retry loop", at: "orch", dx: 34, dy: -34 },
      { text: "cost spike", at: "models", dx: 16, dy: -34, tone: "warn" },
      { text: "timeout", at: "vector", dx: 28, dy: -34 },
      { text: "who owns this?", at: "glue", dx: 44, dy: -34, tone: "warn" },
      { text: "version mismatch", at: "evals", dx: -30, dy: -34 },
      { text: "false positive", at: "guard", dx: 28, dy: -34 },
      { text: "no audit trail", at: "monitor", dx: 28, dy: -34, tone: "warn" },
    ],
  },
  narrow: {
    tools: ["routing", "orch", "vector", "models", "glue", "evals"],
    mess: {
      routing: [0.3, 0.14],
      orch: [0.74, 0.27],
      vector: [0.32, 0.42],
      models: [0.7, 0.57],
      glue: [0.34, 0.73],
      evals: [0.68, 0.89],
    },
    tidy: { orch: -90, models: -30, evals: 30, vector: 150, routing: -150, glue: null },
    ring: [0.3, 0.34],
    slots: [2, 0, -1, 3],
    slotPos: [
      [0.25, 0.18],
      [0.75, 0.18],
      [0.25, 0.82],
      [0.75, 0.82],
    ],
    emerge: [0, 1, 3, 2],
    hubW: 88,
    pad: 12,
    bend: 0.5,
    pills: [
      { text: "rate limited", at: "routing", dx: 0, dy: 31 },
      { text: "timeout", at: "vector", dx: 20, dy: -31 },
      { text: "cost spike", at: "models", dx: 6, dy: -31, tone: "warn" },
      { text: "who owns this?", at: "glue", dx: 44, dy: -31, tone: "warn" },
      { text: "version mismatch", at: "evals", dx: -28, dy: -31 },
    ],
  },
};

export const variantFor = (w: number): Variant => (w < 560 ? "narrow" : w < 900 ? "compact" : "wide");

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const out3 = (t: number) => 1 - Math.pow(1 - t, 3);
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
