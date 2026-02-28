"use client";

import React from "react";
import Link from "next/link";

export default function ModularExpansion() {
    return (
        <section className="sl-section" style={{ background: "#FFFFFF" }}>
            <div className="sl-container">
                <div
                    className="grid grid-cols-1 md:grid-cols-2 items-center"
                    style={{ gap: "4rem" }}
                >
                    {/* Visual */}
                    <div
                        style={{
                            position: "relative",
                            aspectRatio: "4/3",
                            borderRadius: "2px",
                            overflow: "hidden",
                            background: "#E9E9E7",
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/ABOUT_SECTION_BACKGROUND.png"
                            alt="Modular furniture system"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                        {/* Overlay badge */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "1.5rem",
                                left: "1.5rem",
                                background: "rgba(0,0,0,0.75)",
                                backdropFilter: "blur(8px)",
                                padding: "0.75rem 1.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="1.5"
                            >
                                <rect x="2" y="2" width="5" height="5" rx="1" />
                                <rect x="11" y="2" width="5" height="5" rx="1" />
                                <rect x="2" y="11" width="5" height="5" rx="1" />
                                <path d="M13.5 11v5M11 13.5h5" strokeLinecap="round" />
                            </svg>
                            <span
                                style={{
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    color: "#fff",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Expandable Systems
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                    >
                        <div
                            className="flex items-center"
                            style={{ gap: "0.75rem" }}
                        >
                            <div
                                style={{ width: "2rem", height: "1.5px", background: "#ccc" }}
                            />
                            <span className="sl-label">Future-Ready Design</span>
                        </div>
                        <h2 className="sl-heading-lg">
                            Designed to Expand
                            <br />
                            with Your Space.
                        </h2>
                        <p className="sl-body" style={{ maxWidth: 440 }}>
                            Every Sanra product is part of a modular ecosystem. Start with a
                            single unit and expand over time — same finish, same system, same
                            structural language.
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.875rem",
                                paddingTop: "0.5rem",
                            }}
                        >
                            {[
                                "Mix-and-match modules within any category",
                                "Consistent finishes across all product lines",
                                "Add-on components available for every system",
                                "Zero redesign — your space grows with you",
                            ].map((item) => (
                                <div
                                    key={item}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "0.625rem",
                                        fontSize: "0.875rem",
                                        color: "#444",
                                    }}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        style={{ marginTop: "0.15rem", flexShrink: 0 }}
                                    >
                                        <circle cx="8" cy="8" r="7" stroke="#1C1C1C" strokeWidth="1.2" />
                                        <path
                                            d="M5 8l2 2 4-4"
                                            stroke="#1C1C1C"
                                            strokeWidth="1.4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span style={{ fontWeight: 500 }}>{item}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ paddingTop: "0.5rem" }}>
                            <Link href="/shop" className="sl-btn sl-btn-primary">
                                Explore Modular Systems
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
