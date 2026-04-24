"use client";

import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

export default function ContactPage() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I%20have%20a%20question%20about%20SANRA%20LIVING%20furniture.";

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── PAGE TITLE ── */}
            <section style={{ background: "#fff", padding: "clamp(3.5rem, 8vw, 5.5rem) 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <p style={{
                        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em",
                        textTransform: "uppercase", color: "#888", fontFamily: FM,
                        marginBottom: "1rem",
                    }}>
                        Get In Touch
                    </p>
                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3rem)",
                        fontWeight: 900, color: "#111",
                        lineHeight: 1.1, letterSpacing: "-0.025em",
                        fontFamily: FM, marginBottom: "1rem",
                    }}>
                        Contact Us
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "#666", lineHeight: 1.8, fontFamily: FO, margin: 0 }}>
                        Reach us directly on WhatsApp for the fastest response.
                    </p>
                </div>
            </section>

            {/* ── CONTACT INFO ── */}
            <section style={{ padding: "clamp(3rem, 7vw, 5rem) 1.5rem" }}>
                <div style={{
                    maxWidth: 800, margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1.5rem",
                }}>

                    {/* WhatsApp Card */}
                    <div style={{
                        background: "#fff", border: "1px solid #E6E6E6",
                        padding: "2.5rem 2rem", textAlign: "center",
                    }}>
                        <div style={{
                            width: 64, height: 64,
                            background: "#25D366", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1.25rem",
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FM, marginBottom: "0.75rem" }}>
                            WhatsApp
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#555", fontFamily: FO, marginBottom: "1.5rem", lineHeight: 1.6 }}>
                            Fastest way to reach us. Get instant response.
                        </p>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                padding: "0.875rem 2rem",
                                background: "#25D366", color: "#fff",
                                fontWeight: 700, fontSize: "0.82rem",
                                letterSpacing: "0.1em", textTransform: "uppercase",
                                textDecoration: "none", fontFamily: FM,
                                borderRadius: 4,
                            }}
                        >
                            Chat Now
                        </a>
                    </div>

                    {/* Phone Card */}
                    <div style={{
                        background: "#fff", border: "1px solid #E6E6E6",
                        padding: "2.5rem 2rem", textAlign: "center",
                    }}>
                        <div style={{
                            width: 64, height: 64,
                            background: "#1C1C1C", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1.25rem",
                            fontSize: "1.5rem",
                        }}>
                            📞
                        </div>
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FM, marginBottom: "0.75rem" }}>
                            Phone
                        </p>
                        <p style={{ fontSize: "1.1rem", color: "#111", fontFamily: FM, fontWeight: 700, marginBottom: "0.375rem" }}>
                            9585745303
                        </p>
                        <p style={{ fontSize: "1.1rem", color: "#111", fontFamily: FM, fontWeight: 700, marginBottom: "0.75rem" }}>
                            8300904920
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "#888", fontFamily: FO }}>
                            Mon – Sat, 10 AM – 6 PM
                        </p>
                    </div>

                    {/* Address Card */}
                    <div style={{
                        background: "#fff", border: "1px solid #E6E6E6",
                        padding: "2.5rem 2rem", textAlign: "center",
                    }}>
                        <div style={{
                            width: 64, height: 64,
                            background: "#1C1C1C", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1.25rem",
                            fontSize: "1.5rem",
                        }}>
                            📍
                        </div>
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FM, marginBottom: "0.75rem" }}>
                            Address
                        </p>
                        <div style={{ fontSize: "0.9rem", color: "#555", fontFamily: FO, lineHeight: 1.8 }}>
                            <p style={{ margin: "0 0 0.125rem" }}>NO.K-6, SIDCO, Kurichi,</p>
                            <p style={{ margin: "0 0 0.125rem" }}>SIDCO Industrial Estate,</p>
                            <p style={{ margin: "0 0 0.75rem" }}>Coimbatore, Tamil Nadu – 641021</p>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "#888", fontFamily: FO }}>
                            <strong style={{ color: "#555" }}>GSTIN:</strong> 33FAXPM0581G1ZC
                        </p>
                    </div>
                </div>
            </section>

            <SiteFooter />
            <WhatsAppFloat />
        </main>
    );
}
