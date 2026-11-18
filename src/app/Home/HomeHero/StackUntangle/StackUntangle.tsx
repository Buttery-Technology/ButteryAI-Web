import { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CONFIG,
  GHOST_HEX,
  HEXES,
  HEX_BY,
  HUB_BACKING,
  HUB_CX,
  HUB_CY,
  HUB_GLYPH,
  HUB_SLOT,
  HUB_SPAN,
  REST,
  SPECS,
  TOOL_BY,
  clamp01,
  edgesFor,
  inOut,
  lerp,
  out3,
  smooth,
  statusAt,
  variantFor,
  type Glyph,
  type HexKey,
  type Status,
  type ToolId,
  type Variant,
} from "./geometry";
import styles from "./StackUntangle.module.scss";

const NAV_CLEAR = 104;
const NARROW_FLOOR = 320;
const FLOW = 3;
const FLOW_SPEED = 0.2;
const STAGE: Record<Variant, { min: number; max: number; ratio: number }> = {
  wide: { min: 460, max: 760, ratio: 0.52 },
  compact: { min: 440, max: 600, ratio: 0.68 },
  narrow: { min: 400, max: 480, ratio: 1.4 },
};

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const TOOL_ICON: Record<ToolId, string[]> = {
  models: ["M10 2.6l6.4 3.7v7.4L10 17.4l-6.4-3.7V6.3z", "M3.6 6.3 10 10l6.4-3.7", "M10 10v7.4"],
  orch: [circle(4.5, 10, 2), circle(15.5, 4.8, 2), circle(15.5, 15.2, 2), "M6.5 10h3M9.5 10V4.8h4M9.5 10v5.2h4"],
  vector: [
    "M4 5a6 2.4 0 1 0 12 0a6 2.4 0 1 0-12 0",
    "M4 5v10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V5",
    "M4 10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4",
  ],
  routing: [
    "M2.5 10h5c2 0 2.6-.8 3.6-2.6L12 6h5M7.5 10c2 0 2.6.8 3.6 2.6L12 14h5",
    "M14.6 3.6 17 6l-2.4 2.4M14.6 11.6 17 14l-2.4 2.4",
  ],
  evals: ["M3 5.6l1.6 1.6L7.8 4M3 13.6l1.6 1.6 3.2-3.2M10.5 6h6.5M10.5 14h6.5"],
  guard: ["M10 2.4l6 2.3v4.7c0 3.9-2.6 6.7-6 8.2-3.4-1.5-6-4.3-6-8.2V4.7z", "M7.4 10l1.8 1.8 3.4-3.6"],
  monitor: ["M2 10.5h3.4l2-5.2 3.6 9.4 2-5.4H18"],
  glue: [
    "M7 3.5c-2 0-2.6 1-2.6 2.6v1.8c0 1-.8 2.1-2 2.1 1.2 0 2 1 2 2.1v1.8c0 1.6.6 2.6 2.6 2.6",
    "M13 3.5c2 0 2.6 1 2.6 2.6v1.8c0 1 .8 2.1 2 2.1-1.2 0-2 1-2 2.1v1.8c0 1.6-.6 2.6-2.6 2.6",
  ],
};

const GLYPH: Record<Glyph, string[]> = {
  doc: ["M9.3 7h3.5l2.1 2.1V17H9.3z", "M11 12.2h2.2M11 14.5h2.2"],
  chat: [
    "M7.6 9.1c0-.8.6-1.4 1.4-1.4h6c.8 0 1.4.6 1.4 1.4v4c0 .8-.6 1.4-1.4 1.4h-3.5L9.2 16.4v-1.9h-.2c-.8 0-1.4-.6-1.4-1.4z",
  ],
  search: [circle(11.2, 11.2, 3.2), "M13.6 13.6l2.6 2.6"],
  chart: ["M8 16.4h8M9.6 14.4v-2.6M12 14.4V8.2M14.4 14.4v-4.2"],
  trend: ["M7.6 15l3-3.1 2 2 3.8-4.3", "M13.6 9.6h2.8v2.8"],
};

