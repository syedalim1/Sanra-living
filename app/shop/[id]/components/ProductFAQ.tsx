"use client";

import React, { useState } from "react";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const faqs = [
    { q: "Is self-assembly difficult?", a: "No. The kit uses a simple bolt-together system with pre-drilled holes. Assembly takes 15–20 minutes with the included Allen key. A step-by-step guide is also available for download." },
    { q: "Is COD available?", a: "Yes, Cash on Delivery is available across India. A token advance may be required for orders above ₹5,000." },
    { q: "Is the steel rust resistant?", a: "Yes. All products use a premium powder-coat finish applied over treated mild steel, providing strong resistance to humidity and corrosion under normal indoor use." },
    { q: "What does the 10 Year Warranty cover?", a: "The structural warranty covers the primary steel frame against manufacturing defects and structural failure under normal use. It does not cover surface scratches, misuse, or improper installation." },
    { q: "Can I return the product?", a: "Yes — within 10 days of delivery. An unboxing video is mandatory for all replacement and return requests. Products must be in original packaging." },
];

interface Props {
    isMobile: boolean;
}

export default function ProductFAQ({ isMobile }: Props) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const label = (extra?: object) => ({
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em",
        textTransform: "uppercase" as const, color: "#888", fontFamily: FM, ...extra,
    });

    return (
        <section style={{ padding: isMobile ? "2.5rem 1.25rem" : "3.75rem 1.5rem", background: "#fff" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <p style={label({ marginBottom: "0.375rem" })}>Common Questions</p>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111", marginBottom: "2rem", letterSpacing: "-0.01em", fontFamily: FM }}>FAQ</h2>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{ borderTop: "1px solid #E6E6E6" }}>
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                style={{ width: "100%", textAlign: "left", padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{faq.q}</span>
                                <span style={{ fontSize: "1.5rem", color: "#555", flexShrink: 0, transition: "transform 0.25s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", display: "inline-block", lineHeight: 1 }}>+</span>
                            </button>
                            {openFaq === i && (
                                <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.8, paddingBottom: "1.25rem", fontFamily: FO }}>{faq.a}</p>
                            )}
                        </div>
                    ))}
                    <div style={{ borderTop: "1px solid #E6E6E6" }} />
                </div>
            </div>
        </section>
    );
}
