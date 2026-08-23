import { useEffect, useState } from "react";

import styles from "./Toast.module.css";


const TYPE_CONFIG = {
  success: { fill: "#3f9d5f", icon: "✅" },
  error: { fill: "#c96b3f", icon: "⚠️" },
  info: { fill: "#2e7d32", icon: "🌿" },
};


export default function Toast({
  message,
  type = "info",
  duration = 3800,
  onDone,
}) {

  const [leaving, setLeaving] = useState(false);

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;


  // Start the exit animation after `duration`
  useEffect(() => {

    const showTimer = setTimeout(() => {
      setLeaving(true);
    }, duration);

    return () => clearTimeout(showTimer);

  }, [duration]);


  // Actually remove the toast once the fly-out animation
  // has had time to finish (~550ms, see Toast.module.css)
  useEffect(() => {

    if (!leaving) {
      return;
    }

    const removeTimer = setTimeout(onDone, 550);

    return () => clearTimeout(removeTimer);

  }, [leaving, onDone]);


  return (
    <div
      className={[
        styles.toast,
        leaving ? styles.leaving : "",
      ].join(" ")}
      onClick={() => setLeaving(true)}
      role="status"
    >

      <svg
        viewBox="0 0 340 140"
        className={styles.leafShape}
        preserveAspectRatio="none"
        aria-hidden="true"
      >

        {/* small stem nub */}
        <path
          d="M2,70 L16,60 L16,80 Z"
          fill={config.fill}
        />

        {/* leaf body */}
        <path
          d="M170,6
             C 255,6 336,36 336,70
             C 336,104 255,134 170,134
             C 85,134 8,104 8,70
             C 8,36 85,6 170,6 Z"
          fill={config.fill}
        />

        {/* center vein */}
        <path
          d="M22,70 C 100,54 260,54 322,70"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="2"
          fill="none"
        />

      </svg>

      <div className={styles.content}>

        <span className={styles.icon}>
          {config.icon}
        </span>

        <span className={styles.message}>
          {message}
        </span>

      </div>

    </div>
  );
}