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

    return (
        <section style={{ padding: isMobile ? "2.5rem 1.25rem" : "3.75rem 1.5rem", background: "#F5F5F5" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <p style={label({ marginBottom: "1.5rem" })}>Delivery & Replacement</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                    <div style={{ background: "#fff", padding: "1.75rem", borderLeft: "3px solid #111" }}>
                        <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "#111", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FM }}>Delivery Timeline</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                            {[["Tamil Nadu", "3 – 5 Days"], ["Rest of India", "5 – 8 Days"]].map(([region, time]) => (
                                <div key={region}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", fontFamily: FO }}>
                                        <span style={{ color: "#555" }}>{region}</span>
                                        <span style={{ fontWeight: 700, color: "#111", fontFamily: FM }}>{time}</span>
                                    </div>
                                    {region === "Tamil Nadu" && <div style={{ height: 1, background: "#f0f0f0", margin: "0.5rem 0" }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: "#fff", padding: "1.75rem", borderLeft: "3px solid #555" }}>
                        <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "#111", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FM }}>Replacement Policy</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <p style={{ fontSize: "0.84rem", color: "#333", fontFamily: FO }}>✓ <strong>10 Days</strong> replacement window</p>
                            <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ Unboxing video mandatory for all claims</p>
                            <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ Original packaging required</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
