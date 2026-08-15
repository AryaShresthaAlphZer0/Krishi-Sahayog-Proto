import styles from "./PlantAnimation.module.css";

export default function PlantAnimation() {
  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.svg}
        viewBox="0 0 300 340"
        role="img"
        aria-label="Animation of a seed growing into a flowering plant"
      >
        <circle className={styles.glow} cx="150" cy="90" r="80" />

        <g className={styles.sway}>
          {/* stem */}
          <path className={styles.stem} d="M150 300 C 150 240, 140 200, 150 150 C 156 120, 150 105, 150 92" />

          {/* leaves */}
          <path
            className={styles.leafLeft}
            d="M147 230 C 110 228, 88 208, 84 182 C 118 178, 142 196, 147 230 Z"
          />
          <path
            className={styles.leafRight}
            d="M151 190 C 188 188, 212 168, 216 142 C 182 138, 156 156, 151 190 Z"
          />

          {/* bud / flower */}
          <ellipse className={styles.bud} cx="150" cy="96" rx="13" ry="20" />
          <g>
            <ellipse className={`${styles.petal} ${styles.p1}`} cx="150" cy="66" rx="13" ry="21" />
            <ellipse className={`${styles.petal} ${styles.p2}`} cx="177" cy="83" rx="13" ry="21" transform="rotate(72 177 83)" />
            <ellipse className={`${styles.petal} ${styles.p3}`} cx="167" cy="113" rx="13" ry="21" transform="rotate(144 167 113)" />
            <ellipse className={`${styles.petal} ${styles.p4}`} cx="133" cy="113" rx="13" ry="21" transform="rotate(216 133 113)" />
            <ellipse className={`${styles.petal} ${styles.p5}`} cx="123" cy="83" rx="13" ry="21" transform="rotate(288 123 83)" />
            <circle className={styles.core} cx="150" cy="90" r="12" />
          </g>
        </g>

        {/* seed + soil */}
        <circle className={styles.seed} cx="150" cy="298" r="8" />
        <ellipse className={styles.soilShade} cx="150" cy="304" rx="112" ry="18" />
        <ellipse className={styles.soil} cx="150" cy="312" rx="112" ry="18" />
      </svg>
    </div>
  );
}
