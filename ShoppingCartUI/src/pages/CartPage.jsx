import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../cart/useCart"; // adjust if your path differs
import styles from "./CartPage.module.css";

function QtyButton({ children, onClick, label }) {
  return (
    <button
      type="button"
      className={styles.qtyBtn}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export default function CartPage() {
  const { items, totals, increment, decrement, removeFromCart } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.subtitle}>
            Items: <strong>{totals.count}</strong> · Total:{" "}
            <strong>₱{totals.total.toFixed(2)}</strong>
          </p>
        </div>

        <div className={styles.topbarActions}>
          <Link className={styles.link} to="/">
            Continue shopping
          </Link>
        </div>
      </header>

      {isEmpty ? (
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>Cart is empty</h2>
          <p className={styles.emptyText}>
            Add items from the products page to see them here.
          </p>
          <Link className={styles.primaryBtn} to="/">
            Browse products
          </Link>
        </div>
      ) : (
        <div className={styles.layout}>
          {/* Items */}
          <section className={styles.items} aria-label="Cart items">
            {items.map(({ product, qty }) => (
              <article key={product.id} className={styles.itemCard}>
                <img
                  className={styles.thumb}
                  src={product.imageUrl}
                  alt={product.name}
                  loading="lazy"
                />

                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle} title={product.name}>
                    {product.name}
                  </h3>
                  <p className={styles.itemDesc}>{product.description}</p>

                  <div className={styles.itemMeta}>
                    <span className={styles.itemPrice}>
                      ₱{Number(product.price).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      className={styles.removeLink}
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className={styles.qtyBox}>
                  <QtyButton
                    onClick={() => decrement(product.id)}
                    label={`Decrease quantity of ${product.name}`}
                  >
                    -
                  </QtyButton>
                  <span className={styles.qty} aria-label="Quantity">
                    {qty}
                  </span>
                  <QtyButton
                    onClick={() => increment(product.id)}
                    label={`Increase quantity of ${product.name}`}
                  >
                    +
                  </QtyButton>

                  <div className={styles.lineTotal}>
                    ₱{(qty * Number(product.price)).toFixed(2)}
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Summary */}
          <aside className={styles.summary} aria-label="Order summary">
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryRow}>
                <span>Items</span>
                <strong>{totals.count}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>₱{totals.total.toFixed(2)}</strong>
              </div>

              <div className={styles.divider} />

              <div className={styles.summaryRowBig}>
                <span>Total</span>
                <strong>₱{totals.total.toFixed(2)}</strong>
              </div>

              <Link className={styles.primaryBtn} to="/checkout">
                Proceed to Checkout
              </Link>

              <p className={styles.smallNote}>
                Shipping/payment steps can be added next.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
