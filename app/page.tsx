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

      {/* 1.5. TRUST BADGES STRIP */}
      <section style={{ background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          {[
            { icon: "🏭", text: "Premium Jindal Steel" },
            { icon: "🛡️", text: "10 Year Warranty" },
            { icon: "🚚", text: "Pan India Delivery" },
            { icon: "💳", text: "Secure Payments" },
            { icon: "🇮🇳", text: "Made in Coimbatore" },
          ].map((badge) => (
            <div
              key={badge.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{badge.icon}</span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#555",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif",
                }}
              >
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </section>

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

      {/* 6.5. Factory/Workshop Section */}
      <section style={{ display: "flex", flexWrap: "wrap", background: "#111", color: "#fff" }}>
        <div style={{ flex: "1 1 50%", minWidth: "300px", position: "relative" }}>
            <img 
                src="https://images.unsplash.com/photo-1565615833203-8dce288b20ce?w=800&q=80" 
                alt="Sanra Steel Factory" 
                style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "500px", filter: "grayscale(100%) contrast(1.2)" }} 
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
        </div>
        <div style={{ flex: "1 1 50%", padding: "clamp(4rem, 8vw, 8rem) clamp(2rem, 8vw, 6rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif", color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
                Forged in Excellence.<br />Crafted in Coimbatore.
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#ccc", fontFamily: "var(--font-outfit), Outfit, Inter, sans-serif", marginBottom: "3rem", lineHeight: 1.6, maxWidth: "500px" }}>
                Our state-of-the-art manufacturing facility combines traditional craftsmanship with precision engineering. We use only premium Jindal Steel to create furniture that lasts generations.
            </p>
            <div style={{ display: "flex", gap: "3rem" }}>
                <div>
                    <h4 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif", color: "#fff", marginBottom: "0.25rem" }}>15+</h4>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 600, fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif" }}>Years Expertise</p>
                </div>
                <div>
                    <h4 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif", color: "#fff", marginBottom: "0.25rem" }}>10k+</h4>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 600, fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif" }}>Happy Homes</p>
                </div>
            </div>
        </div>
      </section>

      {/* 8. WhatsApp / Bulk CTA section */}
      <section style={{ padding: "6rem 1.5rem", background: "#F5F5F5", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111", fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
                  Need Bulk Orders or Custom Quotes?
              </h2>
              <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "3rem", fontFamily: "var(--font-outfit), Outfit, Inter, sans-serif", maxWidth: "600px", margin: "0 auto 3rem" }}>
                  Get special pricing for commercial spaces, offices, and bulk home purchases directly via WhatsApp.
              </p>
              <a 
                  href="https://wa.me/8300904920" 
                  style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "1.25rem 3rem",
                      background: "#111",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      borderRadius: "40px",
                      fontFamily: "var(--font-montserrat), Montserrat, Inter, sans-serif",
                      transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
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