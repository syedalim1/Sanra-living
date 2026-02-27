"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  category: string;
  image_url: string;
  is_active: boolean;
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 – HERO
   "Modular Steel Living. Engineered for Modern Spaces."
═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      className="sl-hero"
      style={{
        backgroundImage: "url('/images/HERO_BACKGROUND.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="sl-hero-overlay" />
      <div className="sl-container sl-hero-content" style={{ width: "100%" }}>
        <div
          className="flex flex-col items-center md:items-start text-center md:text-left"
          style={{ maxWidth: 680, gap: "1.75rem" }}
        >
          {/* Label */}
          <div className="flex items-center" style={{ gap: "0.75rem" }}>
            <div
              style={{
                width: "2.5rem",
                height: "1.5px",
                background: "rgba(255,255,255,0.5)",
              }}
            />
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.65)",
                textTransform: "uppercase",
              }}
            >
              Precision Steel Furniture
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 3.75rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "#ffffff",
            }}
          >
            Modular Steel Living.
            <br />
            <span style={{ color: "rgba(255,255,255,0.8)" }}>
              Engineered for Modern Spaces.
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.75)",
              maxWidth: "480px",
            }}
          >
            Precision-crafted dismantlable steel furniture for homes,
            workspaces, and commercial environments.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row"
            style={{ gap: "1rem", width: "100%", maxWidth: "400px" }}
          >
            <Link
              href="/shop"
              className="sl-btn sl-btn-primary"
              style={{ flex: 1 }}
            >
              Explore Collection
            </Link>
            <Link
              href="#categories"
              className="sl-btn sl-btn-outline-white"
              style={{ flex: 1 }}
            >
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 – CATEGORY ARCHITECTURE
   8 Strong Pillars — each category = ecosystem
═══════════════════════════════════════════════════════════════ */
const categoryPillars = [
  {
    name: "Seating",
    desc: "Chairs, stools & lounge systems",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 24v4M24 24v4M6 16v8h20v-8M10 16V8a2 2 0 012-2h8a2 2 0 012 2v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    href: "/shop/seating",
  },
  {
    name: "Tables",
    desc: "Dining, coffee & side tables",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="12" width="24" height="3" rx="1" strokeLinecap="round" />
        <path d="M7 15v12M25 15v12M4 12h24" strokeLinecap="round" />
      </svg>
    ),
    href: "/shop/tables",
  },
  {
    name: "Storage",
    desc: "Racks, shelves & organizers",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="4" width="22" height="24" rx="1.5" />
        <path d="M5 12h22M5 20h22M16 4v24" strokeLinecap="round" />
      </svg>
    ),
    href: "/shop/storage",
  },
  {
    name: "Bedroom",
    desc: "Beds, wardrobes & nightstands",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 24V14a2 2 0 012-2h20a2 2 0 012 2v10M4 24v3M28 24v3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12V8a2 2 0 012-2h12a2 2 0 012 2v4" strokeLinecap="round" />
        <path d="M4 19h24" strokeLinecap="round" />
      </svg>
    ),
    href: "/shop/bedroom",
  },
  {
    name: "Workspace",
    desc: "Desks, stands & office systems",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="10" width="24" height="3" rx="1" />
        <path d="M8 13v12M24 13v12M12 13v6h8v-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    href: "/shop/workspace",
  },
  {
    name: "Balcony & Outdoor",
    desc: "Garden, patio & terrace pieces",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="10" r="5" />
        <path d="M16 15v6M10 28l2-7h8l2 7M6 28h20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    href: "/shop/balcony-outdoor",
  },
  {
    name: "Modular Systems",
    desc: "Expandable, configurable units",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="10" height="10" rx="1.5" />
        <rect x="18" y="4" width="10" height="10" rx="1.5" />
        <rect x="4" y="18" width="10" height="10" rx="1.5" />
        <rect x="18" y="18" width="10" height="10" rx="1.5" strokeDasharray="3 2" />
      </svg>
    ),
    href: "/shop/modular",
  },
  {
    name: "CNC & Custom",
    desc: "Bespoke fabrication & design",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 4v4M16 24v4M4 16h4M24 16h4" strokeLinecap="round" />
        <circle cx="16" cy="16" r="6" />
        <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
    href: "/shop/cnc-decor",
  },
];

