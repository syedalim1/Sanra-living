"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ─── ORDER STATUS STEPS ──────────────────────────────────── */
const STATUS_STEPS = [
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
] as const;

const STATUS_LABELS: Record<string, string> = {
    processing: "Order Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
};

interface OrderResult {
    order_number: string;
    order_status: string;
    payment_status: string;
    total_amount: number;
    created_at: string;
    city: string;
    state: string;
    statusLogs: { status: string; updated_at: string }[];
}

/* ─── STATUS PROGRESS BAR ─────────────────────────────────── */
function StatusFlow({ currentStatus }: { currentStatus: string }) {
    const activeIndex = STATUS_STEPS.indexOf(
        currentStatus as (typeof STATUS_STEPS)[number]
    );

    return (
        <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
            <div style={{
                display: "flex", alignItems: "center",
                minWidth: 520, position: "relative", paddingTop: "0.5rem",
            }}>
                {STATUS_STEPS.map((step, i) => {
                    const isDone = i < activeIndex;
                    const isActive = i === activeIndex;
                    return (
                        <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                            {i > 0 && (
                                <div style={{
                                    position: "absolute", top: 13, right: "50%", width: "100%",
                                    height: 2,
                                    background: i <= activeIndex ? "#1C1C1C" : "#E6E6E6",
                                    zIndex: 0,
                                }} />
                            )}
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                border: isDone || isActive ? "2.5px solid #1C1C1C" : "2px solid #D0D0D0",
                                background: isDone ? "#1C1C1C" : isActive ? "#fff" : "#F5F5F5",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                zIndex: 1, position: "relative", flexShrink: 0,
                            }}>
                                {isDone ? (
                                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                        <path d="M2 7l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : isActive ? (
                                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#1C1C1C" }} />
                                ) : null}
                            </div>
                            <p style={{
                                marginTop: "0.5rem", fontSize: "0.67rem",
                                fontWeight: isDone || isActive ? 700 : 400,
                                color: isDone || isActive ? "#111" : "#aaa",
                                fontFamily: FM, textAlign: "center",
                                letterSpacing: "0.02em", whiteSpace: "nowrap",
                            }}>
                                {STATUS_LABELS[step] ?? step}
                                {isActive && (
                                    <span style={{ display: "block", fontSize: "0.58rem", color: "#1C1C1C", marginTop: "0.15rem", fontFamily: FO }}>
                                        Current
                                    </span>
                                )}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── PAGE ────────────────────────────────────────────────── */
export default function TrackOrderPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<OrderResult[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleTrack = async () => {
        setError("");
        if (!query.trim()) { setError("Please enter your Order ID or phone number."); return; }
        setLoading(true);
        setSearched(false);
        try {
            const res = await fetch(`/api/track-order?q=${encodeURIComponent(query.trim())}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            setResults(json.orders ?? []);
            if ((json.orders ?? []).length === 0) {
                setError("No order found. Check your Order ID or phone number and try again.");
            }
        } catch {
            setError("Something went wrong. Please try again or contact support.");
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const handleReset = () => {
        setQuery(""); setResults([]); setError(""); setSearched(false);
    };


    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>

            <SiteHeader />

            {/* HERO */}
            <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "clamp(3rem, 7vw, 5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 540, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1rem" }}>
                        Order Management
                    </p>
                    <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.025em", fontFamily: FM, marginBottom: "0.875rem" }}>
                        Track Your Order
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "#666", lineHeight: 1.8, fontFamily: FO }}>
                        Enter your order details below to check delivery status.
                    </p>
                </div>
            </section>

            {/* SECTION 1 – TRACKING FORM */}
            <section style={{ padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{
                    maxWidth: 500, margin: "0 auto",
                    background: "#fff",
                    border: "1px solid #E6E6E6",
                    padding: "clamp(2rem, 5vw, 2.5rem)",
                }}>
                    {results.length === 0 ? (
                        <>
                            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555", fontFamily: FM, marginBottom: "1.75rem" }}>
                                Your Order Details
                            </p>

                            <div style={{ marginBottom: "1.75rem" }}>
                                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#555", fontFamily: FM, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                                    Order ID or Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setError(""); }}
                                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                                    placeholder="e.g. SL-12345678 or 9876543210"
                                    style={{
                                        width: "100%", padding: "0.875rem 1rem",
                                        border: "1.5px solid #E6E6E6", fontSize: "0.9rem",
                                        fontFamily: FO, color: "#111", outline: "none",
                                        background: "#fff", boxSizing: "border-box",
                                    }}
                                />
                                <p style={{ fontSize: "0.72rem", color: "#aaa", fontFamily: FO, marginTop: "0.375rem" }}>
                                    Enter the Order ID (e.g. SL-43217890) or the phone number you used at checkout.
                                </p>
                            </div>

                            {error && (
                                <p style={{ fontSize: "0.82rem", color: "#c0392b", fontFamily: FO, marginBottom: "1rem", padding: "0.625rem 0.875rem", background: "#fdf2f2", borderLeft: "3px solid #c0392b" }}>
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={handleTrack}
                                disabled={loading}
                                style={{
                                    width: "100%", padding: "1rem",
                                    background: loading ? "#555" : "#1C1C1C", color: "#fff",
                                    fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.14em",
                                    textTransform: "uppercase", fontFamily: FM, border: "none",
                                    cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s",
                                }}
                            >
                                {loading ? "Tracking..." : "Track Order"}
                            </button>
                        </>
                    ) : (
                        /* ── RESULTS ──────────────────────────────── */
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555", fontFamily: FM, margin: 0 }}>
                                    {results.length} Order{results.length > 1 ? "s" : ""} Found
                                </p>
                                <button onClick={handleReset} style={{ fontSize: "0.72rem", color: "#888", background: "none", border: "none", cursor: "pointer", fontFamily: FM, textDecoration: "underline" }}>
                                    Track different order
                                </button>
                            </div>

                            {results.map((order) => {
                                const latestStatus = order.statusLogs.at(-1)?.status ?? order.order_status;
                                const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;
                                const date = new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                                return (
                                    <div key={order.order_number} style={{ marginBottom: "1.5rem" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#E6E6E6", marginBottom: "1.25rem" }}>
                                            {[
                                                { label: "Order", value: order.order_number },
                                                { label: "Status", value: STATUS_LABELS[latestStatus] ?? latestStatus, highlight: true },
                                                { label: "Total", value: fmt(order.total_amount) },
                                                { label: "City", value: `${order.city}, ${order.state}` },
                                                { label: "Placed On", value: date },
                                            ].map((row) => (
                                                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "0.875rem 1rem", flexWrap: "wrap", gap: "0.25rem" }}>
                                                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", fontFamily: FM, margin: 0 }}>{row.label}</p>
                                                    <p style={{ fontSize: "0.875rem", fontWeight: row.highlight ? 900 : 700, color: row.highlight ? "#1a6b3a" : "#111", fontFamily: FM, margin: 0 }}>{row.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.25rem" }}>
                                            Delivery Progress
                                        </p>
                                        <StatusFlow currentStatus={latestStatus} />
                                        {/* Timeline log */}
                                        {order.statusLogs.length > 0 && (
                                            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "0.5rem" }}>Status History</p>
                                                {order.statusLogs.map((log, i) => (
                                                    <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1C1C1C", flexShrink: 0, marginTop: "0.35rem" }} />
                                                        <div>
                                                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111", fontFamily: FM, margin: 0 }}>{STATUS_LABELS[log.status] ?? log.status}</p>
                                                            <p style={{ fontSize: "0.72rem", color: "#aaa", fontFamily: FO }}>{new Date(log.updated_at).toLocaleString("en-IN")}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

            </section>

            {/* SECTION 4 – SUPPORT NOTE */}
            <section style={{ background: "#fff", borderTop: "1px solid #E6E6E6", padding: "clamp(2rem, 5vw, 3.5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "0.875rem" }}>
                        Need Help?
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.8, fontFamily: FO, marginBottom: "0.75rem" }}>
                        If you are facing issues tracking your order, please contact:
                    </p>
                    <a href="mailto:support@sanraliving.com" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111", fontFamily: FM, display: "block", marginBottom: "0.5rem", textDecoration: "none" }}>
                        support@sanraliving.com
                    </a>
                    <p style={{ fontSize: "0.8rem", color: "#aaa", fontFamily: FO }}>
                        Response within 24–48 working hours.
                    </p>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
