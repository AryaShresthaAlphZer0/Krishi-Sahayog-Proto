import { useCart } from "../context/useCart";
import { useToast } from "../context/useToast";

import styles from "./ProductCard.module.css";


export default function ProductCard({ product, changePercent, onView }) {

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isUp = changePercent >= 0;

  function handleQuickAdd(event) {

    event.stopPropagation();

    addToCart(product, 1);

    showToast(`Added ${product.name} to cart`, "success", 2200);
  }


  return (
    <div className={styles.card} onClick={() => onView(product)}>

      <div className={styles.topRow}>

        <div className={styles.iconWrap}>
          <span className={styles.icon}>{product.icon}</span>
        </div>

        <span
          className={[
            styles.changeBadge,
            isUp ? styles.changeUp : styles.changeDown,
          ].join(" ")}
        >
          {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(1)}%
        </span>

      </div>

      <h3 className={styles.name}>
        {product.name}
      </h3>

      <span className={styles.seller}>
        {product.seller}
      </span>

      <div className={styles.priceRow}>

        <div>
          <span className={styles.price}>
            Rs {product.basePrice.toLocaleString()}
          </span>
          <span className={styles.unit}>
            {" "}{product.unit}
          </span>
        </div>

      </div>

      <div className={styles.actions}>

        <button
          type="button"
          className={styles.viewBtn}
          onClick={() => onView(product)}
        >
          View
        </button>

        <button
          type="button"
          className={styles.addBtn}
          onClick={handleQuickAdd}
        >
          + Cart
        </button>

      </div>

    </div>
  );
}