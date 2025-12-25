import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useCart } from "../cart/useCart"; // adjust path if needed
import styles from "./CheckoutPage.module.css";
import { createOrder } from "../api";

const MAP_CONTAINER_STYLE = { width: "100%", height: "360px" };

export default function CheckoutPage() {
    const { items, totals, clearCart } = useCart();
    const navigate = useNavigate();

    const defaultCenter = useMemo(() => ({ lat: 14.5995, lng: 120.9842 }), []);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        location: defaultCenter, // {lat, lng}
    });
    const [touched, setTouched] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [placedOrder, setPlacedOrder] = useState(false);

    useEffect(() => {
        if (!placedOrder && items.length === 0) {
            navigate("/", { replace: true }); // products page
        }
    }, [items.length, placedOrder, navigate]);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-maps-script",
        googleMapsApiKey: apiKey,
    });

    function setField(key, value) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    function markTouched(key) {
        setTouched((p) => ({ ...p, [key]: true }));
    }

    const errors = useMemo(() => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required.";
        if (!form.email.trim()) {
            e.email = "Email address is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
        ) {
            e.email = "Enter a valid email address.";
        }
        if (!form.phone.trim()) e.phone = "Telephone is required.";
        else if (!/^[0-9+()\-\s]{7,}$/.test(form.phone.trim()))
            e.phone = "Enter a valid telephone number.";
        if (!form.address.trim()) e.address = "Address is required.";
        if (!form.location || typeof form.location.lat !== "number" || typeof form.location.lng !== "number")
            e.location = "Please set your location pin on the map.";
        return e;
    }, [form]);

    const hasErrors = Object.keys(errors).length > 0;

    function geocodeAddress(geocoder, address) {
        return new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                    resolve(results[0]);
                } else {
                    reject(status);
                }
            });
        });
    }

    function reverseGeocode(geocoder, location) {
        return new Promise((resolve, reject) => {
            geocoder.geocode({ location }, (results, status) => {
                if (status === "OK" && results[0]) {
                    resolve(results[0]);
                } else {
                    reject(status);
                }
            });
        });
    }

    async function updateFromLatLng(lat, lng) {
        setField("location", { lat, lng });

        if (!isLoaded) return;

        try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await reverseGeocode(geocoder, { lat, lng });

            setField("address", result.formatted_address);
        } catch {
            // ignore reverse-geocode errors
        }
    }

    function onMapClick(e) {
        updateFromLatLng(e.latLng.lat(), e.latLng.lng());
    }

    function onMarkerDragEnd(e) {
        updateFromLatLng(e.latLng.lat(), e.latLng.lng());
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        setSubmitError("");

        setTouched({ name: true, email: true, phone: true, address: true, location: true });

        if (items.length === 0) {
            navigate("/", { replace: true });
            return;
        }

        if (hasErrors) return;

        try {
            const payload = {
                customer: {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                },
                location: {
                    lat: form.location.lat,
                    lng: form.location.lng,
                },
                items: items.map((x) => ({
                    productId: x.product.id,
                    qty: x.qty,
                })),
            };

            const result = await createOrder(payload);
            setPlacedOrder(true);
            clearCart();
            console.log("createOrder result:", result);
            navigate(`/thank-you/${result.orderId}`, { replace: true });
        } catch (e) {
            setSubmitError(e?.message || "Failed to place order.");
        }
    }

    if (!apiKey) {
        return (
            <div className={styles.page}>
                <header className={styles.topbar}>
                    <h1 className={styles.title}>Checkout</h1>
                    <Link to="/cart" className={styles.link}>Back to Cart</Link>
                </header>

                <div className={styles.stateBoxError} role="alert">
                    Missing <code>VITE_GOOGLE_MAPS_API_KEY</code>. Add it to <code>.env</code> and restart Vite.
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.topbar}>
                <div>
                    <h1 className={styles.title}>Checkout</h1>
                    <p className={styles.subtitle}>
                        Items: <strong>{totals.count}</strong> · Total: <strong>₱{totals.total.toFixed(2)}</strong>
                    </p>
                </div>
                <Link to="/cart" className={styles.link}>Back to Cart</Link>
            </header>

            {submitError && (
                <div className={styles.stateBoxError} role="alert">
                    {submitError}
                </div>
            )}

            <form className={styles.form} onSubmit={onSubmit} noValidate>
                <div className={styles.grid}>
                    <label className={styles.field}>
                        <span className={styles.label}>Full Name</span>
                        <input
                            className={styles.input}
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            onBlur={() => markTouched("name")}
                            autoComplete="name"
                            placeholder="Pancake Baker"
                        />
                        {touched.name && errors.name && <span className={styles.error}>{errors.name}</span>}
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>Email Address</span>
                        <input
                            type="email"
                            className={styles.input}
                            value={form.email}
                            onChange={(e) => setField("email", e.target.value)}
                            onBlur={() => markTouched("email")}
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                        {touched.email && errors.email && (
                            <span className={styles.error}>{errors.email}</span>
                        )}
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>Telephone</span>
                        <input
                            className={styles.input}
                            value={form.phone}
                            onChange={(e) => setField("phone", e.target.value)}
                            onBlur={() => markTouched("phone")}
                            autoComplete="tel"
                            placeholder="+63 9xx xxx xxxx"
                        />
                        {touched.phone && errors.phone && <span className={styles.error}>{errors.phone}</span>}
                    </label>

                    <label className={styles.fieldFull}>
                        <span className={styles.label}>Address</span>
                        <textarea
                            className={styles.textarea}
                            value={form.address}
                            onChange={(e) => setField("address", e.target.value)}
                            onBlur={async () => {
                                markTouched("address");

                                if (!form.address.trim() || !isLoaded) return;

                                try {
                                    const geocoder = new window.google.maps.Geocoder();
                                    const result = await geocodeAddress(geocoder, form.address);

                                    const loc = result.geometry.location;
                                    setField("location", {
                                        lat: loc.lat(),
                                        lng: loc.lng(),
                                    });
                                } catch {
                                    // silently fail (bad address, partial address, etc.)
                                }
                            }}
                            placeholder="House/Unit, Street, Barangay, City, Province"
                        />
                        <div className={styles.hint}>
                            You can type your address or pin your location on the map.
                        </div>
                        {touched.address && errors.address && <span className={styles.error}>{errors.address}</span>}
                    </label>
                </div>

                <div className={styles.mapBlock}>
                    <div className={styles.mapHeader}>
                        <div>
                            <div className={styles.label}>Pin your location</div>
                            <div className={styles.hint}>Click the map to set the pin. Drag to adjust.</div>
                        </div>
                        <div className={styles.coords}>
                            {form.location?.lat?.toFixed(6)}, {form.location?.lng?.toFixed(6)}
                        </div>
                    </div>

                    {loadError && (
                        <div className={styles.stateBoxError} role="alert">
                            Failed to load Google Maps. Check your API key / billing / restrictions.
                        </div>
                    )}

                    {!loadError && !isLoaded ? (
                        <div style={{ padding: 14 }}>Loading map…</div>
                    ) : (
                        <GoogleMap
                            mapContainerStyle={MAP_CONTAINER_STYLE}
                            center={form.location || defaultCenter}
                            zoom={15}
                            onClick={onMapClick}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: true,
                            }}
                        >
                            {form.location && (
                                <MarkerF
                                    position={form.location}
                                    draggable
                                    onDragEnd={onMarkerDragEnd}
                                />
                            )}
                        </GoogleMap>
                    )}

                    {touched.location && errors.location && (
                        <div className={styles.error} style={{ marginTop: 8 }}>
                            {errors.location}
                        </div>
                    )}
                </div>

                <button className={styles.submit} type="submit" disabled={items.length === 0}>
                    Place Order
                </button>

                <p className={styles.note}>
                    (Next step: we can POST this checkout + cart to your .NET backend as an Order.)
                </p>
            </form>
        </div>
    );
}
