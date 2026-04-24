"use client";

import React from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import WhatsAppFloat from "./components/WhatsAppFloat";

/* ── Homepage Sections ── */
import HeroSection from "./components/home/HeroSection";
import CategoryArchitecture from "./components/home/CategoryArchitecture";
import TrustBlock from "./components/home/TrustBlock";

/* ═══════════════════════════════════════════════════════════════
   PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function Homepage() {
  return (
    <div>
      <SiteHeader />
      <HeroSection />
      <CategoryArchitecture />
      <TrustBlock />

      {/* ── SEO CONTENT SECTION ─────────────────────────────── */}
      <section
        style={{
          background: "#FAFAF8",
          padding: "4rem 1.5rem",
          borderTop: "1px solid #eee",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#111",
              marginBottom: "1rem",
              lineHeight: 1.3,
            }}
          >
            Steel Chairs & Tables – Direct from Manufacturer
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            SANRA LIVING delivers high-quality steel chairs, tables, and
            furniture sets direct from our factory. We specialize in Jindal pipe
            steel furniture with strong welding, powder-coated finish, and
            long-lasting durability. Available for both retail and bulk orders
            across India.
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#111",
              marginBottom: "1rem",
              lineHeight: 1.3,
            }}
          >
            Bulk & Custom Steel Furniture
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: 1.8,
            }}
          >
            We provide bulk supply solutions for hotels, hostels, offices, and
            institutions. Contact us directly on WhatsApp for custom orders,
            bulk pricing, and fast delivery across Tamil Nadu, Kerala, and all
            major Indian states.
          </p>
        </div>
      </section>

      {/* ── TRUST BADGES STRIP ─────────────────────────────── */}
      <section style={{ background: "#1C1C1C", borderTop: "1px solid #333" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "1.75rem 1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          {[
            { icon: "🛡️", text: "10 Year Warranty" },
            { icon: "🏭", text: "Manufacturer Direct" },
            { icon: "📄", text: "GST Invoice" },
            { icon: "🚚", text: "Pan India Shipping" },
            { icon: "🔧", text: "Customization Available" },
          ].map((badge) => (
            <div
              key={badge.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0 0.5rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{badge.icon}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}