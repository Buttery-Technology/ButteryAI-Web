import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import styles from "./HomeHero.module.scss";

const LOGO_COLOR = "#F9C000";
const ROWS = 3;
const COLS = 14;

// Diagonal color sequence (repeats as needed, starting with light blue to align with logo)
const DIAGONAL_COLORS = [
  "#31AFF5",
  "#288ED2",
  "#755CBA",
  "#D12A89",
  "#D22839",
  "#22908C",
];

const HomeHero = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"loading" | "transitioning" | "complete">("loading");
  const [initialDimensions, setInitialDimensions] = useState<{ height: number; width: number } | null>(null);
  const [dragState, setDragState] = useState<{ key: string; offsetX: number; offsetY: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [buttonInFooter, setButtonInFooter] = useState(false);
  const [buttonFooterStyle, setButtonFooterStyle] = useState<React.CSSProperties>({});
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const logoStartPos = useRef<{ top: number; left: number; width: number } | null>(null);
  const lastScrollY = useRef(window.scrollY);

  // Capture viewport dimensions and update on horizontal resize
  useEffect(() => {
    const updateDimensions = () => {
      setInitialDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });

      // Reset scroll tracking and trigger recalculation
      lastScrollY.current = -1;
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('scroll'));
      });
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate hexagon transforms based on initial viewport width
  const getHexTransform = (position: "left" | "logo" | "right") => {
    if (!initialDimensions || phase === "loading") return undefined;

    // Responsive values matching SCSS breakpoints
    let hexWidth: number;
    let minClearance: number;
    let multiplier: number;

    if (initialDimensions.width <= 768) {
      hexWidth = 98;
      minClearance = 120;
      multiplier = 1;
    } else if (initialDimensions.width <= 1200) {
      hexWidth = 137;
      minClearance = 280;
      multiplier = 1.5;
    } else {
      hexWidth = 180;
      minClearance = 320;
      multiplier = 2.5;
    }

    if (position === "right") {
      const translateX = Math.max(minClearance, initialDimensions.width / 2 - hexWidth * multiplier);
      return `translateX(${translateX}px)`;
    } else if (position === "left") {
      const translateX = Math.min(-minClearance, -initialDimensions.width / 2 + hexWidth * multiplier);
      return `translateX(${translateX}px)`;
    }
    return undefined;
  };

  const centerCol = Math.floor(COLS / 2);
  const centerRow = Math.floor(ROWS / 2);
  const logoCol = centerCol - 1;

  const hexagons = useMemo(() => {
    const grid: {
      row: number;
      col: number;
      color: string;
      isLogo: boolean;
      position: "left" | "logo" | "right";
      delay: number;
    }[] = [];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isLogo = row === centerRow && col === logoCol;
        const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);

        let position: "left" | "logo" | "right";
        if (isLogo) {
          position = "logo";
        } else if (col >= centerCol) {
          position = "right";
        } else {
          position = "left";
        }

        // Determine color based on diagonal position (accounting for honeycomb offset on odd rows)
        let color: string;
        if (isLogo) {
          color = LOGO_COLOR;
        } else {
          // Odd rows are shifted right, so adjust diagonal calculation
          const rowOffset = Math.floor(row / 2);
          const diagonal = col - rowOffset;
          // Handle negative values with proper modulo
          const diagonalIndex = ((diagonal % DIAGONAL_COLORS.length) + DIAGONAL_COLORS.length) % DIAGONAL_COLORS.length;
          color = DIAGONAL_COLORS[diagonalIndex];
        }

        grid.push({
          row,
          col,
          color,
          isLogo,
          position,
          delay: distance * 0.05,
        });
      }
    }
    return grid;
  }, [centerCol, centerRow, logoCol]);

  useEffect(() => {
    // Start transition after initial grid animation completes
    const transitionDelay = setTimeout(() => {
      setPhase("transitioning");
    }, 1500);

    // Mark complete after transition finishes
    const completeDelay = setTimeout(() => {
      setPhase("complete");
    }, 2100);

    return () => {
      clearTimeout(transitionDelay);
      clearTimeout(completeDelay);
    };
  }, []);

  // Scroll-linked animation for logo and hexagons - active after initial animation completes
  useEffect(() => {
    if (phase !== "complete") return;

    let lastViewportWidth = 0;

    const handleScroll = () => {
      if (!rootRef.current || !logoRef.current) return;

      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;

      // Skip if nothing changed (neither scroll nor viewport width)
      if (scrollY === lastScrollY.current && viewportWidth === lastViewportWidth) return;
      lastScrollY.current = scrollY;
      lastViewportWidth = viewportWidth;

      // Capture logo's BASE position (without CSS transform) once
      if (!logoStartPos.current) {
        // Temporarily remove transform to get base position
        logoRef.current.style.transform = "none";
        const rect = logoRef.current.getBoundingClientRect();
        logoRef.current.style.transform = "";

        logoStartPos.current = {
          top: rect.top,
          left: rect.left + rect.width / 2,
          width: rect.width,
        };
      }

      const heroHeight = rootRef.current.offsetHeight;
      // Progress from 0 to 1 - complete transition in 1/3 of hero height for faster animation
      const progress = Math.min(Math.max(scrollY / (heroHeight / 3), 0), 1);

      // Don't apply any style until user starts scrolling
      if (progress === 0) {
        logoRef.current.style.transform = "";
        return;
      }

      const endScale = 0.4;
      const endTop = 5;

      // Logo dimensions
      const logoHeight = 207;
      const rowHeight = logoHeight * 0.75; // 155.25px per grid row
      const gap = 16;
      const scaledLogoHeight = logoHeight * endScale;

      // Grid is centered in viewport via transform: translate(-50%, -50%)
      // Grid has 3 rows: total track height = 3 * 181.5 + 2 * 16 = 576.5px
      const gridHeight = 3 * rowHeight + 2 * gap;
      const viewportCenterY = window.innerHeight / 2;

      // Grid top in viewport = viewportCenter - gridHeight/2
      const gridTop = viewportCenterY - gridHeight / 2;

      // Logo is in row 1 (middle row, 0-indexed)
      // Row 1 starts at: rowHeight + gap = 197.5px from grid top
      const logoTopInGrid = rowHeight + gap;
      const logoTopInViewport = gridTop + logoTopInGrid;
      const logoCenterInViewport = logoTopInViewport + logoHeight / 2;

      // CSS transform moves logo up by one row height
      const cssTransformY = -(rowHeight + gap);

      // Target: top edge at endTop when scaled to 0.5
      // Center needs to be at: endTop + scaledHeight/2
      const targetCenterY = endTop + scaledLogoHeight / 2;

      // Calculate the final translateY needed to reach target from grid position
      const endTranslateY = targetCenterY - logoCenterInViewport;

      // Interpolate from CSS transform to end
      const currentTranslateY = cssTransformY + (endTranslateY - cssTransformY) * progress;
      const currentScale = 1 - (1 - endScale) * progress;

      logoRef.current.style.transform = `translateY(${currentTranslateY}px) scale(${currentScale})`;
      logoRef.current.style.zIndex = "100";

      // Calculate hexagon spread based on scroll into next-gen section
      // Start spreading earlier so hexagons move as section comes into view
      const spreadStart = heroHeight * 0.2;
      const spreadEnd = heroHeight * 0.7;
      const spreadProgress = Math.min(Math.max((scrollY - spreadStart) / (spreadEnd - spreadStart), 0), 1);

      // Calculate base clearance and spread based on current viewport
      let baseHexClearance: number;
      let maxSpread: number;
      let hexWidthForCalc: number;
      let multiplierForCalc: number;

      if (viewportWidth <= 768) {
        baseHexClearance = 120;
        maxSpread = 250;
        hexWidthForCalc = 98;
        multiplierForCalc = 1;
      } else if (viewportWidth <= 1200) {
        baseHexClearance = 350;
        maxSpread = 150;
        hexWidthForCalc = 137;
        multiplierForCalc = 1.5;
      } else {
        baseHexClearance = 320;
        maxSpread = 150;
        hexWidthForCalc = 180;
        multiplierForCalc = 2.5;
      }

      // Calculate base transform (matching CSS logic)
      const baseTranslateX = Math.max(baseHexClearance, viewportWidth / 2 - hexWidthForCalc * multiplierForCalc);
      const additionalSpread = spreadProgress * maxSpread;

      // Second phase: when HomeSmart section content would overlap with left hexagons
      // HomeSmart is after Hero and NextGen sections
      // Start moving left hexagons off when HomeSmart content comes into contact
      const smartSectionStart = heroHeight * 1.5; // When HomeSmart starts entering viewport
      const smartSectionEnd = heroHeight * 2.0; // When HomeSmart is fully in view
      const smartProgress = Math.min(Math.max((scrollY - smartSectionStart) / (smartSectionEnd - smartSectionStart), 0), 1);

      // Third phase: when HomeEfficiency section comes into view (centered content)
      // Left hexagons should come back into view
      const efficiencySectionStart = heroHeight * 2.5; // When HomeEfficiency starts entering
      const efficiencySectionEnd = heroHeight * 3.0; // When HomeEfficiency is in view
      const efficiencyProgress = Math.min(Math.max((scrollY - efficiencySectionStart) / (efficiencySectionEnd - efficiencySectionStart), 0), 1);

      // Fourth phase: when HomeExtensions section comes into view (left-aligned content)
      // Left hexagons should move off screen again, right hexagons come closer
      // Start after HomeEfficiency is in view, complete as HomeExtensions enters
      const extensionsSectionStart = heroHeight * 3.5; // Start moving after HomeEfficiency is shown
      const extensionsSectionEnd = heroHeight * 4.0; // Complete transition as HomeExtensions enters
      const extensionsProgress = Math.min(Math.max((scrollY - extensionsSectionStart) / (extensionsSectionEnd - extensionsSectionStart), 0), 1);

      // Fifth phase: when HomeWorkflows section comes into view (left-aligned diagram)
      // Use actual element position for collision detection
      const workflowsSection = document.querySelector('[data-section="workflows"]');
      let workflowsInView = false;
      if (workflowsSection) {
        const rect = workflowsSection.getBoundingClientRect();
        // Section is in view when diagram is actually visible
        // End when bottom reaches middle of viewport to give HomeSecurity plenty of time
        workflowsInView = rect.top < window.innerHeight && rect.bottom > window.innerHeight * 0.5;
      }
      const workflowsProgress = workflowsInView ? 1 : 0;

      // Sixth phase: HomeSecurity section (right-aligned content)
      // Right hexagons should move off screen, left hexagons should come back
      const securitySection = document.querySelector('[data-section="security"]');
      let securityInView = false;
      let securityApproaching = false;
      let securityProgress = 0;
      if (securitySection) {
        const rect = securitySection.getBoundingClientRect();
        // Detect when section is approaching (within 300px of viewport) to start moving hexagons early
        const approachBuffer = 300;
        securityApproaching = rect.top < window.innerHeight + approachBuffer && rect.bottom > 0;
        securityInView = rect.top < window.innerHeight && rect.bottom > 0;
        // Calculate progress for smooth transition - start earlier with the approach buffer
        const transitionStart = window.innerHeight + approachBuffer;
        const transitionEnd = window.innerHeight * 0.3;
        securityProgress = Math.min(Math.max((transitionStart - rect.top) / (transitionStart - transitionEnd), 0), 1);
      }

      // Seventh phase: HomeGovernance section (centered content)
      // Both hexagons should come close to the content but not overlap
      const governanceSection = document.querySelector('[data-section="governance"]');
      let governanceInView = false;
      let governanceProgress = 0;
      if (governanceSection) {
        const rect = governanceSection.getBoundingClientRect();
        governanceInView = rect.top < window.innerHeight && rect.bottom > 100;
        // Calculate progress for smooth transition (similar to securityProgress)
        const transitionStart = window.innerHeight;
        const transitionEnd = window.innerHeight * 0.3;
        governanceProgress = Math.min(Math.max((transitionStart - rect.top) / (transitionStart - transitionEnd), 0), 1);
      }

      // Eighth phase: HomeDesign section - push ALL hexagons off screen (has its own hexagon visual)
      const designSection = document.querySelector('[data-section="design"]');
      let designInView = false;
      let designProgress = 0;
      if (designSection) {
        const rect = designSection.getBoundingClientRect();
        designInView = rect.top < window.innerHeight + 300 && rect.bottom > -300;
        // Calculate progress for smooth transition - start pushing hexagons off as design enters
        const transitionStart = window.innerHeight;
        const transitionEnd = window.innerHeight * 0.5;
        designProgress = Math.min(Math.max((transitionStart - rect.top) / (transitionStart - transitionEnd), 0), 1);
      }

      // Eighth phase: HomeFooter section - bring hexagons back into view on both sides
      const footerSection = document.querySelector('[data-section="footer"]');
      let footerInView = false;
      let footerProgress = 0;
      if (footerSection) {
        const rect = footerSection.getBoundingClientRect();
        // Start transitioning when footer comes into view
        footerInView = rect.top < window.innerHeight + 200;
        // Calculate progress for smooth transition
        const transitionStart = window.innerHeight + 200;
        const transitionEnd = window.innerHeight * 0.5;
        footerProgress = Math.min(Math.max((transitionStart - rect.top) / (transitionStart - transitionEnd), 0), 1);

        // Position button under footer title when footer is in view
        const footerTitle = footerSection.querySelector('h1');
        if (footerTitle && startButtonRef.current) {
          const titleRect = footerTitle.getBoundingClientRect();
          // Check if footer title is visible in viewport (not just footer section)
          const titleInView = titleRect.bottom < window.innerHeight && titleRect.top > 0;

          if (titleInView) {
            // Position button centered under the title
            const buttonTop = titleRect.bottom + 32; // 32px gap below title
            setButtonInFooter(true);
            setButtonFooterStyle({
              position: 'fixed',
              top: buttonTop,
              bottom: 'auto',
              left: '50%',
              transform: 'translateX(-50%)',
            });
          } else {
            setButtonInFooter(false);
            setButtonFooterStyle({});
          }
        }
      } else {
        setButtonInFooter(false);
        setButtonFooterStyle({});
      }

      // Left hexagons: move off during HomeSmart, come back during HomeEfficiency, move off again during HomeExtensions, come back during HomeSecurity, stay for HomeGovernance
      const smartLeftSpread = smartProgress * (viewportWidth * 0.6) * (1 - efficiencyProgress);
      const extensionsLeftSpread = extensionsProgress * (viewportWidth * 0.6) * (1 - securityProgress) * (1 - governanceProgress);
      const leftExtraSpread = smartLeftSpread + extensionsLeftSpread;
      let leftTotalSpread = baseTranslateX + additionalSpread + leftExtraSpread;

      // Right hexagons: come closer during HomeSmart, spread back out during HomeEfficiency, come closer again during HomeExtensions, move off during HomeSecurity, come back during HomeGovernance
      const smartRetract = smartProgress * 120 * (1 - efficiencyProgress);
      const extensionsRetract = extensionsProgress * 200 * (1 - securityProgress) * (1 - governanceProgress);
      const rightRetract = smartRetract + extensionsRetract;
      let rightTotalSpread = baseTranslateX + additionalSpread - rightRetract;

      // Apply collision avoidance during HomeSmart section (connector lines)
      if (smartProgress > 0 && efficiencyProgress < 1) {
        const lineRightEdge = 1100; // left: 700px + width: 400px
        const hexHalfWidth = 90;
        const buffer = 20;
        const minRightSpread = Math.max(0, lineRightEdge - viewportWidth / 2 + hexHalfWidth + buffer);
        rightTotalSpread = Math.max(minRightSpread, rightTotalSpread);
      }

      // Apply collision avoidance during HomeExtensions section (left-aligned content)
      // Stop when security is approaching AND workflows is out of view
      if (extensionsProgress > 0 && workflowsProgress < 1 && (!securityApproaching || workflowsInView)) {
        // Content extends to about 40px padding + 740px cards at tablet, 80px padding at desktop
        const contentRightEdge = viewportWidth <= 1200 ? 780 : 820;
        const hexHalfWidth = viewportWidth <= 1200 ? 68 : 90;
        const buffer = 10;
        const minRightSpread = Math.max(0, contentRightEdge - viewportWidth / 2 + hexHalfWidth + buffer);
        rightTotalSpread = Math.max(minRightSpread, rightTotalSpread);
      }

      // Apply collision avoidance during HomeWorkflows section (left-aligned diagram)
      // Note: Don't check !securityInView here - we need collision avoidance even when
      // HomeSecurity starts entering viewport, as the diagram may still be visible
      if (workflowsInView) {
        // On narrow viewports, push ALL hexagons completely off screen since diagram takes full width
        // Use a larger spread value to ensure hexagons are fully hidden
        const offScreenSpread = viewportWidth <= 1200 ? viewportWidth : viewportWidth * 0.6;

        // Left hexagons should stay off screen during HomeWorkflows
        leftTotalSpread = Math.max(leftTotalSpread, offScreenSpread);

        // Right hexagons collision avoidance for diagram
        if (viewportWidth <= 1200) {
          // Diagram takes nearly full width on tablet/mobile - push hexagons completely off
          rightTotalSpread = Math.max(rightTotalSpread, offScreenSpread);
        } else {
          // Desktop: 80px padding, max-width 1100px -> right edge at min(80 + 1100, viewportWidth - 80)
          const diagramRightEdge = Math.min(80 + 1100, viewportWidth - 80);
          const hexHalfWidth = 90;
          const buffer = 40;
          const minRightSpread = Math.max(0, diagramRightEdge - viewportWidth / 2 + hexHalfWidth + buffer);
          rightTotalSpread = Math.max(minRightSpread, rightTotalSpread);
        }
      }

      // Apply HomeSecurity section behavior (right-aligned content)
      // Push right hexagons off when section is APPROACHING (before it enters viewport)
      // Only after workflows is out of view to avoid premature push-off
      if (securityApproaching && !designInView && !workflowsInView) {
        // Right hexagons stay fully off screen as soon as security is approaching
        const offScreenSpread = viewportWidth * 0.6;
        rightTotalSpread = offScreenSpread;

        // Left hexagons: only bring back once section is actually in view AND workflows is out of view
        if (securityInView && !workflowsInView) {
          // Calculate where cards actually are to avoid overlap
          // Section has 80px padding, content is 940px max-width aligned right
          const sectionPadding = 80;
          const contentMaxWidth = 940;
          const availableWidth = viewportWidth - sectionPadding * 2;
          // Content left edge from viewport left
          const contentLeftEdge = sectionPadding + Math.max(0, availableWidth - contentMaxWidth);
          // Calculate spread needed to keep hexagons left of cards
          const hexHalfWidth = viewportWidth <= 768 ? 49 : viewportWidth <= 1200 ? 68 : 90;
          const buffer = 40;
          // Spread from center to position hexagon edge just left of cards
          const minLeftSpread = (viewportWidth / 2) - contentLeftEdge + hexHalfWidth + buffer;
          leftTotalSpread = Math.max(baseTranslateX, minLeftSpread);
        }
      }

      // Apply HomeGovernance section behavior (centered content)
      // Both hexagons come close to content but don't overlap
      // This runs even when security is in view to properly blend the transition
      if (governanceInView) {
        // Content is centered with max-width 940px
        const contentWidth = Math.min(940, viewportWidth - 160); // Account for padding
        const hexHalfWidth = viewportWidth <= 768 ? 49 : viewportWidth <= 1200 ? 68 : 90;
        const buffer = 30; // Gap between hexagon and content

        // For centered content, hexagons need to be spread half the content width + hexagon size + buffer
        // This positions them just outside each edge of the centered content
        const spreadFromCenter = contentWidth / 2 + hexHalfWidth + buffer;
        const offScreenSpread = viewportWidth * 0.6;

        // Blend from off-screen to governance position, then back to off-screen as design enters
        // governanceProgress: 0 = off-screen, 1 = at governance position
        // designProgress: 0 = at governance position, 1 = off-screen
        const governanceSpread = offScreenSpread - (offScreenSpread - spreadFromCenter) * governanceProgress * (1 - designProgress);

        // Only override left hexagons when security is NOT in view
        // When security is in view (desktop), left hexagons are already positioned correctly
        // This prevents them from flashing off when governance starts entering
        if (!securityInView) {
          leftTotalSpread = governanceSpread;
        } else if (viewportWidth > 1200) {
          // On desktop during transition, blend left hexagons from security position to governance position
          const securityLeftSpread = leftTotalSpread; // Current position set by security block
          leftTotalSpread = securityLeftSpread + (spreadFromCenter - securityLeftSpread) * governanceProgress * (1 - designProgress);
        }

        rightTotalSpread = governanceSpread;
      }

      // When HomeDesign is in view but footer isn't, push both sides off screen
      if (designInView && !footerInView && !governanceInView) {
        const offScreenSpread = viewportWidth * 0.6;
        leftTotalSpread = Math.max(leftTotalSpread, offScreenSpread);
        rightTotalSpread = Math.max(rightTotalSpread, offScreenSpread);
      }

      // When footer is coming into view, smoothly bring hexagons back
      if (footerInView) {
        // Target spread for footer - similar to initial spread but both sides visible
        const footerTargetSpread = baseTranslateX + additionalSpread;
        const offScreenSpread = viewportWidth * 0.6;

        // Interpolate from off-screen to footer position
        leftTotalSpread = offScreenSpread - (offScreenSpread - footerTargetSpread) * footerProgress;
        rightTotalSpread = offScreenSpread - (offScreenSpread - footerTargetSpread) * footerProgress;
      }

      // FALLBACK: If HomeSecurity is entering viewport, ensure right hexagons are off
      // This catches any edge cases where other logic didn't push them off in time
      if (securitySection && !governanceInView && !designInView && !footerInView) {
        const rect = securitySection.getBoundingClientRect();
        // If HomeSecurity top is in the lower 80% of viewport, force hexagons off
        if (rect.top < window.innerHeight * 0.8) {
          const offScreenSpread = viewportWidth * 0.6;
          rightTotalSpread = Math.max(rightTotalSpread, offScreenSpread);
        }
      }

      // Apply to all hexagon elements
      const leftHexes = rootRef.current.querySelectorAll(`.${styles.leftHex}`) as NodeListOf<HTMLElement>;
      const rightHexes = rootRef.current.querySelectorAll(`.${styles.rightHex}`) as NodeListOf<HTMLElement>;

      leftHexes.forEach((hex) => {
        hex.style.transform = `translateX(${-leftTotalSpread}px)`;
      });

      rightHexes.forEach((hex) => {
        hex.style.transform = `translateX(${rightTotalSpread}px)`;
      });
    };

    // Run immediately to set correct initial positions
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [phase]);

  // Drag handlers for hexagons
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const wasDragged = useRef(false);

  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    wasDragged.current = false;
    setDragState({ key, offsetX: 0, offsetY: 0 });
    setDragOffset({ x: 0, y: 0 });
  };

  const handleLogoClick = () => {
    // Only scroll if it wasn't a drag
    if (!wasDragged.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!dragState || !dragStartPos.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartPos.current) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      // Mark as dragged if moved more than 5px
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        wasDragged.current = true;
      }
      setDragOffset({ x: dx, y: dy });
    };

    const handleMouseUp = () => {
      setDragState(null);
      setDragOffset({ x: 0, y: 0 });
      dragStartPos.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState]);

  return (
    <main
      className={styles.root}
      ref={rootRef}
      style={initialDimensions ? { minHeight: initialDimensions.height } : undefined}
    >
      <div
        className={`${styles.gridContainer} ${styles[phase]}`}
        style={initialDimensions && phase !== "loading" ? {
          left: initialDimensions.width / 2,
          top: initialDimensions.height / 2,
        } : undefined}
      >
        {hexagons.map(({ row, col, color, isLogo, position, delay }) => {
          const hexTransform = getHexTransform(position);
          const hexKey = `${row}-${col}`;
          const isDragging = dragState?.key === hexKey;
          return (
          <div
            key={hexKey}
            data-hex-key={hexKey}
            draggable={false}
            className={`
              ${styles.hexagon}
              ${isLogo ? styles.logoHex : ""}
              ${position === "right" ? styles.rightHex : ""}
              ${position === "left" ? styles.leftHex : ""}
              ${row % 2 === 1 ? styles.oddRow : ""}
              ${isDragging ? styles.dragging : ""}
            `}
            ref={isLogo ? logoRef : undefined}
            onMouseDown={(e) => handleMouseDown(e, hexKey)}
            onMouseUp={isLogo ? handleLogoClick : undefined}
            onDragStart={(e) => e.preventDefault()}
            style={{
              "--row": row,
              "--col": col,
              "--delay": `${delay}s`,
              "--hex-color": color,
              ...(hexTransform && { transform: hexTransform }),
            } as React.CSSProperties}
          >
            {!isLogo && (
              <div
                className={styles.hexDragWrapper}
                style={{ transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'translate(0, 0)' }}
              >
                <svg viewBox="0 0 468 540" className={styles.hexSvg}>
                  <path
                    d="M273 22
                       L427 112
                       Q468 135 468 180
                       L468 360
                       Q468 405 427 428
                       L273 518
                       Q234 540 195 518
                       L41 428
                       Q0 405 0 360
                       L0 180
                       Q0 135 41 112
                       L195 22
                       Q234 0 273 22
                       Z"
                    fill={color}
                  />
                </svg>
              </div>
            )}
            {isLogo && (
              <div style={{ transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'translate(0, 0)', transition: isDragging ? 'none' : 'transform 0.4s ease-out' }}>
                <svg viewBox="0 0 468 540" className={`${styles.hexSvg} ${styles.logoHexSvg}`}>
                  <path
                    d="M273 22
                       L427 112
                       Q468 135 468 180
                       L468 360
                       Q468 405 427 428
                       L273 518
                       Q234 540 195 518
                       L41 428
                       Q0 405 0 360
                       L0 180
                       Q0 135 41 112
                       L195 22
                       Q234 0 273 22
                       Z"
                    fill={color}
                  />
                </svg>
                <img src={butteryaiLogo} alt="ButteryAI" className={styles.logo} />
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Text content - appears after transition */}
      <div className={`${styles.textSection} ${styles[phase]}`}>
        <h1 className={styles.title}>Buttery AI</h1>
        <h2 className={styles.subtitle}>Buttery Smooth AI Development</h2>
        <p className={styles.description}>
          Build unbelievable AI and the tech stack like never before with everything you need, like enterprise-grade
          security, workflows, and governance.
        </p>
      </div>

      {/* Start button - stays fixed, repositions to footer when in view */}
      <button
        ref={startButtonRef}
        className={`${styles.startButton} ${styles[phase]} ${buttonInFooter ? styles.inFooter : ''}`}
        style={buttonInFooter ? buttonFooterStyle : undefined}
        onClick={() => navigate("/waiting-list")}
      >
        Start
      </button>
    </main>
  );
};

export default HomeHero;
