"use client";

import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

export default function BulkOrdersPage() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I%20need%20bulk%20order%20pricing%20for%20steel%20furniture.";

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* HERO */}
            <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "clamp(4rem, 10vw, 7rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#888", fontFamily: FM, marginBottom: "1.25rem" }}>
                        For Hotels, Hostels & Institutions
                    </p>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.025em", fontFamily: FM, marginBottom: "1.25rem" }}>
                        Bulk Orders Available
                    </h1>
                    <p style={{ fontSize: "1.0625rem", color: "#555", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 2.5rem", fontFamily: FO }}>
                        Contact us directly for bulk pricing and custom orders. We manufacture steel chairs, tables, and furniture sets for large-scale requirements.
                    </p>

                    {/* WhatsApp CTA */}
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.625rem",
                            padding: "1.125rem 2.5rem",
                            background: "#25D366", color: "#fff",
                            fontWeight: 700, fontSize: "0.9rem",
                            letterSpacing: "0.08em", textTransform: "uppercase",
                            textDecoration: "none", fontFamily: FM,
                            borderRadius: 4,
                            transition: "background 0.2s, transform 0.2s",
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat on WhatsApp
                    </a>

                    <p style={{ fontSize: "0.78rem", color: "#999", fontFamily: FO, marginTop: "1.25rem" }}>
                        📞 Or call: 9585745303 / 8300904920
                    </p>
                </div>
            </section>

            {/* WHY BULK */}
            <section style={{ background: "#F5F5F5", padding: "clamp(3rem, 7vw, 4.5rem) 1.5rem" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "1.5rem", textAlign: "center" }}>
                        Why Choose SANRA LIVING for Bulk
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {[
                            { icon: "🏭", title: "Direct from Factory", desc: "No middlemen. Best pricing." },
                            { icon: "🔧", title: "Custom Orders", desc: "Size & finish customization available." },
                            { icon: "🚚", title: "Pan India Delivery", desc: "Shipping across all states." },
                            { icon: "📄", title: "GST Invoice", desc: "Proper billing for businesses." },
                        ].map((item) => (
                            <div key={item.title} style={{ background: "#fff", padding: "1.5rem 1.25rem", border: "1px solid #E6E6E6" }}>
                                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.75rem" }}>{item.icon}</span>
                                <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111", fontFamily: FM, marginBottom: "0.375rem" }}>{item.title}</p>
                                <p style={{ fontSize: "0.82rem", color: "#666", fontFamily: FO, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section style={{ background: "#1C1C1C", padding: "clamp(3rem, 7vw, 5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontFamily: FM, marginBottom: "1rem" }}>
                        Ready to Order in Bulk?
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", fontFamily: FO, lineHeight: 1.8, marginBottom: "1.5rem" }}>
                        Send us your requirements on WhatsApp and we&apos;ll get back with pricing quickly.
                    </p>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            padding: "1rem 2.5rem",
                            background: "#25D366", color: "#fff",
                            fontWeight: 700, fontSize: "0.85rem",
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            textDecoration: "none", fontFamily: FM,
                            borderRadius: 4,
                        }}
                    >
                        💬 Chat on WhatsApp
                    </a>
                </div>
            </section>

            <SiteFooter />
            <WhatsAppFloat />
        </main>
    );
}
