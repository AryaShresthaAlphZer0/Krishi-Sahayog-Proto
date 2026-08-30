import { useEffect, useState } from "react";

import { useCart } from "../context/useCart";
import { useToast } from "../context/useToast";
import PriceChart from "./PriceChart";
import { generatePriceHistory, nextPricePoint } from "../utils/priceSimulator";

import styles from "./ProductDetailModal.module.css";


export default function ProductDetailModal({ product, onClose }) {

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [history, setHistory] = useState(() =>
    generatePriceHistory(product.basePrice)
  );

  const [quantity, setQuantity] = useState(1);


  // Simulated live tick
  useEffect(() => {

    const interval = setInterval(() => {

      setHistory((current) => {

        const last = current[current.length - 1];

        const next = nextPricePoint(
          last,
          product.basePrice,
          last.time + 1
        );

        return [...current.slice(1), next];
      });

    }, 2000);

    return () => clearInterval(interval);

  }, [product.basePrice]);


  // Close on Escape
  useEffect(() => {

    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);

  }, [onClose]);


  const currentPrice = history[history.length - 1]?.price ?? product.basePrice;
  const firstPrice = history[0]?.price ?? product.basePrice;
  const changePercent =
    ((currentPrice - firstPrice) / firstPrice) * 100;
  const isUp = changePercent >= 0;


  function handleAddToCart() {

    addToCart(product, quantity);

    showToast(
      `Added ${quantity} × ${product.name} to cart`,
      "success"
    );

    onClose();
  }


  return (
    <div className={styles.overlay} onClick={onClose}>

      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className={styles.header}>

          <div className={styles.iconWrap}>
            <span className={styles.icon}>{product.icon}</span>
          </div>

          <div>
            <span className={styles.category}>
              {product.category}
            </span>

            <h2 className={styles.name}>
              {product.name}
            </h2>

            <span className={styles.seller}>
              Sold by {product.seller}
            </span>
          </div>

        </div>

        <p className={styles.description}>
          {product.description}
        </p>

        <div className={styles.chartSection}>

          <div className={styles.chartHeader}>

            <div>
              <span className={styles.livePrice}>
                Rs {currentPrice.toLocaleString()}
              </span>
              <span className={styles.unitLabel}>
                {" "}{product.unit}
              </span>
            </div>

            <span
              className={[
                styles.changeTag,
                isUp ? styles.up : styles.down,
              ].join(" ")}
            >
              {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
            </span>

          </div>

          <PriceChart data={history} positive={isUp} />

          <span className={styles.liveLabel}>
            <span className={styles.liveDot} />
            Live simulated price — updates every few seconds
          </span>

        </div>

        <div className={styles.purchaseRow}>

          <div className={styles.qtyControl}>

            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>

          </div>

          <button
            type="button"
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
          >
            Add to Cart — Rs {(currentPrice * quantity).toLocaleString()}
          </button>

        </div>

      </div>

    </div>
  );
}