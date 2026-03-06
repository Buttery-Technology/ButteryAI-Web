import PuzzlePiece from "@assets/icons/puzzle-piece.svg?react";
import styles from "./ExtensionLogo.module.scss";

interface ExtensionLogoProps {
  logoUrl?: string;
  size?: number;
}

const ExtensionLogo = ({ logoUrl, size = 28 }: ExtensionLogoProps) => {
  if (logoUrl) {
    return (
      <img
        className={styles.logo}
        src={logoUrl}
        alt=""
        width={size}
        height={size}
      />
    );
  }
  return <PuzzlePiece className={styles.logo} style={{ width: size, height: size }} />;
};

export default ExtensionLogo;
