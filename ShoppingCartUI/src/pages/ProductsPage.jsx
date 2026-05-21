import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api";
import { useCart } from "../cart/useCart"; // adjust if your hook path differs
import { setPageMeta } from "../seo";
import styles from "./ProductsPage.module.css";

function ProductCard({ product, onAdd, priority = false }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={product.imageUrl}
          alt={`${product.name} product photo`}
          width="800"
          height="800"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
        />
      </div>

      <div className={styles.cardBody}>
        <header className={styles.cardHeader}>
          <h3 className={styles.title} title={product.name}>
            {product.name}
          </h3>
          <p className={styles.price}>₱{Number(product.price).toFixed(2)}</p>
        </header>

        <p className={styles.description}>{product.description}</p>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const { addToCart, totals } = useCart();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    setPageMeta({
      title: "Products | C# React Shopping Cart Demo",
      description:
        "Browse electronics products in a portfolio-ready ASP.NET Core and React shopping cart demo.",
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setStatus("loading");
        setError("");
        const data = await fetchProducts();
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setStatus("success");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Failed to load products.");
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.subtitle}>Pick what you like and add it to your cart.</p>
        </div>

        <Link className={styles.cartLink} to="/cart">
          Cart <span className={styles.cartBadge}>{totals.count}</span>
        </Link>
      </header>

      {status === "loading" && (
        <div className={styles.stateBox} role="status" aria-live="polite">
          Loading products…
        </div>
      )}

      {status === "error" && (
        <div className={styles.stateBoxError} role="alert">
          {error}
        </div>
      )}

      {status === "success" && products.length === 0 && (
        <div className={styles.stateBox} role="status">
          No products available.
        </div>
      )}

      <section className={styles.grid} aria-label="Product list">
        {products.map((p, index) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={addToCart}
            priority={index === 0}
          />
        ))}
      </section>
    </main>
  );
}
