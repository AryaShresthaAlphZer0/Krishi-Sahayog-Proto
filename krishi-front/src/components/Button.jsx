import { Link } from "react-router-dom";
import styles from "./Button.module.css";

export default function Button({
  variant = "primary",
  to,
  fullWidth = false,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.full : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}