import { HEX_PATH, HEX_VIEWBOX } from "../shared";
import { SPECIALISTS, type SpecialistName } from "./specialists";

const SpecialistMark = ({ name, className }: { name: SpecialistName; className?: string }) => (
  <svg className={className} viewBox={HEX_VIEWBOX} aria-hidden="true">
    <path d={HEX_PATH} fill={SPECIALISTS[name].color} />
    <g
      transform="translate(33 18) scale(1.25) translate(-12 -12)"
      fill="none"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {SPECIALISTS[name].glyph.map((p) => (
        <path key={p} d={p} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  </svg>
);

export default SpecialistMark;
