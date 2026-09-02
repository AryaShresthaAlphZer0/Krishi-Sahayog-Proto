import styles from "./MascotFace.module.css";


// mood: "happy" | "wink" | "excited" | "ouch" | "angry" | "cheer"

export function MascotFace({ size = 96, mood = "happy" }) {

  const hurt = mood === "ouch";
  const angry = mood === "angry";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Pip the Krishi Sahayog mascot"
      className={styles.face}
    >

      {/* leaf sprout */}
      <path
        d="M60 22c0-10 8-16 16-16 0 9-6 16-16 16z"
        fill="var(--primary)"
        opacity="0.85"
      />
      <path d="M60 24c0-7-5-12-12-12 0 7 5 12 12 12z" fill="var(--primary)" />
      <rect x="58" y="20" width="4" height="14" rx="2" fill="var(--primary)" />

      {/* body */}
      <ellipse cx="60" cy="70" rx="42" ry="38" fill="var(--chip-bg)" />
      <ellipse cx="60" cy="66" rx="34" ry="30" fill="var(--surface)" opacity="0.55" />

      {/* cheeks */}
      <ellipse
        cx="34"
        cy="76"
        rx="8"
        ry="5"
        fill="var(--accent)"
        opacity={hurt ? 0.9 : 0.55}
      />
      <ellipse
        cx="86"
        cy="76"
        rx="8"
        ry="5"
        fill="var(--accent)"
        opacity={hurt ? 0.9 : 0.55}
      />

      {/* eyes */}
      {hurt ? (
        <g
          stroke="var(--text-dark)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M41 58l10 10M51 58l-10 10" />
          <path d="M68 58l10 10M78 58l-10 10" />
        </g>
      ) : (
        <g className={styles.blink}>
          {angry && (
            <g stroke="var(--text-dark)" strokeWidth="3.5" strokeLinecap="round">
              <path d="M39 52l13 5" />
              <path d="M81 52l-13 5" />
            </g>
          )}
          <ellipse cx="46" cy="63" rx="6" ry={mood === "cheer" ? 5 : 7.5} fill="var(--text-dark)" />
          {mood === "wink" ? (
            <path
              d="M68 63c2-3 8-3 10 0"
              stroke="var(--text-dark)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <ellipse cx="73" cy="63" rx="6" ry={mood === "cheer" ? 5 : 7.5} fill="var(--text-dark)" />
          )}
          <circle cx="48" cy="60" r="2.2" fill="var(--surface)" />
          {mood !== "wink" && <circle cx="75" cy="60" r="2.2" fill="var(--surface)" />}
        </g>
      )}

      {/* mouth */}
      {mood === "excited" || mood === "cheer" || hurt ? (
        <ellipse
          cx="60"
          cy={hurt ? 84 : 80}
          rx={hurt ? 6 : 7}
          ry={hurt ? 6 : 8}
          fill="var(--text-dark)"
          opacity="0.85"
        />
      ) : angry ? (
        <path
          d="M50 82c4-6 16-6 20 0"
          stroke="var(--text-dark)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M52 79c3 5 13 5 16 0"
          stroke="var(--text-dark)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* feet */}
      <ellipse cx="46" cy="106" rx="9" ry="5" fill="var(--primary)" opacity="0.8" />
      <ellipse cx="74" cy="106" rx="9" ry="5" fill="var(--primary)" opacity="0.8" />

    </svg>
  );
}