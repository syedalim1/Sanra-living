"use client";

import React from "react";

const philosophyPillars = [
    {
        stat: "1.2mm",
        title: "Steel Frames",
        desc: "Structural-grade steel tubing for unmatched load-bearing strength.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                <rect x="3" y="5" width="18" height="14" rx="1.5" />
                <path d="M3 12h18" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        stat: "CNC",
        title: "Precision Cutting",
        desc: "Computer-controlled cutting for exact dimensions and clean edges.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        stat: "Matte",
        title: "Powder Coating",
        desc: "Textured matte finish that resists scratches, rust, and UV damage.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                <path d="M12 2l2 4h4l-3 3 1.5 4.5L12 11l-4.5 2.5L9 9l-3-3h4l2-4z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        stat: "Flat Pack",
        title: "Engineered Systems",
        desc: "Bolt-together assembly designed for easy transport and setup.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                <rect x="3" y="3" width="8" height="8" rx="1" />
                <rect x="13" y="3" width="8" height="8" rx="1" />
                <rect x="3" y="13" width="8" height="8" rx="1" />
                <rect x="13" y="13" width="8" height="8" rx="1" />
            </svg>
        ),
    },
];

export default function DesignPhilosophy() {
    return (
        <section
            style={{
                background: "#1C1C1C",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "url('/images/STEEL_CLOSE-UP_TEXTURE.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.06,
                    pointerEvents: "none",
                }}
            />
            <div
                className="sl-container sl-section"
                style={{ position: "relative", zIndex: 1 }}
            >
                {/* Header */}
                <div
                    className="flex flex-col md:flex-row md:items-end md:justify-between"
                    style={{ marginBottom: "3.5rem", gap: "1.5rem" }}
                >
                    <div>
                        <div
                            className="flex items-center"
                            style={{ gap: "0.75rem", marginBottom: "1rem" }}
                        >
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
                                Design Philosophy
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
                            Built on Structural
                            <br />
                            Integrity.
                        </h2>
                    </div>
                    <p
                        style={{
                            fontSize: "0.95rem",
                            color: "rgba(255,255,255,0.55)",
                            lineHeight: 1.7,
                            maxWidth: 380,
                        }}
                    >
                        Every Sanra product is engineered from the ground up — materials,
                        process, and finish — to meet structural standards, not just
                        aesthetic ones.
                    </p>
                </div>

                {/* 4 Pillars */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    style={{ gap: "1px", background: "rgba(255,255,255,0.08)" }}
                >
                    {philosophyPillars.map((p) => (
                        <div
                            key={p.title}
                            className="hp-philosophy-card"
                        >
                            <div className="hp-philosophy-icon">{p.icon}</div>
                            <div
                                style={{
                                    fontSize: "1.75rem",
                                    fontWeight: 900,
                                    color: "#fff",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {p.stat}
                            </div>
                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.85)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                }}
                            >
                                {p.title}
                            </div>
                            <p
                                style={{
                                    fontSize: "0.82rem",
                                    color: "rgba(255,255,255,0.45)",
                                    lineHeight: 1.6,
                                }}
                            >
                                {p.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
