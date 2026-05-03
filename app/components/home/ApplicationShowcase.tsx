"use client";

import React from "react";
import Link from "next/link";
import { FM, FO } from "../../shop/ShopComponents";

const applications = [
    {
        title: "Home Use",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80",
        href: "/shop",
    },
    {
        title: "Office Use",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
        href: "/shop/workspace",
    },
    {
        title: "Commercial Use",
        image: "https://images.unsplash.com/photo-1598928506311-c55e5bc7ad37?w=600&q=80",
        href: "/shop/commercial",
    },
];

export default function ApplicationShowcase() {
    return (
        <section style={{ padding: "4rem 1.5rem", background: "#fff" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "#111",
                        marginBottom: "2rem",
                        fontFamily: FM,
                        letterSpacing: "-0.01em",
                    }}
                >
                    Shop by Space
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {applications.map((app) => (
                        <Link
                            key={app.title}
                            href={app.href}
                            style={{
                                display: "block",
                                textDecoration: "none",
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: "0.25rem",
                                aspectRatio: "4/5",
                            }}
                            className="group"
                        >
                            <img
                                src={app.image}
                                alt={app.title}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                }}
                                className="group-hover:scale-105"
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "rgba(0,0,0,0.3)",
                                    transition: "background 0.3s ease",
                                }}
                                className="group-hover:bg-black/40"
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    width: "100%",
                                    padding: "1.5rem",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "1rem",
                                        borderRadius: "2px",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "1rem",
                                            fontWeight: 800,
                                            color: "#111",
                                            fontFamily: FM,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        {app.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
