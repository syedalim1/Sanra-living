"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order") || "N/A";

    return (
        <div style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO, display: "flex", flexDirection: "column" }}>
            <SiteHeader />

            <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
                <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>

                    {/* Success Icon */}
                    <div style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: "#ECFDF5", border: "3px solid #10B981",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 2rem",
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h1 style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: FM, color: "#111", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                        Order Placed!
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem", lineHeight: 1.6 }}>
                        Thank you for your order. Your payment has been received and your order is now being processed.
                    </p>

                    {/* Order Number Card */}
                    <div style={{
                        background: "#fff", padding: "2rem", borderRadius: "8px",
                        border: "1px solid #E6E6E6", marginBottom: "2rem",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                    }}>
                        <p style={{ fontSize: "0.85rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: FM, fontWeight: 600, marginBottom: "0.5rem" }}>
                            Order Number
                        </p>
                        <p style={{ fontSize: "2rem", fontWeight: 900, color: "#111", fontFamily: FM, letterSpacing: "0.05em", margin: 0 }}>
                            {orderNumber}
                        </p>
                    </div>

                    {/* What's Next */}
                    <div style={{
                        background: "#fff", padding: "1.75rem", borderRadius: "8px",
                        border: "1px solid #E6E6E6", marginBottom: "2rem", textAlign: "left",
                    }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: FM, color: "#111", marginBottom: "1rem" }}>What happens next?</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {[
                                { icon: "📦", text: "We'll start packing your order right away" },
                                { icon: "📱", text: "You'll receive a WhatsApp update with tracking details" },
                                { icon: "🚚", text: "Your order will be delivered within 5–7 business days" },
                            ].map((step) => (
                                <div key={step.text} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <span style={{ fontSize: "1.25rem" }}>{step.icon}</span>
                                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#444", fontFamily: FO }}>{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTAs */}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/shop" style={{
                            padding: "1rem 2rem", background: "#111", color: "#fff",
                            textDecoration: "none", fontWeight: 800, fontFamily: FM,
                            borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "1rem",
                        }}>
                            Continue Shopping
                        </Link>
                        <Link href={`https://wa.me/8300904920?text=Hi!%20I%20just%20placed%20order%20${orderNumber}.%20Can%20you%20confirm?`} target="_blank" style={{
                            padding: "1rem 2rem", background: "#25D366", color: "#fff",
                            textDecoration: "none", fontWeight: 800, fontFamily: FM,
                            borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "1rem",
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                        }}>
                            💬 Chat on WhatsApp
                        </Link>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading...</p>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
