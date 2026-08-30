import { useCart } from "../context/useCart";
import { useToast } from "../context/useToast";

import styles from "./CartDrawer.module.css";


export default function CartDrawer() {

  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  const { showToast } = useToast();


  function handleCheckout() {

    showToast(
      "Checkout isn't connected yet — coming soon!",
      "info"
    );
  }


  return (
    <>
      <div
        className={[
          styles.backdrop,
          isOpen ? styles.backdropVisible : "",
        ].join(" ")}
        onClick={closeCart}
      />

      <aside
        className={[
          styles.drawer,
          isOpen ? styles.drawerOpen : "",
        ].join(" ")}
      >

        <div className={styles.header}>

          <h2 className={styles.title}>
            🛒 Your Cart
          </h2>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label="Close cart"
          >
            ✕
          </button>

        </div>

        {items.length === 0 && (

          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🌱</span>
            <p>Your cart is empty.</p>
          </div>
        )}

        {items.length > 0 && (

          <div className={styles.itemList}>

            {items.map((item) => (

              <div key={item.id} className={styles.item}>

                <span className={styles.itemIcon}>
                  {item.icon}
                </span>

                <div className={styles.itemInfo}>

                  <span className={styles.itemName}>
                    {item.name}
                  </span>

                  <span className={styles.itemPrice}>
                    Rs {item.price.toLocaleString()} {item.unit}
                  </span>

                  <div className={styles.qtyRow}>

                    <div className={styles.qtyControl}>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                    </div>

                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

        {items.length > 0 && (

          <div className={styles.footer}>

            <div className={styles.summaryRow}>
              <span>{totalItems} item{totalItems === 1 ? "" : "s"}</span>
              <span className={styles.total}>
                Rs {totalPrice.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={handleCheckout}
            >
              Checkout
            </button>

          </div>
        )}

      </aside>
    </>
  );
}