const STATUS: Record<Status, { label: string; d: string }> = {
  routed: { label: "Routed", d: "M2.5 6h6.2M6 3.4 8.6 6 6 8.6" },
  scored: { label: "Scored", d: "M2.6 8.6a3.4 3.4 0 0 1 6.8 0M6 8.6l1.7-2.1" },
  caught: { label: "Caught", d: "M6 2.9v3.9M6 9.1v.1" },
  retry: { label: "Retry", d: "M9.1 6.2A3.1 3.1 0 1 1 8.2 4M8.6 1.9v2.3H6.3" },
  trusted: { label: "Trusted", d: "M2.8 6.2 5 8.4l4.2-4.6" },
};

const HEX_ICON = "M12 1.8 20.83 6.9v10.2L12 22.2l-8.83-5.1V6.9z";

const Paths = ({ d }: { d: string[] }) => (
  <>
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </>
);

const Line = ({ children, className, viewBox }: { children: ReactNode; className?: string; viewBox: string }) => (
  <svg
    className={className}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

type Pt = { x: number; y: number };

type Layout = {
  W: number;
  H: number;
  cx: number;
  cy: number;
  tools: Partial<Record<ToolId, { mess: Pt; tidy: Pt; hex: Pt | null; hexScale: number }>>;
  slots: Pt[];
  anchors: Pt[];
  icons: Pt[];
  pillHalf: number[];
  bend: number;
  scale: number;
};

type Dom = {
  tools: Map<ToolId, HTMLElement>;
  rings: Map<ToolId, HTMLElement>;
  wires: SVGPathElement[];
  pills: HTMLElement[];
  hexes: SVGGElement[];
  specs: HTMLElement[];
  spokes: SVGLineElement[];
  packets: HTMLElement[];
  hub: SVGSVGElement | null;
  halo: HTMLElement | null;
  caption: HTMLElement | null;
  outro: HTMLElement | null;
  backing: SVGPathElement | null;
  slot: SVGPathElement | null;
};

type Track = { top: number; dist: number; hold: number; lead: number };

type Engine = {
  P: number;
  reveal: number;
  raf: number;
  inView: boolean;
  liveTimer: number;
  liveT: number;
  liveLast: number;
  live: Status[];
  lit: Partial<Record<ToolId, boolean>>;
};

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const focusVisible = (el: Element) => {
  try {
    return el.matches(":focus-visible");
  } catch {
    return true;
  }
};

const initialVariant = (): Variant => {
  if (typeof window === "undefined") return "wide";
  return variantFor(Math.min(1040, window.innerWidth - 72));
};

const f1 = (n: number) => n.toFixed(1);

const StackUntangle = ({ outro }: { outro?: ReactNode }) => {
  const [reduced, setReduced] = useState(prefersReduced);
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [statuses, setStatuses] = useState<Status[]>(REST);
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const eng = useRef<Engine>({
    P: reduced ? 1 : 0,
    reveal: -1,
    raf: 0,
    inView: false,
    liveTimer: 0,
    liveT: 0,
    liveLast: 0,
    live: REST,
    lit: {},
  });

  const cfg = CONFIG[variant];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!root || !pin || !stage) return;
    const e = eng.current;
    const fits = variantFor(stage.clientWidth);
    if (fits !== variant) {
      setVariant(fits);
      return;
    }
    const conf = CONFIG[variant];
    const all = <T extends Element>(sel: string) => Array.from(stage.querySelectorAll<T>(sel));

    const dom: Dom = {
      tools: new Map(all<HTMLElement>("[data-tool]").map((el) => [el.dataset.tool as ToolId, el])),
      rings: new Map(all<HTMLElement>("[data-ring]").map((el) => [el.dataset.ring as ToolId, el])),
      wires: all<SVGPathElement>("[data-wire]"),
      pills: all<HTMLElement>("[data-pill]"),
      hexes: all<SVGGElement>("[data-hex]"),
      specs: all<HTMLElement>("[data-slot]"),
      spokes: all<SVGLineElement>("[data-spoke]"),
      packets: all<HTMLElement>("[data-packet]"),
      hub: stage.querySelector<SVGSVGElement>("[data-hub]"),
      halo: stage.querySelector<HTMLElement>("[data-halo]"),
      caption: stage.querySelector<HTMLElement>("[data-caption]"),
      outro: pin.querySelector<HTMLElement>("[data-outro]"),
      backing: stage.querySelector<SVGPathElement>("[data-backing]"),
      slot: stage.querySelector<SVGPathElement>("[data-hubslot]"),
    };
    const edges = edgesFor(conf.tools);
    let L: Layout | null = null;

    const view = { vh: 0, vw: 0 };
    const readView = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      if (!view.vh || vw !== view.vw || Math.abs(vh - view.vh) > 150) {
        view.vh = vh;
        view.vw = vw;
      }
    };

    const sizeStage = () => {
      const W = stage.clientWidth;
      const { min, max, ratio } = STAGE[variant];
      const outroH = dom.outro?.offsetHeight ?? 0;
      const avail = view.vh - NAV_CLEAR - outroH - 32;
      let H = Math.round(Math.max(min, Math.min(max, W * ratio, avail)));
      const fit = Math.round(view.vh - outroH - 20);
      if (variant === "narrow" && fit < H) H = Math.max(NARROW_FLOOR, fit);
      if (stage.style.height !== `${H}px`) stage.style.height = `${H}px`;
      const scale = variant === "wide" ? Math.min(1.3, Math.max(1, Math.min(W / 1180, H / 460))) : 1;
      stage.style.setProperty("--k", scale.toFixed(3));
      return scale;
    };

    const measure = (): Layout => {
      const scale = sizeStage();
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const cx = W / 2;
      const cy = H / 2;
      const hubW = conf.hubW * scale;
      const k = hubW / HUB_SPAN;
      const pad = conf.pad * scale;
      const pillHalf = dom.pills.map((p) => p.offsetWidth / 2);
      const cX = (x: number, hw: number) => Math.min(W - hw - pad, Math.max(hw + pad, x));
      const cY = (y: number, hh: number) => Math.min(H - hh - pad, Math.max(hh + pad, y));
      const tools: Layout["tools"] = {};
      for (const id of conf.tools) {
        const el = dom.tools.get(id);
        const w = el?.offsetWidth ?? 120;
        const h = el?.offsetHeight ?? 36;
        const [mx, my] = conf.mess[id] ?? [0.5, 0.5];
        const ang = conf.tidy[id];
        const rad = ((ang ?? 0) * Math.PI) / 180;
        const hexKey = TOOL_BY[id].hex;
        const hex = hexKey ? HEX_BY[hexKey] : null;
        tools[id] = {
          mess: { x: cX(mx * W, w / 2), y: cY(my * H, h / 2) },
          tidy:
            ang === null || ang === undefined
              ? { x: cx, y: cy }
              : {
                  x: cX(cx + Math.cos(rad) * conf.ring[0] * W, w / 2),
                  y: cY(cy + Math.sin(rad) * conf.ring[1] * H, h / 2),
                },
          hex: hex ? { x: cx + (hex.cx - HUB_CX) * k, y: cy + (hex.cy - HUB_CY) * k } : null,
          hexScale: hex ? (24 * k) / w : 1,
        };
      }
      const slots = conf.slotPos.map(([fx, fy], i) => {
        const el = dom.specs[i];
        return {
          x: cX(fx * W, (el?.offsetWidth ?? 160) / 2),
          y: cY(fy * H, (el?.offsetHeight ?? 50) / 2),
        };
      });
      const hexAt = (key: HexKey) => ({
        x: cx + (HEX_BY[key].cx - HUB_CX) * k,
        y: cy + (HEX_BY[key].cy - HUB_CY) * k,
      });
      const anchors = conf.slots.map((s) => hexAt(s < 0 ? GHOST_HEX : SPECS[s].hex));
      const icons = dom.specs.map((el) => {
        const icon = el.querySelector("[data-icon]");
        if (!icon || !el.offsetWidth) return { x: 0, y: 0 };
        const a = el.getBoundingClientRect();
        const b = icon.getBoundingClientRect();
        const sc = a.width / el.offsetWidth || 1;
        return {
          x: (b.left + b.width / 2 - a.left - a.width / 2) / sc,
          y: (b.top + b.height / 2 - a.top - a.height / 2) / sc,
        };
      });
      if (dom.hub) {
        dom.hub.style.left = `${f1(cx - HUB_CX * k)}px`;
        dom.hub.style.top = `${f1(cy - HUB_CY * k)}px`;
        dom.hub.style.width = `${f1(94 * k)}px`;
        dom.hub.style.height = `${f1(84 * k)}px`;
      }
      if (dom.halo) {
        const r = hubW * 1.25;
        dom.halo.style.left = `${f1(cx - r)}px`;
        dom.halo.style.top = `${f1(cy - r)}px`;
        dom.halo.style.width = dom.halo.style.height = `${f1(r * 2)}px`;
      }
      if (dom.caption) {
        dom.caption.style.left = `${f1(cx)}px`;
        dom.caption.style.top = `${f1(cy + HUB_CY * k + 6)}px`;
      }
      return {
        W,
        H,
        cx,
        cy,
        tools,
        slots,
        anchors,
        icons,
        pillHalf,
        bend: conf.bend * scale,
        scale,
      };
    };

    const render = (p: number) => {
      if (!L) return;
      const { W, H, cx, cy } = L;
      const s = inOut(clamp01(p / 0.34));
      const cur: Partial<Record<ToolId, Pt & { local: number }>> = {};
      const fold = (order: number) => clamp01((p - 0.32 - order * 0.03) / 0.22);

      for (const id of conf.tools) {
        const t = L.tools[id];
        const el = dom.tools.get(id);
        if (!t || !el) continue;
        let x = lerp(t.mess.x, t.tidy.x, s);
        let y = lerp(t.mess.y, t.tidy.y, s);
        let sc = 1;
        let op = 1;
        let local = 0;
        const hexKey = TOOL_BY[id].hex;
        if (hexKey && t.hex) {
          local = fold(HEX_BY[hexKey].order);
          const k = inOut(clamp01(local / 0.7));
          x = lerp(x, t.hex.x, k);
          y = lerp(y, t.hex.y, k);
          sc = lerp(1, Math.max(0.6, t.hexScale), k);
          op = 1 - smooth(0.12, 0.5, local);
          const ring = dom.rings.get(id);
          if (ring) ring.style.opacity = smooth(0, 0.3, local).toFixed(3);
          const lit = local > 0.06;
          if (e.lit[id] !== lit) {
            e.lit[id] = lit;
            el.dataset.lit = lit ? "1" : "0";
          }
        } else {
          const g = clamp01((p - 0.3) / 0.1);
          op = 1 - g;
          sc = 1 - 0.06 * g;
          local = g;
        }
        cur[id] = { x, y, local };
        el.style.transform = `translate3d(${f1(x)}px,${f1(y)}px,0) translate(-50%,-50%) scale(${sc.toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
        el.style.visibility = op < 0.01 ? "hidden" : "visible";
      }

      const cl = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
      edges.forEach((edge, i) => {
        const path = dom.wires[i];
        const A = cur[edge.a];
        const B = cur[edge.b];
        if (!path || !A || !B) return;
        const op = edge.primary ? 1 - smooth(0, 0.45, A.local) : 1 - smooth(0.05, 0.7, s);
        if (op < 0.004) {
          path.style.opacity = "0";
          return;
        }
        const bx = lerp(B.x, cx, s);
        const by = lerp(B.y, cy, s);
        const bd = L!.bend;
        const c1x = lerp(cl(A.x + edge.bend.o1x * bd, 8, W - 8), lerp(A.x, bx, 0.33), s);
        const c1y = lerp(cl(A.y + edge.bend.o1y * bd, 8, H - 8), lerp(A.y, by, 0.33), s);
        const c2x = lerp(cl(bx + edge.bend.o2x * bd, 8, W - 8), lerp(A.x, bx, 0.67), s);
        const c2y = lerp(cl(by + edge.bend.o2y * bd, 8, H - 8), lerp(A.y, by, 0.67), s);
        path.setAttribute(
          "d",
          `M${f1(A.x)} ${f1(A.y)}C${f1(c1x)} ${f1(c1y)} ${f1(c2x)} ${f1(c2y)} ${f1(bx)} ${f1(by)}`,
        );
        path.style.opacity = op.toFixed(3);
      });

      const pillOp = 1 - smooth(0, 0.1, p);
      const tangle = pillOp > 0.01 ? "1" : "0";
      if (root.dataset.tangle !== tangle) root.dataset.tangle = tangle;
      conf.pills.forEach((pill, i) => {
        const el = dom.pills[i];
        const at = cur[pill.at];
        if (!el || !at) return;
        const hw = L!.pillHalf[i] ?? 50;
        const x = Math.min(W - hw - 8, Math.max(hw + 8, at.x + pill.dx * L!.scale));
        el.style.transform = `translate3d(${f1(x)}px,${f1(at.y + pill.dy * L!.scale)}px,0) translate(-50%,-50%)`;
        el.style.opacity = pillOp.toFixed(3);
        el.style.visibility = pillOp < 0.01 ? "hidden" : "visible";
      });

      HEXES.forEach((h, i) => {
        const g = dom.hexes[i];
        if (!g) return;
        const v = clamp01((fold(h.order) - 0.3) / 0.5);
        const sc = lerp(0.8, 1, out3(v));
        g.setAttribute("opacity", smooth(0, 0.6, v).toFixed(3));
        g.setAttribute(
          "transform",
          v >= 1 ? "" : `translate(${h.cx} ${h.cy}) scale(${sc.toFixed(3)}) translate(${-h.cx} ${-h.cy})`,
        );
      });
      dom.backing?.setAttribute("opacity", smooth(0.5, 0.62, p).toFixed(3));
      if (dom.slot) dom.slot.style.opacity = (smooth(0.04, 0.3, p) * (1 - smooth(0.42, 0.52, p))).toFixed(3);
      if (dom.halo) dom.halo.style.opacity = (0.7 * smooth(0.5, 0.8, p)).toFixed(3);
      if (dom.caption) {
        const c = smooth(0.6, 0.85, p);
        dom.caption.style.opacity = c.toFixed(3);
        dom.caption.style.transform = `translate(-50%,${f1(4 * (1 - c))}px)`;
        dom.caption.style.visibility = c < 0.01 ? "hidden" : "visible";
      }

      L.slots.forEach((slot, i) => {
        const el = dom.specs[i];
        const spoke = dom.spokes[i];
        if (!el) return;
        const q = clamp01((p - 0.62 - conf.emerge[i] * 0.03) / 0.15);
        const k = out3(q);
        const x = lerp(lerp(cx, slot.x, 0.35), slot.x, k);
        const y = lerp(lerp(cy, slot.y, 0.35), slot.y, k);
        const sc = lerp(0.94, 1, k);
        const op = smooth(0, 0.6, q);
        el.style.transform = `translate3d(${f1(x)}px,${f1(y)}px,0) translate(-50%,-50%) scale(${sc.toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
        el.style.visibility = op < 0.01 ? "hidden" : "visible";
        const a = L!.anchors[i];
        const icon = L!.icons[i];
        if (spoke && a && icon) {
          spoke.setAttribute("x1", f1(a.x));
          spoke.setAttribute("y1", f1(a.y));
          spoke.setAttribute("x2", f1(x + icon.x * sc));
          spoke.setAttribute("y2", f1(y + icon.y * sc));
          spoke.style.opacity = smooth(0.2, 1, q).toFixed(3);
        }
      });
    };

    const showOutro = (r: number) => {
      if (r === e.reveal || !dom.outro) return;
      const was = e.reveal;
      e.reveal = r;
      dom.outro.style.opacity = r < 0.01 ? "0" : r.toFixed(3);
      dom.outro.style.transform = r >= 1 ? "" : `translateY(${f1(14 * (1 - r))}px)`;
      dom.outro.style.pointerEvents = r > 0.6 ? "" : "none";
      const el = document.activeElement;
      if (r < 0.01 && was >= 0.01 && el instanceof HTMLElement && dom.outro.contains(el) && !focusVisible(el)) {
        el.blur();
      }
    };

    const active = () => e.inView && !document.hidden;

    const stopPackets = () => dom.packets.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));

    const startFlow = () => {
      stopPackets();
      if (!L) return;
      dom.packets.forEach((el) => {
        const i = Number(el.dataset.packet);
        const n = Number(el.dataset.n);
        const a = L!.anchors[i];
        const slot = L!.slots[i];
        const icon = L!.icons[i];
        if (!a || !slot || !icon) return;
        const b = { x: slot.x + icon.x, y: slot.y + icon.y };
        const [p0, p1] = n === FLOW - 1 ? [b, a] : [a, b];
        const dur = Math.max(1100, Math.hypot(b.x - a.x, b.y - a.y) / FLOW_SPEED);
        const at = (u: number) =>
          `translate3d(${f1(lerp(p0.x, p1.x, u))}px,${f1(lerp(p0.y, p1.y, u))}px,0) translate(-50%,-50%)`;
        el.animate(
          [
            { transform: at(0.06), opacity: 0 },
            { transform: at(0.16), opacity: 1, offset: 0.1 },
            { transform: at(0.84), opacity: 1, offset: 0.9 },
            { transform: at(0.94), opacity: 0 },
          ],
          { duration: dur, iterations: Infinity, delay: -((n + i * 0.37) / FLOW) * dur },
        );
      });
    };

    const tick = () => {
      const now = performance.now();
      e.liveT += (now - e.liveLast) / 1000;
      e.liveLast = now;
      const next = SPECS.map((_, i) => statusAt(i, e.liveT));
      if (next.some((st, i) => st !== e.live[i])) {
        e.live = next;
        setStatuses(next);
      }
    };

    const stopLive = () => {
      if (e.liveTimer) window.clearInterval(e.liveTimer);
      e.liveTimer = 0;
      stopPackets();
    };

    const syncLive = () => {
      const should = !reduced && active() && e.P === 1;
      if (should && !e.liveTimer) {
        e.liveLast = performance.now();
        e.liveTimer = window.setInterval(tick, 200);
        startFlow();
      } else if (!should && e.liveTimer) stopLive();
    };

    const resetLive = () => {
      stopLive();
      e.liveT = 0;
      e.live = REST;
      setStatuses(REST);
    };

    const track: Track = { top: NAV_CLEAR, dist: 0, hold: 0, lead: 0 };

    const sizeTrack = () => {
      if (reduced) {
        root.style.height = "";
        pin.style.top = "";
        return;
      }
      const vh = view.vh;
      track.dist = Math.round(Math.min(1100, Math.max(640, vh * 1.15)));
      track.hold = Math.round(vh * 0.4);
      const h = pin.offsetHeight;
      track.top = Math.round(h <= vh - NAV_CLEAR - 24 ? (vh + NAV_CLEAR - h) / 2 : vh - h - 12);
      pin.style.top = `${track.top}px`;
      track.lead = Math.max(0, Math.round(track.top - (root.getBoundingClientRect().top + window.scrollY)));
      root.style.height = `${h + track.lead + track.dist + track.hold}px`;
    };

    const apply = (p: number, r: number, force = false) => {
      if (!force && p === e.P) {
        showOutro(r);
        return;
      }
      const left = e.P === 1 && p < 1;
      e.P = p;
      render(p);
      showOutro(r);
      if (left) resetLive();
      syncLive();
    };

    const sync = (force = false) => {
      if (reduced) {
        apply(e.P, e.P === 1 ? 1 : 0, force);
        return;
      }
      const s = track.top - root.getBoundingClientRect().top - track.lead;
      apply(clamp01(s / track.dist), smooth(track.dist * 0.86, track.dist + track.hold * 0.45, s), force);
    };

    const onScroll = () => {
      if (reduced || e.raf) return;
      e.raf = requestAnimationFrame(() => {
        e.raf = 0;
        sync();
      });
    };

    let pointerAt = -Infinity;
    let focusRaf = 0;
    let parked: Element | null = null;

    const onPointer = () => {
      pointerAt = performance.now();
    };

    const onWinBlur = () => {
      parked = document.activeElement;
    };

    const toReveal = () => {
      focusRaf = 0;
      if (e.reveal >= 1 || !dom.outro?.contains(document.activeElement)) return;
      const s = track.dist + track.hold * 0.45 + 2;
      const y = root.getBoundingClientRect().top + window.scrollY - track.top + track.lead + s;
      window.scrollTo({ top: Math.round(y), behavior: prefersReduced() ? "auto" : "smooth" });
    };

    const onFocusIn = (ev: FocusEvent) => {
      const refocus = ev.target === parked;
      parked = null;
      if (reduced || e.reveal >= 1 || !(ev.target instanceof Element)) return;
      // Browsers re-fire focusin on the focused element when the window regains focus.
      if (!focusVisible(ev.target) && (refocus || performance.now() - pointerAt < 1000)) return;
      cancelAnimationFrame(focusRaf);
      // Wait out the browser's own focus scroll, which cancels a smooth scroll started during focusin.
      focusRaf = requestAnimationFrame(() => {
        focusRaf = requestAnimationFrame(toReveal);
      });
    };

    const onActivity = () => {
      const on = active();
      root.dataset.paused = on ? "0" : "1";
      syncLive();
    };

    const relayout = () => {
      readView();
      L = measure();
      sizeTrack();
      sync(true);
      if (e.liveTimer) startFlow();
    };
    if (reduced) e.P = 1;
    e.reveal = -1;
    relayout();

    let alive = true;
    const ro = new ResizeObserver(() => {
      const v = variantFor(stage.clientWidth);
      if (v !== variant) setVariant(v);
      else relayout();
    });
    ro.observe(stage);
    ro.observe(pin);
    document.fonts?.ready.then(() => {
      if (alive) relayout();
    });

    const io = new IntersectionObserver((entries) => {
      for (const en of entries) e.inView = en.isIntersecting;
      onActivity();
    });
    io.observe(stage);
    dom.outro?.addEventListener("focusin", onFocusIn);
    dom.outro?.addEventListener("pointerdown", onPointer);
    dom.outro?.addEventListener("pointerup", onPointer);
    document.addEventListener("visibilitychange", onActivity);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", relayout);
    window.addEventListener("blur", onWinBlur);

    return () => {
      alive = false;
      ro.disconnect();
      io.disconnect();
      dom.outro?.removeEventListener("focusin", onFocusIn);
      dom.outro?.removeEventListener("pointerdown", onPointer);
      dom.outro?.removeEventListener("pointerup", onPointer);
      document.removeEventListener("visibilitychange", onActivity);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", relayout);
      window.removeEventListener("blur", onWinBlur);
      cancelAnimationFrame(e.raf);
      e.raf = 0;
      cancelAnimationFrame(focusRaf);
      stopLive();
      e.lit = {};
    };
  }, [variant, reduced]);

  const narrow = variant === "narrow";
  const wires = edgesFor(cfg.tools);

  return (
    <div className={styles.root} ref={rootRef} data-scroll={reduced ? "0" : "1"}>
      <div className={styles.pin} ref={pinRef}>
        <div className={styles.stage} ref={stageRef} data-variant={variant} aria-hidden="true">
          <div className={styles.halo} data-halo />
          <svg className={styles.lines}>
            {wires.map((edge) => (
              <path
                key={edge.i}
                data-wire={edge.i}
                className={edge.primary ? styles.wire : edge.i % 3 === 0 ? styles.wireDashed : styles.wireFaint}
              />
            ))}
            {cfg.slots.map((s, i) => (
              <line
                key={`spoke-${s}`}
                data-spoke={i}
                className={s < 0 ? styles.spokeGhost : styles.spoke}
                style={s < 0 ? undefined : ({ "--c": SPECS[s].color } as CSSProperties)}
              />
            ))}
          </svg>
          <div className={styles.layer}>
            {cfg.slots.flatMap((s, i) =>
              s < 0
                ? []
                : Array.from({ length: FLOW }, (_, n) => (
                    <span
                      key={`packet-${s}-${n}`}
                      data-packet={i}
                      data-n={n}
                      className={styles.packet}
                      style={{ "--c": SPECS[s].color } as CSSProperties}
                    />
                  )),
            )}
          </div>
          <svg className={styles.hub} data-hub viewBox="0 0 94 84">
            <path data-hubslot className={styles.hubSlot} d={HUB_SLOT} vectorEffect="non-scaling-stroke" />
            <path data-backing d={HUB_BACKING} fill="#FFC300" />
            {HEXES.map((h) => (
              <g key={h.key} data-hex={h.key}>
                <path d={h.d} fill={h.fill} {...(h.key === "c" ? {} : { stroke: "#FFC300", strokeWidth: 2 })} />
                {h.key === "c" && <path d={HUB_GLYPH} fill="#fff" />}
              </g>
            ))}
          </svg>
          {!narrow && (
            <div className={styles.caption} data-caption>
              <span className={styles.captionName}>ButteryAI</span>
              <span className={styles.captionList}>Routing · Evals</span>
              <span className={styles.captionList}>Guardrails · Monitoring</span>
            </div>
          )}
          <div className={styles.layer}>
            {cfg.tools.map((id) => {
              const tool = TOOL_BY[id];
              const hex = tool.hex ? HEX_BY[tool.hex] : null;
              const tone = hex
                ? ({
                    "--hex": hex.key === "c" ? "#E0A500" : hex.fill,
                  } as CSSProperties)
                : undefined;
              return (
                <div key={id} data-tool={id} className={styles.tool} style={tone}>
                  {hex && <span data-ring={id} className={styles.ring} />}
                  <Line viewBox="0 0 20 20" className={styles.toolIcon}>
                    <Paths d={TOOL_ICON[id]} />
                  </Line>
                  <span className={styles.toolLabel}>{tool.label}</span>
                </div>
              );
            })}
            {cfg.pills.map((pill) => (
              <div key={pill.text} data-pill className={styles.pill} data-tone={pill.tone}>
                <span className={styles.dot} />
                {pill.text}
              </div>
            ))}
            {cfg.slots.map((s, i) => {
              const side = cfg.slotPos[i][0] < 0.5 ? "left" : "right";
              if (s < 0) {
                return (
                  <div key="ghost" data-slot data-side={side} className={`${styles.spec} ${styles.ghost}`}>
                    <svg data-icon className={styles.specIcon} viewBox="0 0 24 24" aria-hidden="true">
                      <path d={HEX_ICON} className={styles.ghostHex} />
                      <path d="M12 8.4v7.2M8.4 12h7.2" className={styles.ghostPlus} />
                    </svg>
                    <span className={styles.specName}>Your specialist</span>
                  </div>
                );
              }
              const spec = SPECS[s];
              const st = STATUS[statuses[s]];
              return (
                <div key={spec.name} data-slot data-side={side} className={styles.spec}>
                  <svg data-icon className={styles.specIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d={HEX_ICON} fill={spec.color} stroke={spec.color} strokeWidth="2.4" strokeLinejoin="round" />
                    <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <Paths d={GLYPH[spec.glyph]} />
                    </g>
                  </svg>
                  <span className={styles.specText}>
                    <span className={styles.specName}>
                      {spec.name}
                      {!narrow && " specialist"}
                    </span>
                    <span key={statuses[s]} className={styles.chip} data-status={statuses[s]}>
                      <Line viewBox="0 0 12 12">
                        <path d={st.d} strokeWidth="1.6" />
                      </Line>
                      {st.label}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {outro && (
          <div className={styles.outro} data-outro>
            {outro}
          </div>
        )}
      </div>
      <p className={styles.srOnly}>
        Illustration: separate AI tools wired together in a tangle, with open issues like timeouts, retry loops and cost
        spikes, become one ButteryAI system, with AI specialists around it whose answers are routed, scored and trusted.
      </p>
    </div>
  );
};

export default StackUntangle;
