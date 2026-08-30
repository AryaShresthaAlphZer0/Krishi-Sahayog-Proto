import { useState } from "react";

import { useToast } from "../context/useToast";

import styles from "./SellProductModal.module.css";


const CATEGORY_OPTIONS = [
  { value: "seeds", label: "🌱 Seeds" },
  { value: "equipment", label: "🚜 Equipment" },
  { value: "medicine", label: "🧪 Medicine" },
];


export default function SellProductModal({ onClose, onSubmit }) {

  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("seeds");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [seller, setSeller] = useState("");


  function handleSubmit(event) {

    event.preventDefault();

    const priceValue = parseFloat(price);

    if (!name.trim() || !unit.trim() || Number.isNaN(priceValue)) {
      showToast(
        "Please fill in the product name, price, and unit.",
        "error"
      );
      return;
    }

    const newProduct = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      unit: unit.trim(),
      basePrice: priceValue,
      icon: category === "seeds" ? "🌱" : category === "equipment" ? "🛠️" : "🧪",
      seller: seller.trim() || "You",
      description: description.trim() || "No description provided.",
    };

    onSubmit(newProduct);

    showToast(
      `${newProduct.name} listed on the marketplace!`,
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

        <h2 className={styles.title}>
          List a product to sell
        </h2>

        <p className={styles.subtitle}>
          This adds your listing to the marketplace for this
          session. (Not yet saved to an account — that's coming
          once the backend is connected.)
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <label htmlFor="sell-name">Product name</label>
            <input
              id="sell-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Improved Maize Seed"
              required
            />
          </div>

          <div className={styles.fieldRow}>

            <div className={styles.field}>
              <label htmlFor="sell-category">Category</label>
              <select
                id="sell-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="sell-price">Price (Rs)</label>
              <input
                id="sell-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 250"
                required
              />
            </div>

          </div>

          <div className={styles.fieldRow}>

            <div className={styles.field}>
              <label htmlFor="sell-unit">Unit</label>
              <input
                id="sell-unit"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. per kg"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="sell-seller">Seller / farm name</label>
              <input
                id="sell-seller"
                type="text"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                placeholder="Optional"
              />
            </div>

          </div>

          <div className={styles.field}>
            <label htmlFor="sell-description">Description</label>
            <textarea
              id="sell-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the product…"
              rows={3}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            List Product
          </button>

        </form>

      </div>

    </div>
  );
}