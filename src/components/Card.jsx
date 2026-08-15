import styles from "./Card.module.css";

export default function Card({ icon, title, description, children, className = "" }) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(" ")}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.body}>{description}</p>}
      {children}
    </div>
  );
}
