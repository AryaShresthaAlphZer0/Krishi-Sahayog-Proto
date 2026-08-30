import { useMemo, useState } from "react";

import MARKETPLACE_PRODUCTS from "../data/marketplaceProducts";
import { getStableChangePercent } from "../utils/priceSimulator";
import { useCart } from "../context/useCart";

import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import SellProductModal from "../components/SellProductModal";

import styles from "./MarketplacePage.module.css";


const CATEGORIES = [
  { value: "all", label: "All", icon: "🛍️" },
  { value: "seeds", label: "Seeds", icon: "🌱" },
  { value: "equipment", label: "Equipment", icon: "🚜" },
  { value: "medicine", label: "Medicine", icon: "🧪" },
];


export default function MarketplacePage() {

  const { totalItems, openCart } = useCart();

  const [products, setProducts] = useState(MARKETPLACE_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingProduct, setViewingProduct] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);


  const filteredProducts = useMemo(() => {

    return products.filter((product) => {

      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

  }, [products, activeCategory, searchQuery]);


  function handleNewListing(newProduct) {

    setProducts((current) => [newProduct, ...current]);
  }


  return (
    <div className={styles.page}>

      <div className={styles.wrapper}>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className={styles.header}>

          <span className={styles.eyebrow}>
            Krishi Bazaar
          </span>

          <h1 className={styles.title}>
            Marketplace
          </h1>

          <p className={styles.subtitle}>
            Buy and sell seeds, equipment, and crop medicine —
            with a live view of how prices are moving.
          </p>

        </div>


        {/* =====================================================
            CONTROLS
        ===================================================== */}

        <div className={styles.controls}>

          <div className={styles.tabRow}>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={[
                  styles.tab,
                  activeCategory === cat.value ? styles.tabActive : "",
                ].join(" ")}
                onClick={() => setActiveCategory(cat.value)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}

          </div>

          <div className={styles.rightControls}>

            <input
              type="text"
              className={styles.search}
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              type="button"
              className={styles.sellBtn}
              onClick={() => setShowSellModal(true)}
            >
              + Sell a Product
            </button>

            <button
              type="button"
              className={styles.cartBtn}
              onClick={openCart}
            >
              🛒
              {totalItems > 0 && (
                <span className={styles.cartBadge}>
                  {totalItems}
                </span>
              )}
            </button>

          </div>

        </div>


        {/* =====================================================
            PRODUCT GRID
        ===================================================== */}

        {filteredProducts.length === 0 && (

          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>No products match your search.</p>
          </div>
        )}

        <div className={styles.grid}>

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              changePercent={getStableChangePercent(product.id)}
              onView={setViewingProduct}
            />
          ))}

        </div>

      </div>


      {/* =====================================================
          MODALS
      ===================================================== */}

      {viewingProduct && (
        <ProductDetailModal
          key={viewingProduct.id}
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {showSellModal && (
        <SellProductModal
          onClose={() => setShowSellModal(false)}
          onSubmit={handleNewListing}
        />
      )}

    </div>
  );
}