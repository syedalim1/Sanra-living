"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sl-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="sl-container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: scrolled ? "#111111" : "#ffffff",
                  textTransform: "uppercase",
                  transition: "color 0.3s",
                }}
              >
                SANRA LIVING
              </span>
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  color: scrolled ? "#555555" : "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  transition: "color 0.3s",
                }}
              >
                ENGINEERED STEEL LIVING
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {["Shop", "About", "Warranty", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: scrolled ? "#111111" : "rgba(255,255,255,0.9)",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/shop"
              className="sl-btn sl-btn-primary"
              style={{ padding: "0.6rem 1.5rem", fontSize: "0.75rem" }}
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "0.25rem",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: scrolled ? "#111" : "#fff",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "#ffffff",
              borderTop: "1px solid #e6e6e6",
              padding: "1.5rem 0",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {["Shop", "About", "Warranty", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#111111",
                  textDecoration: "none",
                  padding: "0.5rem 0",
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 1 – HERO
───────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="sl-hero"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="sl-hero-overlay" />
      <div className="sl-container sl-hero-content" style={{ width: "100%" }}>
        <div
          style={{
            maxWidth: "640px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
          className="hero-inner"
        >
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "2rem", height: "1.5px", background: "rgba(255,255,255,0.6)" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
              Premium Steel Furniture
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.75rem, 6vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            Engineered<br />Steel Living.
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.8)",
              maxWidth: "420px",
            }}
          >
            Minimal steel furniture crafted for modern homes.
            Built for durability. Designed for everyday elegance.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/shop" className="sl-btn sl-btn-primary" style={{ minWidth: "200px" }}>
              Shop Collection
            </Link>
            <Link href="/shop" className="sl-btn sl-btn-outline-white">
              Explore Designs
            </Link>
          </div>

          {/* Trust micro-text */}
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
            {["10 Year Structural Warranty", "Pan India Shipping"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.65)",
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
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

      <style jsx>{`
        @media (max-width: 768px) {
          .hero-inner {
            align-items: center;
            text-align: center;
          }
          .hero-inner h1 { text-align: center; }
          .hero-inner p { max-width: 100% !important; }
          .hero-inner > div:last-child { justify-content: center; }
          .hero-inner > div:nth-child(4) { justify-content: center; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 2 – TRUST STRIP
───────────────────────────────────────────────────────────── */
const trustItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.5">
        <path d="M11 2L3 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6L11 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 11l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "10 Year Structural Warranty",
    sub: "Engineered to outlast",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.5">
        <rect x="2" y="5" width="18" height="14" rx="2" strokeLinecap="round" />
        <path d="M6 5V4a2 2 0 014 0v1M12 5V4a2 2 0 014 0v1" strokeLinecap="round" />
        <path d="M2 10h18" strokeLinecap="round" />
      </svg>
    ),
    title: "Secure Payments + COD",
    sub: "Pay safely, your way",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.5">
        <path d="M12 2H9a1 1 0 00-1 1v1H5a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-3V3a1 1 0 00-1-1z" strokeLinecap="round" />
        <path d="M8 12l2.5 2.5 3.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Easy Self Assembly",
    sub: "Bolt-together design",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#555" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21V12h4v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Direct From Manufacturer",
    sub: "No middlemen, fair prices",
  },
];

function TrustStrip() {
  return (
    <div className="sl-trust-strip">
      <div className="sl-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
          }}
          className="trust-grid"
        >
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="sl-trust-item"
              style={{
                borderRight: i < 3 ? "1px solid #e6e6e6" : "none",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0.75rem 2rem",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                {item.icon}
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111", letterSpacing: "0.01em" }}>
                  {item.title}
                </span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#888", paddingLeft: "1.75rem" }}>
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
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
        {/* Label */}
        <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "2rem", height: "1.5px", background: "#555" }} />
          <span className="sl-label">Featured Product</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="product-grid"
        >
          {/* Left: Image */}
          <div
            className="sl-product-img-wrap"
            style={{ borderRadius: "2px", aspectRatio: "4/5", position: "relative" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&auto=format&fit=crop"
              alt="SL Edge – Entryway Steel Organizer"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right: Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div>
              <span className="sl-label" style={{ display: "block", marginBottom: "0.75rem" }}>
                SL EDGE SERIES
              </span>
              <h2 className="sl-heading-lg">
                SL Edge – Entryway<br />Steel Organizer
              </h2>
            </div>

            <p className="sl-body">
              A refined steel organizer engineered for compact urban spaces.
              Matte finish. Modular build. Clean silhouette.
            </p>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {["Structural Steel Frame", "Premium Powder Coating", "10 Year Warranty"].map((feat) => (
                <div key={feat} className="sl-check-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#1C1C1C" strokeWidth="1.2" />
                    <path d="M5 8l2 2 4-4" stroke="#1C1C1C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontWeight: 500, color: "#333" }}>{feat}</span>
                </div>
              ))}
            </div>

            {/* Price + CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingTop: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <span className="sl-price">₹2,499</span>
                <span style={{ fontSize: "0.8rem", color: "#888" }}>Inclusive of all taxes</span>
              </div>
              <div style={{ display: "flex", gap: "0.875rem" }}>
                <Link href="/shop" className="sl-btn sl-btn-primary">
                  View Product
                </Link>
                <Link href="/shop" className="sl-btn sl-btn-outline" style={{ fontSize: "0.8rem" }}>
                  All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 4 – CATEGORY GRID
───────────────────────────────────────────────────────────── */
const categories = [
  {
    name: "Entryway Storage",
    sub: "First impression. Every day.",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop",
    href: "/shop",
  },
  {
    name: "Study Desks",
    sub: "Where focus meets design.",
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80&auto=format&fit=crop",
    href: "/shop",
  },
  {
    name: "Wall Storage",
    sub: "Maximise every inch.",
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80&auto=format&fit=crop",
    href: "/shop",
  },
];

function CategoryGrid() {
  return (
    <section style={{ background: "#EBEBEB" }}>
      <div className="sl-container" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span className="sl-label" style={{ display: "block", marginBottom: "0.5rem" }}>
              Categories
            </span>
            <h2 className="sl-heading-lg">Shop by Category</h2>
          </div>
          <Link href="/shop" className="sl-btn sl-btn-outline" style={{ fontSize: "0.8rem" }}>
            All Products
          </Link>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
          className="cat-grid"
        >
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} style={{ textDecoration: "none" }}>
              <div className="sl-category-card" style={{ height: "440px", borderRadius: "2px" }}>
                <img
                  src={cat.img}
                  alt={cat.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div className="sl-category-overlay">
                  {/* Always visible label */}
                  <div
                    style={{
                      width: "100%",
                      background: "rgba(0,0,0,0.6)",
                      padding: "1rem 1.25rem",
                      borderRadius: "1px",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>
                      {cat.name}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{cat.sub}</span>
                  </div>
                  <div
                    className="sl-category-shop-btn sl-btn sl-btn-primary"
                    style={{ marginTop: "0.75rem", width: "100%", marginLeft: 0, fontSize: "0.78rem" }}
                  >
                    Shop Now →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .cat-grid { grid-template-columns: 1fr !important; }
          .cat-grid > * > div { height: 320px !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 5 – WHY SANRA LIVING
───────────────────────────────────────────────────────────── */
const pillars = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
        <rect x="3" y="5" width="22" height="18" rx="1.5" />
        <path d="M3 10h22M10 10v13M18 10v13" strokeLinecap="round" />
      </svg>
    ),
    title: "Structural-Grade Steel",
    desc: "Every product starts with certified structural steel — not decorative sheet metal.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
        <path d="M14 3l2.5 5 5.5.8-4 3.9 1 5.4-5-2.6-5 2.6 1-5.4L6 8.8l5.5-.8L14 3z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 22h20" strokeLinecap="round" />
        <path d="M7 22v3M21 22v3" strokeLinecap="round" />
      </svg>
    ),
    title: "Precision Fabrication",
    desc: "CNC-bent frames with welded joints engineered to tolerance, not approximation.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
        <circle cx="14" cy="14" r="10" />
        <path d="M14 8v6l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Built for 10 Years",
    desc: "Our structural warranty isn't a promise — it's a design specification.",
  },
];

function WhySanra() {
  return (
    <section className="sl-section" style={{ background: "#F5F5F5" }}>
      <div className="sl-container">
        {/* Centered header */}
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 4rem" }}>
          <span className="sl-label" style={{ display: "block", marginBottom: "0.75rem" }}>
            Built Different
          </span>
          <h2 className="sl-heading-lg" style={{ marginBottom: "1.25rem" }}>
            Not Just Furniture.<br />Engineered Living.
          </h2>
          <p className="sl-body">
            SANRA LIVING products are crafted using structural-grade steel and precision fabrication.
            Every piece is designed for long-term durability, minimal aesthetics, and intelligent space optimisation.
          </p>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111", marginTop: "1rem", letterSpacing: "0.02em" }}>
            We build for strength. We design for simplicity.
          </p>
        </div>

        {/* Three columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
            background: "#e6e6e6",
            border: "2px solid #e6e6e6",
          }}
          className="pillar-grid"
        >
          {pillars.map((p) => (
            <div
              key={p.title}
              style={{
                background: "#ffffff",
                padding: "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  background: "#F5F5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "2px",
                }}
              >
                {p.icon}
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111", letterSpacing: "0.01em" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .pillar-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 6 – WARRANTY STRIP
───────────────────────────────────────────────────────────── */
function WarrantyStrip() {
  return (
    <section className="sl-warranty-strip">
      <div className="sl-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: "3rem",
          }}
          className="warranty-inner"
        >
          {/* Left content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "2rem", height: "1.5px", background: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                Our Commitment
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Built to Last<br />10 Years.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "480px" }}>
              Our structural warranty reflects the confidence we have in our engineering standards.
              Every weld. Every bend. Every bolt — tested to outlast expectations.
            </p>
          </div>

          {/* Right CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.5rem" }}>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "1.5rem 2rem",
                textAlign: "center",
                minWidth: "180px",
              }}
            >
              <div style={{ fontSize: "3rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>10</div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem", textTransform: "uppercase" }}>
                Year Warranty
              </div>
            </div>
            <Link href="/warranty" className="sl-btn sl-btn-outline-white" style={{ width: "100%" }}>
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .warranty-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 7 – LAUNCH NOTE
───────────────────────────────────────────────────────────── */
function LaunchNote() {
  return (
    <div className="sl-launch-strip">
      <div className="sl-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.875rem",
          }}
        >
          <span className="sl-label">Now Available Online</span>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#111",
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          >
            Launching with limited stock.
          </p>
          <p style={{ fontSize: "0.9375rem", color: "#555", maxWidth: "440px", textAlign: "center", lineHeight: 1.6 }}>
            Experience premium steel living — now available online.
          </p>
          <Link href="/shop" className="sl-btn sl-btn-primary" style={{ marginTop: "0.5rem" }}>
            View Collection
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 8 – INSTAGRAM PREVIEW
───────────────────────────────────────────────────────────── */
const instaImages = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&auto=format&fit=crop",
];

function InstagramPreview() {
  return (
    <section className="sl-section" style={{ background: "#EFEFEF" }}>
      <div className="sl-container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="sl-label" style={{ display: "block", marginBottom: "0.5rem" }}>@sanraliving</span>
            <h2 className="sl-heading-lg">
              See SANRA LIVING<br />in Real Spaces.
            </h2>
          </div>
          <a
            href="https://instagram.com/sanraliving"
            target="_blank"
            rel="noopener noreferrer"
            className="sl-btn sl-btn-outline"
            style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.625rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Follow Us
          </a>
        </div>

        {/* 4-image grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.625rem",
          }}
          className="insta-grid"
        >
          {instaImages.map((src, i) => (
            <div key={i} className="sl-insta-item" style={{ borderRadius: "2px" }}>
              <img src={src} alt={`SANRA LIVING space ${i + 1}`} />
              <div className="sl-insta-overlay">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" style={{ opacity: 0, transition: "opacity 0.3s" }} className="insta-icon">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .insta-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .sl-insta-item:hover .insta-icon { opacity: 1 !important; }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
const footerCols = [
  {
    heading: null,
    brand: true,
    links: [],
  },
  {
    heading: "Shop",
    links: ["All Products", "Entryway Storage", "Study Desks", "Wall Storage", "Track Order", "Bulk Orders"],
  },
  {
    heading: "Support",
    links: ["Warranty", "Shipping & Replacement", "Terms & Privacy", "FAQ"],
  },
  {
    heading: "Contact",
    links: ["support@sanraliving.com", "+91 98765 43210", "Mon–Sat, 10am–6pm"],
  },
];

function Footer() {
  return (
    <footer className="sl-footer">
      <div className="sl-container" style={{ paddingTop: "64px", paddingBottom: "0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "3rem",
            paddingBottom: "48px",
          }}
          className="footer-grid"
        >
          {/* Brand col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                SANRA LIVING
              </div>
              <div style={{ fontSize: "0.6rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "0.25rem" }}>
                Engineered Steel Living
              </div>
            </div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "240px" }}>
              Premium structural-grade steel furniture for modern Indian homes.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.875rem", marginTop: "0.5rem" }}>
              {[
                <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                <svg key="fb" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
                <svg key="wa" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>,
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.5)",
                    transition: "all 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.4)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerCols.slice(1).map((col) => (
            <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <h4 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>
                {col.heading}
              </h4>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      fontSize: "0.82rem",
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.85)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")}
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "1.25rem 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.3)" }}>
            SANRA LIVING is a premium steel furniture brand by{" "}
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Indian Make Steel Industries</span>.
          </p>
          <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} SANRA LIVING. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE ASSEMBLY
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