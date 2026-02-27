"use client";

import React from "react";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

interface Props {
    isMobile: boolean;
}

const features = [
    { icon: "▪", label: "Structural Steel Frame", sub: "Certified mild steel" },
    { icon: "◼", label: "Premium Powder Coating", sub: "Scratch & corrosion resistant" },
    { icon: "⚙", label: "Self Assembly Design", sub: "15–20 mins, tools included" },
    { icon: "✦", label: "Precision Fabricated", sub: "CNC bent, welded joints" },
];

export default function ProductFeatures({ isMobile }: Props) {
    return (
        <section style={{ background: "#EBEBEB", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6", padding: "2rem 1.5rem" }}>
            <div style={{
                maxWidth: 1200, margin: "0 auto",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
                gap: 1, background: "#ddd",
            }}>
                {features.map((f) => (
                    <div key={f.label} style={{ background: "#fff", padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.125rem", color: "#1C1C1C" }}>{f.icon}</span>
                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{f.label}</p>
                        <p style={{ fontSize: "0.75rem", color: "#888", fontFamily: FO }}>{f.sub}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
