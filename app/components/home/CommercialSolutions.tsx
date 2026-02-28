"use client";

import React from "react";
import Link from "next/link";

export default function CommercialSolutions() {
    return (
        <section
            style={{
                background: "linear-gradient(135deg, #0F0F0F 0%, #1C1C1C 50%, #2A2A2A 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Grid pattern overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    pointerEvents: "none",
                }}
            />
            <div
                className="sl-container sl-section"
                style={{ position: "relative", zIndex: 1 }}
            >
                <div
                    className="flex flex-col md:flex-row md:items-center"
                    style={{ gap: "4rem" }}
                >
                    {/* Content */}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.5rem",
                        }}
                    >
                        <div className="flex items-center" style={{ gap: "0.75rem" }}>
                            <div
                                style={{
                                    width: "2rem",
                                    height: "1.5px",
                                    background: "rgba(255,255,255,0.35)",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.2em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.5)",
                                }}
                            >
                                For Institutions
                            </span>
                        </div>
                        <h2
                            style={{
                                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                                fontWeight: 800,
                                color: "#fff",
                                lineHeight: 1.15,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Commercial &<br />
                            Bulk Solutions.
                        </h2>
                        <p
                            style={{
                                fontSize: "1rem",
                                color: "rgba(255,255,255,0.6)",
                                lineHeight: 1.7,
                                maxWidth: 420,
                            }}
                        >
                            Outfit offices, co-working spaces, hostels, hospitals, and
                            institutional environments. Direct from manufacturer — at scale.
                        </p>

                        {/* Commercial highlights */}
                        <div
                            className="grid grid-cols-2"
                            style={{ gap: "1rem", paddingTop: "0.5rem" }}
                        >
                            {[
                                { label: "Custom Configurations", icon: "⚙️" },
                                { label: "Volume Pricing", icon: "📦" },
                                { label: "Project Consultation", icon: "📐" },
                                { label: "Pan-India Delivery", icon: "🚚" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.625rem",
                                        padding: "0.75rem 1rem",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                >
                                    <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                                    <span
                                        style={{
                                            fontSize: "0.78rem",
                                            fontWeight: 600,
                                            color: "rgba(255,255,255,0.75)",
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div
                            className="flex flex-col sm:flex-row"
                            style={{ gap: "1rem", paddingTop: "0.5rem" }}
                        >
                            <Link href="/bulk-orders" className="sl-btn sl-btn-primary">
                                Request Bulk Quote
                            </Link>
                            <Link href="/contact" className="sl-btn sl-btn-outline-white">
                                Talk to Our Team
                            </Link>
                        </div>
                    </div>

                    {/* Stats side */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1px",
                            minWidth: "260px",
                        }}
                    >
                        {[
                            { num: "500+", label: "Units Delivered" },
                            { num: "50+", label: "Institutional Projects" },
                            { num: "Pan India", label: "Shipping Coverage" },
                            { num: "Direct", label: "From Manufacturer" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                style={{
                                    padding: "1.5rem 2rem",
                                    background: "rgba(255,255,255,0.03)",
                                    borderLeft: "3px solid rgba(255,255,255,0.12)",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 900,
                                        color: "#fff",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {stat.num}
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.72rem",
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,0.4)",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        marginTop: "0.15rem",
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