function CategoryArchitecture() {
  return (
    <section
      id="categories"
      className="sl-section"
      style={{ background: "#FFFFFF" }}
    >
      <div className="sl-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div
            className="flex items-center justify-center"
            style={{ gap: "0.75rem", marginBottom: "1rem" }}
          >
            <div
              style={{ width: "2rem", height: "1.5px", background: "#ccc" }}
            />
            <span className="sl-label">Our Ecosystem</span>
            <div
              style={{ width: "2rem", height: "1.5px", background: "#ccc" }}
            />
          </div>
          <h2 className="sl-heading-lg">
            Shop by Category
          </h2>
          <p
            className="sl-body"
            style={{ maxWidth: 520, margin: "1rem auto 0" }}
          >
            Eight foundational pillars — each designed to grow with your space
            and evolve with your needs.
          </p>
        </div>

        {/* 8 Pillars Grid: 2-col mobile → 4-col desktop */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: "1rem" }}
        >
          {categoryPillars.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="hp-cat-card"
              style={{ textDecoration: "none" }}
            >
              <div className="hp-cat-icon">{cat.icon}</div>
              <h3 className="hp-cat-name">{cat.name}</h3>
              <p className="hp-cat-desc">{cat.desc}</p>
              <span className="hp-cat-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 – DESIGN PHILOSOPHY
   "Built on Structural Integrity."
═══════════════════════════════════════════════════════════════ */
const philosophyPillars = [
  {
    stat: "1.2mm",
    title: "Steel Frames",
    desc: "Structural-grade steel tubing for unmatched load-bearing strength.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <path d="M3 12h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    stat: "CNC",
    title: "Precision Cutting",
    desc: "Computer-controlled cutting for exact dimensions and clean edges.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    stat: "Matte",
    title: "Powder Coating",
    desc: "Textured matte finish that resists scratches, rust, and UV damage.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
        <path d="M12 2l2 4h4l-3 3 1.5 4.5L12 11l-4.5 2.5L9 9l-3-3h4l2-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    stat: "Flat Pack",
    title: "Engineered Systems",
    desc: "Bolt-together assembly designed for easy transport and setup.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
];

function DesignPhilosophy() {
  return (
    <section
      style={{
        background: "#1C1C1C",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/STEEL_CLOSE-UP_TEXTURE.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />
      <div
        className="sl-container sl-section"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between"
          style={{ marginBottom: "3.5rem", gap: "1.5rem" }}
        >
          <div>
            <div
              className="flex items-center"
              style={{ gap: "0.75rem", marginBottom: "1rem" }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "1.5px",
                  background: "rgba(255,255,255,0.35)",
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Design Philosophy
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Built on Structural
              <br />
              Integrity.
            </h2>
          </div>
          <p
            style={{
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: 380,
            }}
          >
            Every Sanra product is engineered from the ground up — materials,
            process, and finish — to meet structural standards, not just
            aesthetic ones.
          </p>
        </div>

        {/* 4 Pillars: 1-col mobile → 4-col desktop */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: "1px", background: "rgba(255,255,255,0.08)" }}
        >
          {philosophyPillars.map((p) => (
            <div
              key={p.title}
              className="hp-philosophy-card"
            >
              <div className="hp-philosophy-icon">{p.icon}</div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                {p.stat}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.85)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {p.title}
              </div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.6,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 – FEATURED COLLECTIONS
   "Featured Systems" — 6 representative products from DB
═══════════════════════════════════════════════════════════════ */
function FeaturedCollections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const active = data.filter((p) => p.is_active);
        setProducts(active.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="sl-section" style={{ background: "#F5F5F5" }}>
      <div className="sl-container">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between"
          style={{ marginBottom: "3rem", gap: "1rem" }}
        >
          <div>
            <div
              className="flex items-center"
              style={{ gap: "0.75rem", marginBottom: "0.75rem" }}
            >
              <div
                style={{ width: "2rem", height: "1.5px", background: "#bbb" }}
              />
              <span className="sl-label">Curated Selection</span>
            </div>
            <h2 className="sl-heading-lg">Featured Systems</h2>
          </div>
          <Link
            href="/shop"
            className="sl-btn sl-btn-outline"
            style={{ fontSize: "0.8rem", alignSelf: "flex-start" }}
          >
            View All →
          </Link>
        </div>

        {/* Product Grid: 2-col mobile → 3-col desktop */}
        {loading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3"
            style={{ gap: "1rem" }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#E9E9E7",
                  aspectRatio: "3/4",
                  borderRadius: "2px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3"
            style={{ gap: "1rem" }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="hp-product-card"
                style={{ textDecoration: "none" }}
              >
                <div className="hp-product-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_url || "/images/FEATURED_PRODUCT.png"}
                    alt={product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="hp-product-info">
                  <span className="hp-product-category">
                    {product.category}
                  </span>
                  <h3 className="hp-product-title">{product.title}</h3>
                  <span className="hp-product-price">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 – MODULAR EXPANSION
   "Designed to Expand with Your Space."
═══════════════════════════════════════════════════════════════ */
function ModularExpansion() {
  return (
    <section className="sl-section" style={{ background: "#FFFFFF" }}>
      <div className="sl-container">
        <div
          className="grid grid-cols-1 md:grid-cols-2 items-center"
          style={{ gap: "4rem" }}
        >
          {/* Visual */}
          <div
            style={{
              position: "relative",
              aspectRatio: "4/3",
              borderRadius: "2px",
              overflow: "hidden",
              background: "#E9E9E7",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ABOUT_SECTION_BACKGROUND.png"
              alt="Modular furniture system"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Overlay badge */}
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1.5rem",
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="5" height="5" rx="1" />
                <rect x="11" y="2" width="5" height="5" rx="1" />
                <rect x="2" y="11" width="5" height="5" rx="1" />
                <path d="M13.5 11v5M11 13.5h5" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Expandable Systems
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              className="flex items-center"
              style={{ gap: "0.75rem" }}
            >
              <div
                style={{ width: "2rem", height: "1.5px", background: "#ccc" }}
              />
              <span className="sl-label">Future-Ready Design</span>
            </div>
            <h2 className="sl-heading-lg">
              Designed to Expand
              <br />
              with Your Space.
            </h2>
            <p className="sl-body" style={{ maxWidth: 440 }}>
              Every Sanra product is part of a modular ecosystem. Start with a
              single unit and expand over time — same finish, same system, same
              structural language.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
                paddingTop: "0.5rem",
              }}
            >
              {[
                "Mix-and-match modules within any category",
                "Consistent finishes across all product lines",
                "Add-on components available for every system",
                "Zero redesign — your space grows with you",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.625rem",
                    fontSize: "0.875rem",
                    color: "#444",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ marginTop: "0.15rem", flexShrink: 0 }}
                  >
                    <circle cx="8" cy="8" r="7" stroke="#1C1C1C" strokeWidth="1.2" />
                    <path
                      d="M5 8l2 2 4-4"
                      stroke="#1C1C1C"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ paddingTop: "0.5rem" }}>
              <Link href="/shop" className="sl-btn sl-btn-primary">
                Explore Modular Systems
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 – COMMERCIAL SOLUTIONS
   Institutions & Bulk Buyers
═══════════════════════════════════════════════════════════════ */
function CommercialSolutions() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0F0F0F 0%, #1C1C1C 50%, #2A2A2A 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        className="sl-container sl-section"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          className="flex flex-col md:flex-row md:items-center"
          style={{ gap: "4rem" }}
        >
          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div className="flex items-center" style={{ gap: "0.75rem" }}>
              <div
                style={{
                  width: "2rem",
                  height: "1.5px",
                  background: "rgba(255,255,255,0.35)",
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                For Institutions
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Commercial &<br />
              Bulk Solutions.
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                maxWidth: 420,
              }}
            >
              Outfit offices, co-working spaces, hostels, hospitals, and
              institutional environments. Direct from manufacturer — at scale.
            </p>

            {/* Commercial highlights */}
            <div
              className="grid grid-cols-2"
              style={{ gap: "1rem", paddingTop: "0.5rem" }}
            >
              {[
                { label: "Custom Configurations", icon: "⚙️" },
                { label: "Volume Pricing", icon: "📦" },
                { label: "Project Consultation", icon: "📐" },
                { label: "Pan-India Delivery", icon: "🚚" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex flex-col sm:flex-row"
              style={{ gap: "1rem", paddingTop: "0.5rem" }}
            >
              <Link href="/bulk-orders" className="sl-btn sl-btn-primary">
                Request Bulk Quote
              </Link>
              <Link href="/contact" className="sl-btn sl-btn-outline-white">
                Talk to Our Team
              </Link>
            </div>
          </div>

          {/* Stats side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              minWidth: "260px",
            }}
          >
            {[
              { num: "500+", label: "Units Delivered" },
              { num: "50+", label: "Institutional Projects" },
              { num: "Pan India", label: "Shipping Coverage" },
              { num: "Direct", label: "From Manufacturer" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "1.5rem 2rem",
                  background: "rgba(255,255,255,0.03)",
                  borderLeft: "3px solid rgba(255,255,255,0.12)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.num}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: "0.15rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7 – TRUST BLOCK
   Warranty · Made by Manufacturer · Shipping · Precision
═══════════════════════════════════════════════════════════════ */
const trustBlocks = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
        <path d="M14 3L5 7.5v6.5c0 5.5 3.8 10.6 9 12 5.2-1.4 9-6.5 9-12V7.5L14 3z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 14l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "10 Year Structural Warranty",
    desc: "Engineered to outlast. Every weld and joint backed by our decade-long warranty.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
        <path d="M3 9l11-7 11 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 21V14h8v7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Made by Manufacturer",
    desc: "No middlemen. Direct from our fabrication facility to your door — honest pricing.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
        <rect x="2" y="8" width="16" height="12" rx="1.5" />
        <path d="M18 12h4.5a2 2 0 011.8 1.1l1.5 3a.5.5 0 01.2.4V22a1 1 0 01-1 1h-1" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="23" r="2" />
        <circle cx="22" cy="23" r="2" />
      </svg>
    ),
    title: "Pan India Shipping",
    desc: "Reliable delivery across India. Securely packed flat-pack systems, ready to assemble.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1C1C1C" strokeWidth="1.5">
        <circle cx="14" cy="14" r="5" />
        <path d="M14 3v4M14 21v4M3 14h4M21 14h4M6.1 6.1l2.8 2.8M19.1 19.1l2.8 2.8M6.1 21.9l2.8-2.8M19.1 8.9l2.8-2.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Precision Fabrication",
    desc: "CNC-bent frames with welded joints engineered to tolerance, not approximation.",
  },
];

function TrustBlock() {
  return (
    <section style={{ background: "#F5F5F5", borderTop: "1px solid #E6E6E6" }}>
      <div className="sl-container" style={{ padding: "4.5rem 1.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="sl-label" style={{ display: "block", marginBottom: "0.75rem" }}>
            Why Choose Sanra
          </span>
          <h2 className="sl-heading-lg">Built on Trust.</h2>
        </div>

        {/* 4 block grid: 1-col mobile → 2-col tablet → 4-col desktop */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: "1.5rem" }}
        >
          {trustBlocks.map((block) => (
            <div key={block.title} className="hp-trust-card">
              <div className="hp-trust-icon">{block.icon}</div>
              <h3
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: "0.5rem",
                }}
              >
                {block.title}
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#777",
                  lineHeight: 1.6,
                }}
              >
                {block.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      <SiteFooter />
    </div>
  );
}