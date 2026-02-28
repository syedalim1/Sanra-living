"use client";

import React from "react";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

interface Props {
    isMobile: boolean;
}

export default function ProductDelivery({ isMobile }: Props) {
    const label = (extra?: object) => ({
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em",
        textTransform: "uppercase" as const, color: "#888", fontFamily: FM, ...extra,
    });

    const deliveryRows: [string, string][] = [
        ["Tamil Nadu", "3 – 5 Days"],
        ["Kerala", "4 – 7 Days"],
        ["Karnataka & AP/TS", "5 – 8 Days"],
        ["Rest of India", "6 – 10 Days"],
    ];

    return (
        <section style={{ padding: isMobile ? "2.5rem 1.25rem" : "3.75rem 1.5rem", background: "#F5F5F5" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <p style={label({ marginBottom: "1.5rem" })}>Delivery & Replacement</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>

                    {/* Delivery Timeline */}
                    <div style={{ background: "#fff", padding: "1.75rem", borderLeft: "3px solid #111" }}>
                        <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "#111", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FM }}>State-Wise Delivery Timeline</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                            {deliveryRows.map(([region, time], i) => (
                                <div key={region}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", fontFamily: FO }}>
                                        <span style={{ color: "#555" }}>{region}</span>
                                        <span style={{ fontWeight: 700, color: "#111", fontFamily: FM }}>{time}</span>
                                    </div>
                                    {i < deliveryRows.length - 1 && <div style={{ height: 1, background: "#f0f0f0", margin: "0.5rem 0" }} />}
                                </div>
                            ))}
                        </div>
                        {/* Trust badges */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #f0f0f0" }}>
                            {[
                                { icon: "🚚", text: "Pan India Shipping" },
                                { icon: "💳", text: "COD Available" },
                                { icon: "📄", text: "GST Invoice Included" },
                            ].map((badge) => (
                                <div key={badge.text} style={{
                                    display: "flex", alignItems: "center", gap: "0.375rem",
                                    padding: "0.375rem 0.75rem", background: "#F5F5F5",
                                    fontSize: "0.72rem", fontWeight: 600, color: "#555",
                                    fontFamily: FM, letterSpacing: "0.02em",
                                }}>
                                    <span>{badge.icon}</span>
                                    <span>{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Replacement Policy */}
                    <div style={{ background: "#fff", padding: "1.75rem", borderLeft: "3px solid #555" }}>
                        <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "#111", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FM }}>Replacement Policy</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <p style={{ fontSize: "0.84rem", color: "#333", fontFamily: FO }}>✓ <strong>10 Days</strong> replacement window</p>
                            <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ Unboxing video mandatory for all claims</p>
                            <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ Original packaging required</p>
                        </div>
                        {/* Quality assurance block */}
                        <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #f0f0f0" }}>
                            <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "#111", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FM }}>Quality Assurance</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ <strong>10 Year</strong> structural warranty</p>
                                <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ Manufacturer direct — no middlemen</p>
                                <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ Premium powder-coat finish</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
