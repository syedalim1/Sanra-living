"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { useCart } from "@/app/context/CartContext";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── HELPERS ─────────────────────────────────────────────────── */
const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const COD_ADVANCE = (subtotal: number) => (subtotal > 5000 ? 299 : 149);
const SHIPPING = 0; // free prepaid; applied at checkout

export default function CartPage() {
    const { items, subtotal, dispatch } = useCart();

    const router = useRouter();
    const [codSelected] = useState(false);

    const codAdvance = codSelected ? COD_ADVANCE(subtotal) : 0;
    const totalPayable = subtotal + codAdvance + SHIPPING;

    /* ── EMPTY STATE ─────────────────────────────────────────── */
    if (items.length === 0) {
        return (
            <main style={{ background: "#F5F5F5", minHeight: "100vh" }}>
                <SiteHeader />
                <section style={{ background: "#fff", padding: "clamp(5rem,12vw,9rem) 1.5rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 480, margin: "0 auto" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🛒</div>
                        <h1 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 900, color: "#111", fontFamily: FM, marginBottom: "1rem" }}>
                            Your Cart is Empty
                        </h1>
                        <p style={{ fontSize: "0.9375rem", color: "#666", fontFamily: FO, lineHeight: 1.8, marginBottom: "2.5rem" }}>
                            Looks like you haven&apos;t added anything yet.
                            Browse our collection and find the perfect piece.
                        </p>
                        <Link href="/shop" style={{
                            display: "inline-block", padding: "1rem 2.75rem",
                            background: "#1C1C1C", color: "#fff", fontWeight: 700,
                            fontSize: "0.78rem", letterSpacing: "0.14em",
                            textTransform: "uppercase", textDecoration: "none", fontFamily: FM,
                        }}>
                            Browse Collection
                        </Link>
                    </div>
                </section>
                <SiteFooter />
            </main>
        );
    }

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── PAGE TITLE ─────────────────────────────────────── */}
            <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "2.5rem 1.5rem" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "0.5rem" }}>
                        Review Order
                    </p>
                    <h1 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 900, color: "#111", fontFamily: FM, letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
                        Your Cart
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "#888", fontFamily: FO }}>
                        Review your items before proceeding to checkout.
                    </p>
                </div>
            </section>

            {/* ── MAIN GRID ──────────────────────────────────────── */}
            <section style={{ padding: "clamp(2rem,5vw,3.5rem) 1.5rem" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
                    className="sl-cart-grid">

                    {/* ── ITEMS LIST ───────────────────────────────── */}
                    <div>
                        {items.map((item, idx) => {
                            const stockLow = item.stockQty <= 5;
                            const itemSubtotal = item.price * item.qty;
                            return (
                                <div key={`${item.id}-${item.finish}`}>
                                    <div style={{
                                        background: "#fff",
                                        padding: "1.5rem",
                                        display: "flex",
                                        gap: "1.25rem",
                                        alignItems: "flex-start",
                                        flexWrap: "wrap",
                                    }}>
                                        {/* Image */}
                                        <Link href={`/shop/${item.id}`}>
                                            <div style={{ width: 100, height: 100, background: "#F2F2F0", flexShrink: 0, overflow: "hidden" }}>
                                                <img src={item.image} alt={item.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                            </div>
                                        </Link>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                            <Link href={`/shop/${item.id}`} style={{ textDecoration: "none" }}>
                                                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{item.title}</p>
                                            </Link>
                                            <p style={{ fontSize: "0.82rem", color: "#777", fontFamily: FO }}>{item.subtitle}</p>
                                            <span style={{
                                                display: "inline-block", fontSize: "0.68rem", fontWeight: 700,
                                                letterSpacing: "0.08em", color: "#555", fontFamily: FM,
                                                background: "#F0F0F0", padding: "0.2rem 0.6rem",
                                                textTransform: "uppercase", alignSelf: "flex-start",
                                            }}>
                                                {item.finish}
                                            </span>
                                            {stockLow && (
                                                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#b04000", fontFamily: FM }}>
                                                    ⚠ Only {item.stockQty} left
                                                </p>
                                            )}
                                        </div>

                                        {/* Price + Qty + Subtotal */}
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem", marginLeft: "auto" }}>
                                            <p style={{ fontSize: "0.82rem", color: "#888", fontFamily: FO }}>
                                                {fmt(item.price)} × {item.qty}
                                            </p>

                                            {/* Qty stepper */}
                                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E0E0E0" }}>
                                                <button
                                                    onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, finish: item.finish, qty: item.qty - 1 } })}
                                                    style={{ width: 36, height: 36, background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#111" }}>−</button>
                                                <span style={{ width: 36, textAlign: "center", fontWeight: 700, fontSize: "0.9rem", color: "#111", fontFamily: FM }}>{item.qty}</span>
                                                <button
                                                    onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, finish: item.finish, qty: item.qty + 1 } })}
                                                    style={{ width: 36, height: 36, background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#111" }}>+</button>
                                            </div>

                                            <p style={{ fontSize: "1rem", fontWeight: 800, color: "#111", fontFamily: FM }}>{fmt(itemSubtotal)}</p>

                                            {/* Remove */}
                                            <button
                                                onClick={() => dispatch({ type: "REMOVE", payload: { id: item.id, finish: item.finish } })}
                                                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#999", fontFamily: FO, padding: 0, textDecoration: "underline" }}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    {idx < items.length - 1 && <div style={{ height: 1, background: "#E6E6E6" }} />}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── ORDER SUMMARY ─────────────────────────────── */}
                    <div className="sl-summary-col">
                        <div style={{ background: "#fff", border: "1px solid #E6E6E6", padding: "1.75rem" }}>
                            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.25rem" }}>
                                Order Summary
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                                <Row label="Subtotal" value={fmt(subtotal)} />
                                <Row label="Shipping" value="Free (Prepaid)" muted />
                                {codSelected && <Row label={`COD Advance`} value={fmt(codAdvance)} />}
                            </div>

                            <div style={{ height: 1, background: "#E6E6E6", margin: "1.25rem 0" }} />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM }}>Total Payable Now</p>
                                <p style={{ fontSize: "1.25rem", fontWeight: 900, color: "#111", fontFamily: FM }}>{fmt(totalPayable)}</p>
                            </div>

                            {codSelected && (
                                <p style={{ fontSize: "0.75rem", color: "#777", fontFamily: FO, marginTop: "0.5rem", lineHeight: 1.6 }}>
                                    Remaining amount payable at delivery.
                                </p>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.75rem" }}>
                                <button
                                    onClick={() => router.push("/checkout")}
                                    style={{
                                        width: "100%", padding: "1rem",
                                        background: "#1C1C1C", color: "#fff",
                                        fontWeight: 700, fontSize: "0.8rem",
                                        letterSpacing: "0.12em", textTransform: "uppercase",
                                        border: "none", cursor: "pointer", fontFamily: FM,
                                        transition: "background 0.2s",
                                    }}>
                                    Proceed to Checkout
                                </button>
                                <Link href="/shop" style={{
                                    display: "block", textAlign: "center",
                                    padding: "0.875rem",
                                    color: "#1C1C1C", fontWeight: 700,
                                    fontSize: "0.78rem", letterSpacing: "0.1em",
                                    textTransform: "uppercase", border: "2px solid #1C1C1C",
                                    textDecoration: "none", fontFamily: FM,
                                    transition: "background 0.2s",
                                }}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Trust note */}
                        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {["Secure Checkout", "10 Year Structural Warranty", "Free Shipping on Prepaid Orders"].map((t) => (
                                <p key={t} style={{ fontSize: "0.78rem", color: "#888", fontFamily: FO }}>✓ {t}</p>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <SiteFooter />

            {/* ── MOBILE STICKY CHECKOUT ───────────────────────────── */}
            <div className="sl-sticky-checkout" style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "#fff", borderTop: "1px solid #E6E6E6",
                padding: "0.875rem 1.25rem",
                alignItems: "center", gap: "0.75rem",
                zIndex: 50,
            }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.68rem", color: "#888", fontFamily: FM }}>Total</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111", fontFamily: FM }}>{fmt(totalPayable)}</p>
                </div>
                <button
                    onClick={() => router.push("/checkout")}
                    style={{
                        flex: 2, background: "#1C1C1C", color: "#fff",
                        fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em",
                        textTransform: "uppercase", border: "none", cursor: "pointer",
                        padding: "0.875rem", fontFamily: FM,
                    }}>
                    Checkout
                </button>
            </div>

            <style>{`
                @media (min-width: 860px) {
                    .sl-cart-grid {
                        grid-template-columns: 1fr 360px !important;
                    }
                }
                .sl-summary-col {
                    position: sticky;
                    top: 80px;
                    align-self: start;
                }
                @media (max-width: 859px) {
                    .sl-sticky-checkout { display: flex !important; }
                }
            `}</style>
        </main>
    );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "0.84rem", color: muted ? "#aaa" : "#555", fontFamily: FO }}>{label}</p>
            <p style={{ fontSize: "0.84rem", fontWeight: 600, color: muted ? "#aaa" : "#111", fontFamily: FM }}>{value}</p>
        </div>
    );
}
