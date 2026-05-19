import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrder } from "../api";
import styles from "./ThankYouPage.module.css";

export default function ThankYouPage() {
    const { orderId } = useParams();
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [error, setError] = useState("");
    const [order, setOrder] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setStatus("loading");
                setError("");
                const data = await fetchOrder(orderId);
                if (!cancelled) {
                    setOrder(data);
                    setStatus("success");
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e?.message || "Failed to load order.");
                    setStatus("error");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [orderId]);

    const createdAtText = useMemo(() => {
        if (!order?.createdAt) return "";
        try {
            return new Date(order.createdAt).toLocaleString();
        } catch {
            return order.createdAt;
        }
    }, [order]);

    return (
        <div className={styles.page}>
            <header className={styles.topbar}>
                <div>
                    <h1 className={styles.title}>Thank you!</h1>
                    <p className={styles.subtitle}>
                        Your order has been sent for processing.
                    </p>
                </div>

                <div className={styles.actions}>
                    <Link className={styles.link} to="/">
                        Back to Products
                    </Link>
                </div>
            </header>

            {status === "loading" && (
                <div className={styles.stateBox} role="status" aria-live="polite">
                    Loading your order…
                </div>
            )}

            {status === "error" && (
                <div className={styles.stateBoxError} role="alert">
                    {error}
                    <div style={{ marginTop: 10 }}>
                        <Link className={styles.primaryBtn} to="/">
                            Go to Products
                        </Link>
                    </div>
                </div>
            )}

            {status === "success" && order && (
                <div className={styles.layout}>
                    {/* Left */}
                    <section className={styles.main}>
                        <div className={styles.heroCard}>
                            <div className={styles.heroTop}>
                                <div className={styles.badge}>Processing</div>
                                <div className={styles.orderId}>
                                    Order ID: <span>{order.id}</span>
                                </div>
                            </div>

                            <div className={styles.metaRow}>
                                <div>
                                    <div className={styles.metaLabel}>Placed</div>
                                    <div className={styles.metaValue}>{createdAtText || "—"}</div>
                                </div>
                                <div>
                                    <div className={styles.metaLabel}>Total</div>
                                    <div className={styles.metaValue}>
                                        ₱{Number(order.total ?? 0).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Items</h2>

                            <div className={styles.items}>
                                {order.lines?.map((line) => (
                                    <div key={`${line.productId}-${line.productName}`} className={styles.itemRow}>
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemName}>{line.productName}</div>
                                            <div className={styles.itemSub}>
                                                ₱{Number(line.unitPrice).toFixed(2)} × {line.qty}
                                            </div>
                                        </div>
                                        <div className={styles.itemTotal}>
                                            ₱{Number(line.lineTotal).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.summary}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <strong>₱{Number(order.subtotal ?? 0).toFixed(2)}</strong>
                                </div>
                                <div className={styles.summaryRowBig}>
                                    <span>Total</span>
                                    <strong>₱{Number(order.total ?? 0).toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right */}
                    <aside className={styles.side}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Customer</h2>

                            <div className={styles.kv}>
                                <div className={styles.k}>Name</div>
                                <div className={styles.v}>{order.customer?.name}</div>

                                <div className={styles.k}>Email</div>
                                <div className={styles.v}>{order.customer?.email}</div>

                                <div className={styles.k}>Phone</div>
                                <div className={styles.v}>{order.customer?.phone}</div>

                                <div className={styles.k}>Address</div>
                                <div className={styles.v}>{order.customer?.address}</div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Delivery Pin</h2>
                            <div className={styles.kv}>
                                <div className={styles.k}>Latitude</div>
                                <div className={styles.v}>{order.location?.lat}</div>

                                <div className={styles.k}>Longitude</div>
                                <div className={styles.v}>{order.location?.lng}</div>
                            </div>

                            <p className={styles.note}>
                                We’ll use this pin to help locate your delivery address.
                            </p>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
