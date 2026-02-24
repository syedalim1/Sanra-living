"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

const Label = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.25rem" }}>
        {children}
    </p>
);

const Divider = () => (
    <div style={{ height: 1, background: "#E6E6E6", margin: "0 auto", maxWidth: 900 }} />
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "1.5rem" }}>
        {children}
    </h2>
);

const BodyText = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.85, fontFamily: FO, marginBottom: "0.875rem" }}>{children}</p>
);

const BulletItem = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: "0.75rem" }}>
        <div style={{ width: 5, height: 5, background: "#1C1C1C", flexShrink: 0, marginTop: "0.55rem" }} />
        <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.8, fontFamily: FO, margin: 0 }}>{children}</p>
    </div>
);

/* ── FORM FIELD ───────────────────────────────────────────── */
function Field({
    label, type = "text", placeholder, value, onChange, required = false, span = false,
}: {
    label: string; type?: string; placeholder?: string;
    value: string; onChange: (v: string) => void;
    required?: boolean; span?: boolean;
}) {
    return (
        <div style={{ gridColumn: span ? "1 / -1" : undefined }}>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#555", fontFamily: FM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                {label}{required && <span style={{ color: "#c0392b", marginLeft: "0.2rem" }}>*</span>}
            </label>
            {type === "textarea" ? (
                <textarea
                    rows={4}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "0.875rem 1rem", border: "1.5px solid #E6E6E6", fontSize: "0.9rem", fontFamily: FO, color: "#111", outline: "none", background: "#fff", resize: "vertical", boxSizing: "border-box" }}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "0.875rem 1rem", border: "1.5px solid #E6E6E6", fontSize: "0.9rem", fontFamily: FO, color: "#111", outline: "none", background: "#fff", boxSizing: "border-box" }}
                />
            )}
        </div>
    );
}

