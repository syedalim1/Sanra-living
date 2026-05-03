"use client";

import React from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import WhatsAppFloat from "./components/WhatsAppFloat";

/* ── Homepage Sections ── */
import HeroSection from "./components/home/HeroSection";
import CategoryGrid from "./components/home/CategoryGrid";
import FeaturedProducts from "./components/home/FeaturedProducts";
import CollectionShowcase from "./components/home/CollectionShowcase";
import ApplicationShowcase from "./components/home/ApplicationShowcase";

/* ═══════════════════════════════════════════════════════════════
   PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function Homepage() {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <SiteHeader />
      
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Visual Categories */}
      <CategoryGrid />

      {/* 3. Best Sellers Carousel */}
      <FeaturedProducts 
        title="Best Sellers" 
        filterBy="bestseller" 
        limit={12} 
      />

      {/* 4. New Arrivals Carousel */}
      <FeaturedProducts 
        title="New Arrivals" 
        filterBy="new" 
        limit={12} 
      />

      {/* 5. Price-based Collections */}
      <CollectionShowcase />

      {/* 6. Application/Space Showcase */}
      <ApplicationShowcase />

      {/* 7. TRUST BADGES STRIP (Why SANRA) */}
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
            { icon: "🛡️", text: "Strong Steel Build" },
            { icon: "✨", text: "Rust Resistant" },
            { icon: "⏳", text: "Long Lasting" },
            { icon: "🔧", text: "Low Maintenance" },
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

      {/* 8. WhatsApp / Bulk CTA section */}
      <section style={{ padding: "4rem 1.5rem", background: "#f0f0f0", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#111", fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif", marginBottom: "1rem" }}>
                  Need Bulk Orders or Custom Quotes?
              </h2>
              <p style={{ fontSize: "1rem", color: "#555", marginBottom: "2rem", fontFamily: "var(--font-outfit), Outfit, Inter, sans-serif" }}>
                  Get special pricing for commercial spaces, offices, and bulk home purchases directly via WhatsApp.
              </p>
              <a 
                  href="https://wa.me/8300904920" 
                  style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "1rem 2rem",
                      background: "#25D366",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      borderRadius: "0.5rem",
                      fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif",
                      transition: "transform 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1da851";
                      e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#25D366";
                      e.currentTarget.style.transform = "translateY(0)";
                  }}
              >
                  Contact on WhatsApp
              </a>
          </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}