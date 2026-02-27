"use client";

import React, { useState } from "react";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const TABS = ["Description", "Specifications", "Assembly", "Warranty"] as const;
type Tab = (typeof TABS)[number];

const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke="#1C1C1C" strokeWidth="1.3" />
        <path d="M5 8l2 2 4-4" stroke="#1C1C1C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface Props {
    description: string;
    specs: Record<string, string>;
    isMobile: boolean;
}

export default function ProductTabs({ description, specs, isMobile }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("Description");

    return (
        <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "0 1.5rem" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{
                    display: isMobile ? "grid" : "flex",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "none",
                    borderBottom: isMobile ? "none" : "1px solid #E6E6E6",
                    gap: isMobile ? "1px" : "0", background: isMobile ? "#E6E6E6" : "transparent",
                }}>
                    {TABS.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            padding: isMobile ? "1rem 0.5rem" : "1.125rem 1.75rem",
                            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
                            textTransform: "uppercase", background: "#fff", border: "none", cursor: "pointer",
                            color: activeTab === tab ? "#111" : "#999",
                            borderBottom: activeTab === tab ? "2.5px solid #111" : "2.5px solid transparent",
                            marginBottom: isMobile ? 0 : "-1px", transition: "all 0.2s", fontFamily: FM, width: "100%",
                        }}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ padding: isMobile ? "2rem 0 2.5rem" : "2.5rem 0 3rem" }}>
                    {activeTab === "Description" && (
                        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.85, maxWidth: 680, fontFamily: FO }}>{description}</p>
                    )}

                    {activeTab === "Specifications" && (
                        <div style={{ maxWidth: 560 }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                    {Object.entries(specs).map(([k, v], i) => (
                                        <tr key={k} style={{ background: i % 2 === 0 ? "#F8F8F8" : "#fff" }}>
                                            <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", fontWeight: 700, color: "#555", width: "40%", borderBottom: "1px solid #eee", fontFamily: FM }}>{k}</td>
                                            <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", color: "#111", borderBottom: "1px solid #eee", fontFamily: FO }}>{v}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "Assembly" && (
                        <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {[
                                ["Self Assembly Required", "No professional tools needed."],
                                ["Estimated Time", "15–20 minutes"],
                                ["Tools Required", "Basic Allen Key (Included in box)"],
                            ].map(([lbl, val]) => (
                                <div key={lbl} style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#F8F8F8", alignItems: "flex-start" }}>
                                    <CheckIcon />
                                    <div>
                                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{lbl}</p>
                                        <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.125rem", fontFamily: FO }}>{val}</p>
                                    </div>
                                </div>
                            ))}
                            <button style={{ alignSelf: "flex-start", marginTop: "0.5rem", padding: "0.75rem 1.5rem", border: "1.5px solid #111", background: "transparent", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: FM }}>
                                ↓ Download Assembly Guide (PDF)
                            </button>
                        </div>
                    )}

                    {activeTab === "Warranty" && (
                        <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div style={{ background: "#111", color: "#fff", padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                <div style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1, fontFamily: FM }}>10</div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.05em", fontFamily: FM }}>Year Structural Warranty</p>
                                    <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem", fontFamily: FO }}>On all primary steel frame components</p>
                                </div>
                            </div>
                            <p style={{ fontSize: "0.875rem", color: "#444", lineHeight: 1.8, fontFamily: FO }}>
                                SANRA LIVING offers a 10 Year Structural Warranty on the primary steel frame. This warranty reflects our confidence in the materials and fabrication standards we maintain.
                            </p>
                            <div>
                                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FM }}>Not Covered</p>
                                {["Improper installation or assembly", "Surface scratches or cosmetic damage", "Damage due to misuse or overloading"].map((item) => (
                                    <p key={item} style={{ fontSize: "0.82rem", color: "#666", padding: "0.45rem 0 0.45rem 0.75rem", borderBottom: "1px solid #f0f0f0", fontFamily: FO }}>— {item}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
