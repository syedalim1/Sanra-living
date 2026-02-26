"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./components/navbar";

/* ─────────────────────────────────────────────────────────────
   NAV  (no styled-jsx – uses Tailwind responsive classes)
───────────────────────────────────────────────────────────── */
<Navbar />

/* ─────────────────────────────────────────────────────────────
   SECTION 1 – HERO
───────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="sl-hero" style={{
      backgroundImage: "url('/images/HERO_BACKGROUND.png')",
      backgroundSize: "cover", backgroundPosition: "center",
    }}>
      <div className="sl-hero-overlay" />
      <div className="sl-container sl-hero-content" style={{ width: "100%" }}>
        {/* Mobile: items-center text-center | Desktop: items-start text-left */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left" style={{ maxWidth: 640, gap: "1.5rem" }}>

          <div className="flex items-center" style={{ gap: "0.75rem" }}>
            <div style={{ width: "2rem", height: "1.5px", background: "rgba(255,255,255,0.6)" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>Premium Steel Furniture</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.75rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#ffffff" }}>
            Engineered<br />Steel Living.
          </h1>

          <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", maxWidth: "420px" }}>
            Minimal steel furniture crafted for modern homes.
            Built for durability. Designed for everyday elegance.
          </p>

          <div className="flex flex-col sm:flex-row" style={{ gap: "1rem", width: "100%" }}>
            <Link href="/shop" className="sl-btn sl-btn-primary" style={{ flex: 1 }}>Shop Collection</Link>
            <Link href="/shop" className="sl-btn sl-btn-outline-white" style={{ flex: 1 }}>Explore Designs</Link>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start" style={{ gap: "1.25rem", paddingTop: "0.5rem" }}>
            {["10 Year Structural Warranty", "Pan India Shipping"].map((t) => (
              <span key={t} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
                  <path d="M3.5 6l1.75 1.75L8.5 4.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 2 – TRUST STRIP
───────────────────────────────────────────────────────────── */
const trustItems = [
  { icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.5"><path d="M11 2L3 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6L11 2z" strokeLinecap="round" strokeLinejoin="round" /><path d="M7.5 11l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>, title: "10 Year Structural Warranty", sub: "Engineered to outlast" },
  { icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.5"><rect x="2" y="5" width="18" height="14" rx="2" /><path d="M2 10h18" strokeLinecap="round" /></svg>, title: "Secure Payments + COD", sub: "Pay safely, your way" },
  { icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.5"><path d="M12 2H9a1 1 0 00-1 1v1H5a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-3V3a1 1 0 00-1-1z" strokeLinecap="round" /><path d="M8 12l2.5 2.5 3.5-4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>, title: "Easy Self Assembly", sub: "Bolt-together design" },
  { icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 21V12h4v9" strokeLinecap="round" strokeLinejoin="round" /></svg>, title: "Direct From Manufacturer", sub: "No middlemen, fair prices" },
];

function TrustStrip() {
  return (
    <div style={{ background: "#fff", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6", padding: "1.75rem 0" }}>
      <div className="sl-container">
        {/* 2-col on mobile → 4-col on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 0 }}>
          {trustItems.map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.375rem", padding: "0.75rem 1.5rem", borderRight: i < 3 ? "1px solid #E6E6E6" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                {item.icon}
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111" }}>{item.title}</span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#888", paddingLeft: "1.875rem" }}>{item.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 3 – FEATURED PRODUCT
───────────────────────────────────────────────────────────── */
function FeaturedProduct() {
  return (
    <section className="sl-section" style={{ background: "#F5F5F5" }}>
      <div className="sl-container">
        <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "2rem", height: "1.5px", background: "#555" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555" }}>Featured Product</span>
        </div>

        {/* 1-col mobile → 2-col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center" style={{ gap: "4rem" }}>

          {/* Image */}
          <div className="sl-product-img-wrap" style={{ borderRadius: "2px", aspectRatio: "4/5", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/FEATURED_PRODUCT.png"
              alt="SL Edge — Steel Entryway Organizer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "0.75rem" }}>SL EDGE SERIES</span>
              <h2 className="sl-heading-lg">SL Edge – Entryway<br />Steel Organizer</h2>
            </div>
            <p className="sl-body">A refined steel organizer engineered for compact urban spaces. Matte finish. Modular build. Clean silhouette.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {["Structural Steel Frame", "Premium Powder Coating", "10 Year Warranty"].map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem", color: "#333" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#1C1C1C" strokeWidth="1.2" /><path d="M5 8l2 2 4-4" stroke="#1C1C1C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontWeight: 500 }}>{feat}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingTop: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>₹2,499</span>
                <span style={{ fontSize: "0.8rem", color: "#888" }}>Inclusive of all taxes</span>
              </div>
              <div className="flex" style={{ gap: "0.875rem", flexWrap: "wrap" }}>
                <Link href="/shop/1" className="sl-btn sl-btn-primary">View Product</Link>
                <Link href="/shop" className="sl-btn sl-btn-outline" style={{ fontSize: "0.8rem" }}>All Products</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 4 – CATEGORY GRID
───────────────────────────────────────────────────────────── */
const categories = [
  { name: "Entryway Storage", sub: "First impression. Every day.", img: "/images/UTILITY_RACK.png", href: "/shop" },
  { name: "Study Desks", sub: "Where focus meets design.", img: "/images/STUDY_DESK.png", href: "/shop" },
  { name: "Wall Storage", sub: "Maximise every inch.", img: "/images/STEEL_CLOSE-UP_TEXTURE.png", href: "/shop" },
];

function CategoryGrid() {
  return (
    <section style={{ background: "#EBEBEB" }}>
      <div className="sl-container" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between" style={{ marginBottom: "2.5rem", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "0.5rem" }}>Categories</span>
            <h2 className="sl-heading-lg">Shop by Category</h2>
          </div>
          <Link href="/shop" className="sl-btn sl-btn-outline" style={{ fontSize: "0.8rem", alignSelf: "flex-start" }}>All Products</Link>
        </div>

        {/* 1-col mobile → 3-col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "1rem" }}>
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} style={{ textDecoration: "none" }}>
              <div className="sl-category-card" style={{ height: "440px", borderRadius: "2px", position: "relative" }}>
                <img src={cat.img} alt={cat.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div className="sl-category-overlay">
                  <div style={{ width: "100%", background: "rgba(0,0,0,0.6)", padding: "1rem 1.25rem", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{cat.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{cat.sub}</span>
                  </div>
                  <div className="sl-category-shop-btn sl-btn sl-btn-primary" style={{ marginTop: "0.75rem", width: "100%", fontSize: "0.78rem" }}>
                    Shop Now →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 5 – WHY SANRA LIVING
───────────────────────────────────────────────────────────── */
const pillars = [
  { icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5"><rect x="3" y="5" width="22" height="18" rx="1.5" /><path d="M3 10h22M10 10v13M18 10v13" strokeLinecap="round" /></svg>, title: "Structural-Grade Steel", desc: "Every product starts with certified structural steel — not decorative sheet metal." },
  { icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5"><path d="M14 3l2.5 5 5.5.8-4 3.9 1 5.4-5-2.6-5 2.6 1-5.4L6 8.8l5.5-.8L14 3z" strokeLinecap="round" strokeLinejoin="round" /></svg>, title: "Precision Fabrication", desc: "CNC-bent frames with welded joints engineered to tolerance, not approximation." },
  { icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5"><circle cx="14" cy="14" r="10" /><path d="M14 8v6l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>, title: "Built for 10 Years", desc: "Our structural warranty isn't a promise — it's a design specification." },
];

function WhySanra() {
  return (
    <section className="sl-section" style={{ background: "#F5F5F5", position: "relative", overflow: "hidden" }}>
      {/* Background texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/ABOUT_SECTION_BACKGROUND.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.06, pointerEvents: "none" }} />
      <div className="sl-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 4rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "0.75rem" }}>Built Different</span>
          <h2 className="sl-heading-lg" style={{ marginBottom: "1.25rem" }}>Not Just Furniture.<br />Engineered Living.</h2>
          <p className="sl-body">SANRA LIVING products are crafted using structural-grade steel and precision fabrication. Every piece is designed for long-term durability, minimal aesthetics, and intelligent space optimisation.</p>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111", marginTop: "1rem", letterSpacing: "0.02em" }}>We build for strength. We design for simplicity.</p>
        </div>

        {/* 1-col mobile → 3-col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "2px", background: "#E6E6E6", border: "2px solid #E6E6E6" }}>
          {pillars.map((p) => (
            <div key={p.title} style={{ background: "#fff", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ width: 52, height: 52, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px" }}>{p.icon}</div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111" }}>{p.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 6 – WARRANTY STRIP
───────────────────────────────────────────────────────────── */
function WarrantyStrip() {
  return (
    <section style={{ background: "#1C1C1C", padding: "80px 0" }}>
      <div className="sl-container">
        {/* Stack on mobile → side-by-side on desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between" style={{ gap: "3rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "2rem", height: "1.5px", background: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Our Commitment</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Built to Last<br />10 Years.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "480px" }}>
              Our structural warranty reflects the confidence we have in our engineering standards. Every weld. Every bend. Every bolt — tested to outlast expectations.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.5rem" }}>
            {/* Warranty badge image */}
            <div style={{ width: "100%", maxWidth: 240, borderRadius: 4, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/WARRANTY_DARK.png" alt="10 Year Warranty" style={{ width: "100%", display: "block", objectFit: "cover" }} />
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.15)", padding: "1.5rem 2rem", textAlign: "center", minWidth: "180px" }}>
              <div style={{ fontSize: "3rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>10</div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem", textTransform: "uppercase" }}>Year Warranty</div>
            </div>
            <Link href="/warranty" className="sl-btn sl-btn-outline-white" style={{ width: "100%", textAlign: "center" }}>Learn More</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────SECTION 7 – LAUNCH NOTE───────────────────────────────────────────────────────────── */
function LaunchNote() {
  return (
    <div style={{ background: "#F0EFED", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6", padding: "2.5rem 0", textAlign: "center" }}>
      <div className="sl-container">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555" }}>Now Available Online</span>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111", letterSpacing: "-0.01em" }}>Launching with limited stock.</p>
          <p style={{ fontSize: "0.9375rem", color: "#555", maxWidth: "440px", lineHeight: 1.6 }}>Experience premium steel living — now available online.</p>
          <Link href="/shop" className="sl-btn sl-btn-primary" style={{ marginTop: "0.5rem" }}>View Collection</Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 8 – INSTAGRAM PREVIEW
───────────────────────────────────────────────────────────── */
const instaImages = [
  "/images/UTILITY_RACK.png",
  "/images/STUDY_DESK.png",
  "/images/FEATURED_PRODUCT.png",
  "/images/STEEL_CLOSE-UP_TEXTURE.png",
];

function InstagramPreview() {
  return (
    <section className="sl-section" style={{ background: "#EFEFEF" }}>
      <div className="sl-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between" style={{ marginBottom: "2.5rem", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "0.5rem" }}>@sanraliving</span>
            <h2 className="sl-heading-lg">See SANRA LIVING<br />in Real Spaces.</h2>
          </div>
          <a href="https://instagram.com/sanraliving" target="_blank" rel="noopener noreferrer"
            className="sl-btn sl-btn-outline" style={{ fontSize: "0.8rem", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            Follow Us
          </a>
        </div>
        {/* 2-col mobile → 4-col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "0.625rem" }}>
          {instaImages.map((src, i) => (
            <div key={i} className="sl-insta-item" style={{ borderRadius: "2px" }}>
              <img src={src} alt={`SANRA LIVING space ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="sl-insta-overlay" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "#1C1C1C", color: "#d0d0d0" }}>
      <div className="sl-container" style={{ paddingTop: "64px" }}>
        {/* 2-col mobile → 4-col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "2.5rem", paddingBottom: "48px" }}>

          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>SANRA LIVING</div>
              <div style={{ fontSize: "0.6rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "0.25rem" }}>Engineered Steel Living</div>
            </div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>Premium structural-grade steel furniture for modern Indian homes.</p>
            <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.5rem" }}>
              {[
                <svg key="ig" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                <svg key="fb" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
              ].map((icon, i) => (
                <a key={i} href="#" style={{ width: 32, height: 32, borderRadius: "2px", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Shop</h4>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "1rem" }} />
            {["All Products", "Entryway Storage", "Study Desks", "Wall Storage", "Track Order", "Bulk Orders"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: "0.5rem" }}>{l}</a>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Support</h4>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "1rem" }} />
            {["Warranty", "Shipping & Replacement", "Terms & Privacy", "FAQ"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: "0.5rem" }}>{l}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Contact</h4>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "1rem" }} />
            {["support@sanraliving.com", "+91 83009 04920", "Mon–Sat, 10am–6pm"].map((l) => (
              <p key={l} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>{l}</p>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem 0", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.3)" }}>
            SANRA LIVING is a premium steel furniture brand by <span style={{ color: "rgba(255,255,255,0.5)" }}>Indian Make Steel Industries</span>.
          </p>
          <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.25)" }}>© {new Date().getFullYear()} SANRA LIVING. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function Homepage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <TrustStrip />
      <FeaturedProduct />
      <CategoryGrid />
      <WhySanra />
      <WarrantyStrip />
      <LaunchNote />
      <InstagramPreview />
      <Footer />
    </div>
  );
}