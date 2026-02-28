"use client";

import React from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import WhatsAppFloat from "./components/WhatsAppFloat";

/* ── Homepage Sections ── */
import HeroSection from "./components/home/HeroSection";
import CategoryArchitecture from "./components/home/CategoryArchitecture";
import DesignPhilosophy from "./components/home/DesignPhilosophy";
import FeaturedCollections from "./components/home/FeaturedCollections";
import ModularExpansion from "./components/home/ModularExpansion";
import CommercialSolutions from "./components/home/CommercialSolutions";
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
      <DesignPhilosophy />
      <FeaturedCollections />
      <ModularExpansion />
      <CommercialSolutions />
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
            Modern Steel Furniture for Every Space
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            From affordable steel furniture to ultra-luxury signature
            collections, SANRA LIVING delivers multiple models, styles, sizes
            and price ranges. We specialize in powder-coated steel furniture
            designed for durability, elegance and long-term performance. Our
            collection includes modern shoe racks, tables, chairs, balcony
            furniture, modular storage systems and designer industrial furniture
            crafted with high-quality steel and premium finishes.
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
            State-Wise Shipping Across India
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            We offer optimized state-wise shipping including Tamil Nadu, Kerala
            and all major Indian states. Safe packaging, parcel-friendly designs
            and reliable delivery ensure damage-free transportation of your
            premium steel furniture.
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
            Custom &amp; Bulk Steel Furniture Solutions
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: 1.8,
            }}
          >
            We provide custom steel furniture manufacturing and bulk supply
            solutions for interior designers, office projects and reseller
            partners across India. Whether you need a single bespoke piece or
            large-volume orders, SANRA LIVING delivers premium quality with
            competitive pricing.
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
            { icon: "🔒", text: "Secure Payment" },
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