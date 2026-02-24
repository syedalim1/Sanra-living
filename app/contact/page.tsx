"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

/* ── FONTS ───────────────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── HELPERS ─────────────────────────────────────────────────── */
const Label = ({ children }: { children: React.ReactNode }) => (
    <p style={{
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em",
        textTransform: "uppercase", color: "#888", fontFamily: FM,
        marginBottom: "1rem",
    }}>
        {children}
    </p>
);

const InfoBlock = ({
    title, lines,
}: {
    title: string;
    lines: React.ReactNode[];
}) => (
    <div style={{ marginBottom: "2rem" }}>
        <p style={{
            fontSize: "0.78rem", fontWeight: 700, color: "#1C1C1C",
            textTransform: "uppercase", letterSpacing: "0.1em",
            fontFamily: FM, marginBottom: "0.625rem",
        }}>{title}</p>
        {lines.map((line, i) => (
            <p key={i} style={{
                fontSize: "0.9rem", color: "#555", lineHeight: 1.8,
                fontFamily: FO, margin: 0,
            }}>{line}</p>
        ))}
    </div>
);

/* ── PAGE ────────────────────────────────────────────────────── */
export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", subject: "", message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate async submission
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

    /* shared input style */
    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "0.75rem 1rem",
        border: "1px solid #E0E0E0",
        borderRadius: 0,
        fontSize: "0.9rem",
        fontFamily: FO,
        color: "#1C1C1C",
        background: "#FAFAFA",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    };

    const fieldWrap: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "#333",
        fontFamily: FM,
        letterSpacing: "0.05em",
    };

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>

            <SiteHeader />

            {/* ── PAGE TITLE ──────────────────────────────────────────── */}
            <section style={{ background: "#fff", padding: "clamp(3.5rem, 8vw, 5.5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <Label>Get In Touch</Label>
                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3rem)",
                        fontWeight: 900, color: "#111",
                        lineHeight: 1.1, letterSpacing: "-0.025em",
                        fontFamily: FM, marginBottom: "1rem",
                    }}>
                        Contact Us
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "#666", lineHeight: 1.8, fontFamily: FO, margin: 0 }}>
                        Have a question about our products, bulk orders, or support?<br />
                        We&apos;re here to assist you.
                    </p>
                </div>
            </section>

            {/* ── SECTION 1: CONTACT GRID ──────────────────────────────── */}
            <section style={{ padding: "clamp(3rem, 7vw, 5rem) 1.5rem" }}>
                <div style={{
                    maxWidth: 1040, margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "clamp(2rem, 5vw, 4rem)",
                    alignItems: "start",
                }}>

                    {/* ── LEFT: CONTACT INFORMATION ─────────────────── */}
                    <div>
                        <Label>Contact Information</Label>

                        <InfoBlock
                            title="Customer Support"
                            lines={[
                                <>Email: <a href="mailto:support@sanraliving.com" style={{ color: "#1C1C1C", fontWeight: 700, textDecoration: "none" }}>support@sanraliving.com</a></>,
                                "Response Time: 24–48 Working Hours",
                            ]}
                        />

                        <div style={{ height: 1, background: "#E6E6E6", marginBottom: "2rem" }} />

                        <InfoBlock
                            title="Bulk & Institutional Enquiries"
                            lines={[
                                <>Email: <a href="mailto:support@sanraliving.com" style={{ color: "#1C1C1C", fontWeight: 700, textDecoration: "none" }}>support@sanraliving.com</a></>,
                                <>Subject: <strong style={{ color: "#1C1C1C" }}>&quot;Bulk Order Enquiry&quot;</strong></>,
                            ]}
                        />

                        <div style={{ height: 1, background: "#E6E6E6", marginBottom: "2rem" }} />

                        <InfoBlock
                            title="Working Hours"
                            lines={[
                                "Monday – Saturday",
                                "10:00 AM – 6:00 PM",
                                <span key="sun" style={{ color: "#999", fontSize: "0.85rem" }}>Sunday – Closed</span>,
                            ]}
                        />

                        <div style={{ height: 1, background: "#E6E6E6", marginBottom: "2rem" }} />

                        <InfoBlock
                            title="Manufacturing Unit"
                            lines={[
                                "Operated under:",
                                <strong key="imsi" style={{ color: "#1C1C1C" }}>Indian Make Steel Industries</strong>,
                                <span key="addr" style={{ color: "#999", fontSize: "0.85rem" }}>Address available on request</span>,
                            ]}
                        />
                    </div>

                    {/* ── RIGHT: CONTACT FORM ───────────────────────── */}
                    <div style={{
                        background: "#fff",
                        border: "1px solid #E6E6E6",
                        padding: "clamp(1.75rem, 5vw, 2.5rem)",
                    }}>
                        {submitted ? (
                            /* Success State */
                            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                                <div style={{
                                    width: 56, height: 56,
                                    background: "#1C1C1C",
                                    borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 1.5rem",
                                    fontSize: "1.5rem", color: "#fff",
                                }}>✓</div>
                                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.75rem" }}>
                                    Message Received
                                </p>
                                <p style={{ fontSize: "0.9rem", color: "#666", fontFamily: FO, lineHeight: 1.7, marginBottom: "2rem" }}>
                                    Thank you for reaching out. Our team will get back to you within 24–48 working hours.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                                    style={{
                                        padding: "0.75rem 2rem",
                                        background: "#F5F5F5", border: "1px solid #E6E6E6",
                                        fontSize: "0.78rem", fontWeight: 700,
                                        fontFamily: FM, letterSpacing: "0.08em",
                                        textTransform: "uppercase", cursor: "pointer",
                                        color: "#1C1C1C",
                                    }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            /* Form */
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Full Name <span style={{ color: "#C0392B" }}>*</span></label>
                                    <input
                                        type="text" name="name" required
                                        value={formData.name} onChange={handleChange}
                                        placeholder="Your full name"
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Email Address <span style={{ color: "#C0392B" }}>*</span></label>
                                    <input
                                        type="email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        placeholder="you@example.com"
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Phone Number <span style={{ color: "#C0392B" }}>*</span></label>
                                    <input
                                        type="tel" name="phone" required
                                        value={formData.phone} onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject} onChange={handleChange}
                                        style={{ ...inputStyle, cursor: "pointer" }}
                                    >
                                        <option value="">Select a subject…</option>
                                        <option value="Product Enquiry">Product Enquiry</option>
                                        <option value="Order Support">Order Support</option>
                                        <option value="Bulk Order">Bulk Order</option>
                                        <option value="Warranty Claim">Warranty Claim</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Message <span style={{ color: "#C0392B" }}>*</span></label>
                                    <textarea
                                        name="message" required rows={5}
                                        value={formData.message} onChange={handleChange}
                                        placeholder="Tell us how we can help you…"
                                        style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: "1rem",
                                        background: loading ? "#555" : "#1C1C1C",
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: "0.78rem",
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        fontFamily: FM,
                                        border: "none",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        transition: "background 0.2s",
                                    }}
                                >
                                    {loading ? "Sending…" : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

            {/* ── SECTION 2: QUICK HELP STRIP ──────────────────────────── */}
            <section style={{ background: "#EBEBEB", padding: "2.25rem 1.5rem" }}>
                <div style={{
                    maxWidth: 1040, margin: "0 auto",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                }}>
                    <div>
                        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", fontFamily: FM, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                            Need faster assistance?
                        </p>
                        <p style={{ fontSize: "0.9375rem", color: "#444", fontFamily: FO, margin: 0 }}>
                            For order tracking, visit the Track Order page.
                        </p>
                    </div>
                    <Link
                        href="/track-order"
                        style={{
                            display: "inline-block",
                            padding: "0.875rem 2rem",
                            background: "#1C1C1C",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            fontFamily: FM,
                            flexShrink: 0,
                            transition: "background 0.2s",
                        }}
                    >
                        Track Order
                    </Link>
                </div>
            </section>

            <SiteFooter />

        </main>
    );
}
