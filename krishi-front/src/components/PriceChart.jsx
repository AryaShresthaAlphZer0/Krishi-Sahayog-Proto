import { useMemo } from "react";

import styles from "./PriceChart.module.css";


const WIDTH = 480;
const HEIGHT = 180;
const PADDING_Y = 18;


export default function PriceChart({ data, positive }) {

  const { linePath, areaPath, points } = useMemo(() => {

    if (!data || data.length < 2) {
      return { linePath: "", areaPath: "", points: [] };
    }

    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const stepX = WIDTH / (data.length - 1);

    const coords = data.map((d, i) => {

      const x = i * stepX;

      const y =
        HEIGHT -
        PADDING_Y -
        ((d.price - min) / range) * (HEIGHT - PADDING_Y * 2);

      return { x, y, price: d.price };
    });

    const line = coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(" ");

    const area =
      `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${HEIGHT} ` +
      `L ${coords[0].x.toFixed(1)} ${HEIGHT} Z`;

    return { linePath: line, areaPath: area, points: coords };

  }, [data]);


  if (!points.length) {
    return null;
  }

  const lastPoint = points[points.length - 1];

  const strokeColor = positive
    ? "var(--primary-light)"
    : "var(--danger)";

  const gradientId = positive ? "priceGradientUp" : "priceGradientDown";


  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={styles.chart}
      preserveAspectRatio="none"
    >

      <defs>
        <linearGradient id="priceGradientUp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary-light)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary-light)" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="priceGradientDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--danger)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--danger)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={areaPath}
        fill={`url(#${gradientId})`}
        className={styles.area}
      />

      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.line}
      />

      {/* live point with pulse */}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="8"
        fill={strokeColor}
        opacity="0.25"
        className={styles.pulse}
      />

      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="4"
        fill={strokeColor}
      />

    </svg>
  );
}