/* ── PAGE ─────────────────────────────────────────────────── */
export default function BulkOrdersPage() {
    const [form, setForm] = useState({
        company: "", contact: "", phone: "", email: "",
        location: "", product: "", quantity: "", message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");

    const set = (key: keyof typeof form) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

    const handleSubmit = async () => {
        setFormError("");
        if (!form.company || !form.contact || !form.phone || !form.email) {
            setFormError("Please fill in all required fields.");
            return;
        }
        setLoading(true);

        // ── SUPABASE INTEGRATION POINT ──────────────────────────────
        // const { error } = await supabase.from("bulk_enquiries").insert([{
        //   company_name: form.company,
        //   contact_person: form.contact,
        //   phone: form.phone,
        //   email: form.email,
        //   location: form.location,
        //   product_interest: form.product,
        //   quantity: form.quantity,
        //   message: form.message,
        //   created_at: new Date().toISOString(),
        // }]);
        // if (error) { setFormError("Something went wrong. Please try again."); setLoading(false); return; }
        // ────────────────────────────────────────────────────────────

        await new Promise((r) => setTimeout(r, 900)); // remove when Supabase is live
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>

            <SiteHeader />

            {/* HERO */}
            <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "clamp(3.5rem, 8vw, 6rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 680, margin: "0 auto" }}>
                    <Label>Institutional & Trade Supply</Label>
                    <h1 style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.025em", fontFamily: FM, marginBottom: "1rem" }}>
                        Bulk &amp; Institutional Orders
                    </h1>
                    <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.9, maxWidth: 520, margin: "0 auto", fontFamily: FO }}>
                        Premium steel furniture solutions for large-scale requirements.
                    </p>
                </div>
            </section>

            {/* SECTION 1 – INTRODUCTION */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 01</Label>
                    <SectionHeading>Introduction</SectionHeading>
                    <BodyText>
                        SANRA LIVING offers bulk supply solutions for residential projects, offices, institutions, and commercial spaces.
                    </BodyText>
                    <BodyText>
                        Backed by manufacturing expertise, we provide <strong style={{ color: "#111" }}>consistent quality</strong>, structural durability, and scalable production capabilities — all with the <strong style={{ color: "#111" }}>Direct Manufacturer Advantage</strong>.
                    </BodyText>
                </div>
            </section>

            <Divider />

            {/* SECTION 2 – WHO WE SERVE */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 02</Label>
                    <SectionHeading>Who We Serve</SectionHeading>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 1, background: "#E6E6E6" }}>
                        {[
                            { icon: "🏢", label: "Corporate Offices" },
                            { icon: "🏫", label: "Schools & Colleges" },
                            { icon: "🏠", label: "Builders & Developers" },
                            { icon: "🛏", label: "Hostels & PG Spaces" },
                        ].map((item) => (
                            <div key={item.label} style={{ background: "#fff", padding: "2rem 1.5rem", textAlign: "center" }}>
                                <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>{item.icon}</span>
                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, margin: 0 }}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 3 – WHY CHOOSE SANRA LIVING */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 03</Label>
                    <SectionHeading>Why Choose SANRA LIVING for Bulk</SectionHeading>
                    <BulletItem>Structural-grade steel fabrication — built for durability, not just aesthetics</BulletItem>
                    <BulletItem>Customisable dimensions based on design feasibility</BulletItem>
                    <BulletItem>Batch production with consistency across every unit</BulletItem>
                    <BulletItem>Direct Manufacturer Advantage — no middlemen, no unnecessary markups</BulletItem>
                    <BulletItem>Pan India logistics support with consolidated delivery options</BulletItem>
                </div>
            </section>

            <Divider />

            {/* SECTION 4 – PRODUCTION CAPACITY */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 04</Label>
                    <SectionHeading>Production Capacity</SectionHeading>
                    <BodyText>
                        Our production process allows controlled batch manufacturing with strict quality checks at each stage.
                    </BodyText>
                    <div style={{ padding: "1.25rem 1.5rem", background: "#fff", borderLeft: "3px solid #1C1C1C" }}>
                        <p style={{ fontSize: "0.9rem", color: "#444", fontFamily: FO, lineHeight: 1.8, margin: 0 }}>
                            For large orders, lead time will be shared after requirement evaluation. We do not make capacity commitments before reviewing your project scope.
                        </p>
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 5 – CUSTOMISATION POLICY */}
            <section style={{ background: "#fff", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <Label>Section 05</Label>
                    <SectionHeading>Customisation Policy</SectionHeading>
                    <BodyText>Customisation may be available for the following, subject to design feasibility and minimum order quantity:</BodyText>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "#E6E6E6" }}>
                        {[
                            { icon: "📐", label: "Size Adjustments", desc: "Dimensional changes based on your space requirements." },
                            { icon: "🎨", label: "Finish Options", desc: "Powder coat colour selection from available palette." },
                            { icon: "🔧", label: "Bulk-Specific Modifications", desc: "Structural tweaks evaluated on a case-by-case basis." },
                        ].map((item) => (
                            <div key={item.label} style={{ background: "#fff", padding: "1.5rem 1.25rem" }}>
                                <span style={{ fontSize: "1.25rem", display: "block", marginBottom: "0.625rem" }}>{item.icon}</span>
                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.375rem" }}>{item.label}</p>
                                <p style={{ fontSize: "0.78rem", color: "#777", fontFamily: FO, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Divider />

            {/* SECTION 6 – BULK ENQUIRY FORM */}
            <section style={{ background: "#F5F5F5", padding: "clamp(2.5rem, 6vw, 4rem) 1.5rem" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <Label>Section 06</Label>
                    <SectionHeading>Bulk Enquiry Form</SectionHeading>

                    {submitted ? (
                        /* SUCCESS STATE */
                        <div style={{ background: "#fff", border: "1px solid #E6E6E6", padding: "3rem 2rem", textAlign: "center" }}>
                            <div style={{ width: 48, height: 48, background: "#1C1C1C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M4 10l4 4 8-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111", fontFamily: FM, marginBottom: "0.625rem" }}>Enquiry Submitted</h3>
                            <p style={{ fontSize: "0.9rem", color: "#666", fontFamily: FO, lineHeight: 1.8, maxWidth: 380, margin: "0 auto 1.5rem" }}>
                                Thank you. Our team will review your requirements and respond within <strong style={{ color: "#111" }}>24–48 working hours</strong>.
                            </p>
                            <button
                                onClick={() => { setSubmitted(false); setForm({ company: "", contact: "", phone: "", email: "", location: "", product: "", quantity: "", message: "" }); }}
                                style={{ fontSize: "0.78rem", fontWeight: 700, color: "#888", fontFamily: FM, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                            >
                                Submit another enquiry
                            </button>
                        </div>
                    ) : (
                        /* FORM */
                        <div style={{ background: "#fff", border: "1px solid #E6E6E6", padding: "clamp(1.75rem, 4vw, 2.5rem)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                                <Field label="Company Name" placeholder="Your company or project name" value={form.company} onChange={set("company")} required />
                                <Field label="Contact Person" placeholder="Your full name" value={form.contact} onChange={set("contact")} required />
                                <Field label="Phone Number" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set("phone")} required />
                                <Field label="Email Address" type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} required />
                                <Field label="City / State" placeholder="e.g. Chennai, Tamil Nadu" value={form.location} onChange={set("location")} />
                                <Field label="Product Interested In" placeholder="e.g. Steel Shelving, Study Desks" value={form.product} onChange={set("product")} />
                                <Field label="Quantity Required" placeholder="e.g. 50 units" value={form.quantity} onChange={set("quantity")} />
                                <Field label="Message / Project Details" type="textarea" placeholder="Brief description of your project, requirement, or timeline..." value={form.message} onChange={set("message")} span />
                            </div>

                            {formError && (
                                <p style={{ fontSize: "0.82rem", color: "#c0392b", fontFamily: FO, marginBottom: "1rem", padding: "0.625rem 0.875rem", background: "#fdf2f2", borderLeft: "3px solid #c0392b" }}>
                                    {formError}
                                </p>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    background: loading ? "#555" : "#1C1C1C",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "0.82rem",
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontFamily: FM,
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    transition: "background 0.2s",
                                }}
                            >
                                {loading ? "Submitting..." : "Submit Bulk Enquiry"}
                            </button>

                            <p style={{ fontSize: "0.75rem", color: "#bbb", fontFamily: FO, marginTop: "0.875rem", textAlign: "center" }}>
                                Fields marked <span style={{ color: "#c0392b" }}>*</span> are required. We do not share your details with third parties.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION 7 – CONTACT NOTE */}
            <section style={{ background: "#1C1C1C", padding: "clamp(3rem, 7vw, 5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontFamily: FM, marginBottom: "1.25rem" }}>
                        Urgent Enquiries
                    </p>
                    <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "0.875rem" }}>
                        Contact Our Team Directly
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", fontFamily: FO, lineHeight: 1.8, marginBottom: "1.25rem" }}>
                        For urgent enquiries, reach out to us directly and we will get back to you as a priority.
                    </p>
                    <a href="mailto:support@sanraliving.com" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", fontFamily: FM, display: "block", marginBottom: "0.5rem", textDecoration: "none" }}>
                        support@sanraliving.com
                    </a>
                    <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontFamily: FO }}>
                        Response time: 24–48 working hours.
                    </p>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
