import styles from "./Card.module.css";

export default function Card({
  icon,
  title,
  description,
  number,
  label,
}) {
  return (
    <article className={styles.card}>

      {/* Top row */}
      <div className={styles.cardTop}>
        <span className={styles.cardNumber}>
          {number}
          <span className={styles.separator}>/</span>
          {label}
        </span>

        <div className={styles.cardIcon}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className={styles.cardContent}>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      {/* Arrow */}
      <span className={styles.cardArrow}>
        ↗
      </span>

      {/* Decorative circle */}
      <div className={styles.cardDecoration} />

    </article>
  );
}