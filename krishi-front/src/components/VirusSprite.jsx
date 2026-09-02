import styles from "./VirusSprite.module.css";


export function VirusSprite({ size = 60, hurt = false }) {

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Crop virus">

      <g className={styles.spin} style={{ transformOrigin: "50px 50px" }}>

        {Array.from({ length: 10 }).map((_, i) => {

          const a = (i / 10) * Math.PI * 2;

          return (
            <g key={i}>
              <line
                x1={50 + Math.cos(a) * 26}
                y1={50 + Math.sin(a) * 26}
                x2={50 + Math.cos(a) * 42}
                y2={50 + Math.sin(a) * 42}
                stroke="var(--danger)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle
                cx={50 + Math.cos(a) * 44}
                cy={50 + Math.sin(a) * 44}
                r="5"
                fill="var(--danger)"
              />
            </g>
          );
        })}

      </g>

      <circle cx="50" cy="50" r="28" fill="var(--danger)" opacity={hurt ? 0.55 : 1} />
      <circle cx="40" cy="44" r="5" fill="var(--surface)" />
      <circle cx="61" cy="44" r="5" fill="var(--surface)" />
      <circle cx="41" cy="45" r="2.4" fill="var(--text-dark)" />
      <circle cx="62" cy="45" r="2.4" fill="var(--text-dark)" />
      <path
        d="M40 64c4-5 14-5 19 0"
        stroke="var(--surface)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

    </svg>
  );
}