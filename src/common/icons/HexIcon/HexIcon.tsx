import type { ReactNode } from "react";
import styles from "./HexIcon.module.scss";

type HexIconProps = {
  color: string;
  icon: ReactNode;
  className?: string;
};

const HexIcon = ({ color, icon, className }: HexIconProps) => {
  const classesNames = [styles.root];
  if (className) classesNames.push(className);
  const cls = classesNames.join(" ");

  return (
    <div className={cls}>
      <svg viewBox="0 0 468 540" className={styles.hexSvg}>
        <path
          d="M273 22 L427 112 Q468 135 468 180 L468 360 Q468 405 427 428 L273 518 Q234 540 195 518 L41 428 Q0 405 0 360 L0 180 Q0 135 41 112 L195 22 Q234 0 273 22 Z"
          fill={color}
        />
      </svg>
      <div className={styles.customIcon}>{icon}</div>
    </div>
  );
};

export default HexIcon;
