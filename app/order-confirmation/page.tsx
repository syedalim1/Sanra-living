"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* Estimate delivery: 5–8 working days from now */
function estimatedDelivery() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/* ── INNER (reads search params) ─────────────────────────────── */
function ConfirmationInner() {
    const params = useSearchParams();
    const orderId = params.get("orderId") ?? "SL-10234";
    const total = Number(params.get("total") ?? 2499);
    const codRemaining = Number(params.get("cod") ?? 0);

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(4rem,10vw,7rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>

                    {/* Animated check */}
                    <div style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: "#1C1C1C",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "2.25rem", color: "#fff",
                        animation: "sl-pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both",
                    }}>
                        ✓
                    </div>

                    <div>
                        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "0.75rem" }}>
                            Order Placed Successfully
                        </p>
                        <h1 style={{
                            fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, color: "#111",
                            fontFamily: FM, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "1rem",
                        }}>
                            Order Confirmed
                        </h1>
                        <p style={{ fontSize: "0.9375rem", color: "#666", fontFamily: FO, lineHeight: 1.8 }}>
                            Thank you for choosing SANRA LIVING.
                            Your order has been received and is being prepared.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── ORDER DETAILS CARD ────────────────────────────────── */}
            <section style={{ padding: "clamp(2rem,5vw,3.5rem) 1.5rem" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>

                    <div style={{ background: "#fff", border: "1px solid #E6E6E6" }}>
                        {/* Card header */}
                        <div style={{ background: "#1C1C1C", padding: "1.25rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                            <div>
                                <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontFamily: FM }}>Order ID</p>
                                <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", fontFamily: FM, letterSpacing: "0.05em" }}>{orderId}</p>
                            </div>
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, background: "#fff", color: "#1C1C1C", padding: "0.3rem 0.9rem", fontFamily: FM, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                Confirmed
                            </span>
                        </div>

                        {/* Details rows */}
                        <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: 0 }}>
                            {[
                                { label: "Amount Paid Now", value: fmt(total), bold: true },
                                ...(codRemaining > 0 ? [{ label: "Remaining COD Amount", value: fmt(codRemaining), note: "Payable at delivery" }] : []),
                                { label: "Estimated Delivery", value: estimatedDelivery() },
                                { label: "Payment Method", value: codRemaining > 0 ? "COD + Advance Paid" : "Prepaid (Online)" },
                            ].map(({ label, value, bold, note }) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", padding: "0.875rem 0", borderBottom: "1px solid #F0F0F0" }}>
                                    <div>
                                        <p style={{ fontSize: "0.82rem", color: "#888", fontFamily: FO }}>{label}</p>
                                        {note && <p style={{ fontSize: "0.72rem", color: "#aaa", fontFamily: FO }}>{note}</p>}
                                    </div>
                                    <p style={{ fontSize: bold ? "1.1rem" : "0.9rem", fontWeight: bold ? 800 : 600, color: "#111", fontFamily: FM, textAlign: "right" }}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── NEXT STEPS ───────────────────────────────────── */}
                    <div style={{ background: "#fff", border: "1px solid #E6E6E6", marginTop: "1.25rem", padding: "1.75rem" }}>
                        <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.25rem" }}>
                            What&apos;s Next
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                            {[
                                "You'll receive order confirmation and tracking details via email.",
                                "Assembly guide is included in the box — tools provided.",
                                "For any questions, contact support@sanraliving.com.",
                            ].map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.65rem", fontWeight: 700, color: "#fff", fontFamily: FM }}>
                                        {i + 1}
                                    </div>
                                    <p style={{ fontSize: "0.875rem", color: "#555", fontFamily: FO, lineHeight: 1.7 }}>{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── CTAs ─────────────────────────────────────────── */}
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
                        <Link href="/track-order" style={{
                            flex: 1, display: "block", textAlign: "center",
                            padding: "1rem", background: "#1C1C1C", color: "#fff",
                            fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.12em",
                            textTransform: "uppercase", textDecoration: "none", fontFamily: FM,
                            minWidth: 160,
                        }}>
                            Track Order
                        </Link>
                        <Link href="/shop" style={{
                            flex: 1, display: "block", textAlign: "center",
                            padding: "1rem", color: "#1C1C1C",
                            fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.12em",
                            textTransform: "uppercase", border: "2px solid #1C1C1C",
                            textDecoration: "none", fontFamily: FM,
                            minWidth: 160,
                        }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </section>

            <SiteFooter />

            <style>{`
                @keyframes sl-pop {
                    from { opacity: 0; transform: scale(0.6); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </main>
    );
}

/* ── EXPORT (wrapped in Suspense for useSearchParams) ─────────── */
export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: FM }}>
                Loading…
            </div>
        }>
            <ConfirmationInner />
        </Suspense>
    );
}
