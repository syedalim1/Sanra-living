"use client";

import React from "react";

const trustBlocks = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
                <path d="M14 3L5 7.5v6.5c0 5.5 3.8 10.6 9 12 5.2-1.4 9-6.5 9-12V7.5L14 3z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 14l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "10 Year Structural Warranty",
        desc: "Engineered to outlast. Every weld and joint backed by our decade-long warranty.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
                <path d="M3 9l11-7 11 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 21V14h8v7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Made by Manufacturer",
        desc: "No middlemen. Direct from our fabrication facility to your door — honest pricing.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
                <rect x="2" y="8" width="16" height="12" rx="1.5" />
                <path d="M18 12h4.5a2 2 0 011.8 1.1l1.5 3a.5.5 0 01.2.4V22a1 1 0 01-1 1h-1" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="23" r="2" />
                <circle cx="22" cy="23" r="2" />
            </svg>
        ),
        title: "Pan India Shipping",
        desc: "Reliable delivery across India. Securely packed flat-pack systems, ready to assemble.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
                <circle cx="14" cy="14" r="5" />
                <path d="M14 3v4M14 21v4M3 14h4M21 14h4M6.1 6.1l2.8 2.8M19.1 19.1l2.8 2.8M6.1 21.9l2.8-2.8M19.1 8.9l2.8-2.8" strokeLinecap="round" />
            </svg>
        ),
        title: "Precision Fabrication",
        desc: "CNC-bent frames with welded joints engineered to tolerance, not approximation.",
    },
];

export default function TrustBlock() {
    return (
        <section style={{ background: "#F5F5F5", borderTop: "1px solid #E6E6E6" }}>
            <div className="sl-container" style={{ padding: "4.5rem 1.5rem" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="sl-label" style={{ display: "block", marginBottom: "0.75rem" }}>
                        Why Choose Sanra
                    </span>
                    <h2 className="sl-heading-lg">Built on Trust.</h2>
                </div>

                {/* 4 block grid */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    style={{ gap: "1.5rem" }}
                >
                    {trustBlocks.map((block) => (
                        <div key={block.title} className="hp-trust-card">
                            <div className="hp-trust-icon">{block.icon}</div>
                            <h3
                                style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                    color: "#111",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {block.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.82rem",
                                    color: "#777",
                                    lineHeight: 1.6,
                                }}
                            >
                                {block.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
