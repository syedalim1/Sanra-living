"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ── DATA ─────────────────────────────────────────────────── */

const products = [
    {
        id: 1, title: "SL Edge", subtitle: "Entryway Steel Organizer", price: 2499, category: "Entryway Storage", finish: "Matte Charcoal Black", stock: "In Stock", stockQty: 12,
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85",
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=85",
        ],
        description: "SL Edge is designed for modern entryways and compact homes. Crafted from structural-grade steel and finished in matte powder coating, it delivers durability without compromising aesthetics. Every joint is precision-welded, every angle calculated.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "1.2 mm", Finish: "Matte Charcoal Black", "Load Capacity": "25 kg", Dimensions: "120 × 35 × 30 cm (H×W×D)", Weight: "6.5 kg" },
        relatedIds: [2, 4, 7],
    },
    {
        id: 2, title: "SL Apex", subtitle: "Wall-Mount Study Desk", price: 5499, category: "Study Desks", finish: "Graphite Grey", stock: "Only 12 Left", stockQty: 12,
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=85",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=85",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=85",
            "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85",
        ],
        description: "SL Apex wall-mount desk transforms any vertical wall into a functional workspace. Engineered from 1.5mm structural steel with a graphite grey finish, it folds flat when not in use and supports up to 40kg at full extension.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "1.5 mm", Finish: "Graphite Grey", "Load Capacity": "40 kg", Dimensions: "75 × 90 × 45 cm (H×W×D)", Weight: "9.2 kg" },
        relatedIds: [5, 9, 6],
    },
    {
        id: 3, title: "SL Vault", subtitle: "Modular Wall Storage System", price: 8999, category: "Wall Storage", finish: "Matte Black", stock: "In Stock", stockQty: 20,
        images: [
            "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=85",
            "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&q=85",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=85",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85",
        ],
        description: "SL Vault is a fully modular wall storage system designed for living rooms, studies, and offices. Mix and match panels, shelves, and hooks to create a configuration that fits exactly your space.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "1.5 mm", Finish: "Matte Black", "Load Capacity": "60 kg total", Dimensions: "200 × 120 × 25 cm (H×W×D)", Weight: "18 kg" },
        relatedIds: [6, 8, 4],
    },
    {
        id: 4, title: "SL Crest", subtitle: "Steel Magazine & Key Holder", price: 1299, category: "Entryway Storage", finish: "Graphite Grey", stock: "New", stockQty: 30,
        images: [
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=85",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85",
        ],
        description: "SL Crest is a compact entryway essential — magazine rack, key hooks, and mail organiser all in one clean steel frame. Wall-mounted design keeps your entry clutter-free without taking up floor space.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "1.0 mm", Finish: "Graphite Grey", "Load Capacity": "5 kg", Dimensions: "45 × 30 × 12 cm (H×W×D)", Weight: "1.8 kg" },
        relatedIds: [1, 7, 2],
    },
    {
        id: 5, title: "SL Slate", subtitle: "Standing Study Desk – Height Adjust", price: 12999, category: "Study Desks", finish: "Matte Black", stock: "Only 3 Left", stockQty: 3,
        images: [
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=85",
            "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=85",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=85",
        ],
        description: "SL Slate is a height-adjustable standing desk engineered for long work sessions. The dual-column steel frame supports a 25mm steel top, adjustable from sitting to standing height with a smooth hand crank mechanism.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "2.0 mm", Finish: "Matte Black", "Load Capacity": "80 kg", Dimensions: "72–118 × 140 × 70 cm (H×W×D)", Weight: "28 kg" },
        relatedIds: [2, 9, 3],
    },
    {
        id: 6, title: "SL Grid", subtitle: "Pegboard Wall Storage", price: 3499, category: "Wall Storage", finish: "Graphite Grey", stock: "In Stock", stockQty: 25,
        images: [
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=85",
            "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=85",
            "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&q=85",
        ],
        description: "SL Grid is a perforated steel pegboard system that turns any wall into an organised, customisable storage surface. Compatible with the full SANRA LIVING accessory range — hooks, shelves, and baskets.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "1.2 mm", Finish: "Graphite Grey", "Load Capacity": "30 kg", Dimensions: "90 × 60 cm panel", Weight: "4.2 kg" },
        relatedIds: [3, 8, 4],
    },
    {
        id: 7, title: "SL Mono", subtitle: "Minimalist Entryway Shelf", price: 1899, category: "Entryway Storage", finish: "Matte Black", stock: "Limited", stockQty: 8,
        images: [
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=85",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=85",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85",
        ],
        description: "SL Mono is a single-shelf floating steel shelf designed for pure simplicity. No hardware visible from the front. Just a clean steel surface, perfectly level, endlessly versatile.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "1.0 mm", Finish: "Matte Black", "Load Capacity": "15 kg", Dimensions: "12 × 80 × 20 cm (H×W×D)", Weight: "2.1 kg" },
        relatedIds: [1, 4, 6],
    },
    {
        id: 8, title: "SL Frame", subtitle: "Wall Display Frame Storage", price: 6299, category: "Wall Storage", finish: "Graphite Grey", stock: "In Stock", stockQty: 15,
        images: [
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=85",
            "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800&q=85",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85",
            "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=85",
        ],
        description: "SL Frame combines display and storage in a single wall-mounted steel frame. Six sections of variable depth allow you to display plants, books, and objects — all within a single architectural composition.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "1.5 mm", Finish: "Graphite Grey", "Load Capacity": "35 kg", Dimensions: "100 × 80 × 20 cm (H×W×D)", Weight: "7.8 kg" },
        relatedIds: [3, 6, 9],
    },
    {
        id: 9, title: "SL Pro Desk", subtitle: "Corner Steel Study Station", price: 9499, category: "Study Desks", finish: "Matte Black", stock: "New", stockQty: 20,
        images: [
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=85",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=85",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=85",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=85",
        ],
        description: "SL Pro Desk is a full-corner study station built for serious work environments. The L-shaped steel frame maximises usable surface area while the integrated cable management spine keeps your setup clean.",
        specs: { Material: "Powder Coated Mild Steel", "Frame Thickness": "2.0 mm", Finish: "Matte Black", "Load Capacity": "60 kg", Dimensions: "75 × 140 × 140 cm (H×W×D)", Weight: "22 kg" },
        relatedIds: [2, 5, 8],
    },
];

const faqs = [
    { q: "Is self-assembly difficult?", a: "No. The kit uses a simple bolt-together system with pre-drilled holes. Assembly takes 15–20 minutes with the included Allen key. A step-by-step guide is also available for download." },
    { q: "Is COD available?", a: "Yes, Cash on Delivery is available across India. A token advance may be required for orders above ₹5,000." },
    { q: "Is the steel rust resistant?", a: "Yes. All products use a premium powder-coat finish applied over treated mild steel, providing strong resistance to humidity and corrosion under normal indoor use." },
    { q: "What does the 10 Year Warranty cover?", a: "The structural warranty covers the primary steel frame against manufacturing defects and structural failure under normal use. It does not cover surface scratches, misuse, or improper installation." },
    { q: "Can I return the product?", a: "Yes — within 10 days of delivery. An unboxing video is mandatory for all replacement and return requests. Products must be in original packaging." },
];

const TABS = ["Description", "Specifications", "Assembly", "Warranty"] as const;
type Tab = (typeof TABS)[number];

/* ── ICONS ─────────────────────────────────────────────────── */
const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#1C1C1C" strokeWidth="1.3" />
        <path d="M5 8l2 2 4-4" stroke="#1C1C1C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── PAGE ───────────────────────────────────────────────────── */
export default function ProductDetailPage() {
    const { id } = useParams();
    const product = products.find((p) => p.id === Number(id)) ?? products[0];
    const related = products.filter((p) => product.relatedIds.includes(p.id));

    const [activeImg, setActiveImg] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>("Description");
    const [finish, setFinish] = useState(product.finish);
    const [qty, setQty] = useState(1);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [zoomed, setZoomed] = useState(false);

    const stockLow = product.stockQty <= 5;

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>

            {/* ── MINI NAV ─────────────────────────────────────────── */}
            <div style={{ background: "#111", color: "#fff", padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href="/" style={{ color: "#999", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
                    ← Home
                </Link>
                <span style={{ fontSize: "0.7rem", letterSpacing: "0.4em", fontWeight: 700, textTransform: "uppercase" }}>SANRA LIVING™</span>
                <Link href="/shop" style={{ color: "#999", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
                    Shop
                </Link>
            </div>

            {/* ── BREADCRUMB ───────────────────────────────────────── */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "0.875rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: "0.72rem", color: "#888", letterSpacing: "0.08em" }}>
                    <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
                    <span style={{ margin: "0 0.5rem" }}>/</span>
                    <Link href="/shop" style={{ color: "#888", textDecoration: "none" }}>Shop</Link>
                    <span style={{ margin: "0 0.5rem" }}>/</span>
                    <span style={{ color: "#555" }}>{product.category}</span>
                    <span style={{ margin: "0 0.5rem" }}>/</span>
                    <span style={{ color: "#111", fontWeight: 600 }}>{product.title}</span>
                </div>
            </div>

            {/* ── SECTION 1: MAIN PRODUCT ──────────────────────────── */}
            <section style={{ background: "#fff", padding: "48px 1.5rem 64px" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 md:gap-16" style={{ maxWidth: 1200, margin: "0 auto" }}>

                    {/* LEFT: Image Gallery */}
                    <div>
                        {/* Main image */}
                        <div
                            style={{ aspectRatio: "1/1", background: "#F2F2F0", overflow: "hidden", position: "relative", cursor: "zoom-in" }}
                            onMouseEnter={() => setZoomed(true)}
                            onMouseLeave={() => setZoomed(false)}
                        >
                            <img
                                src={product.images[activeImg]}
                                alt={product.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: zoomed ? "scale(1.08)" : "scale(1)" }}
                            />
                            <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "#1C1C1C", color: "#fff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", padding: "0.375rem 0.75rem", textTransform: "uppercase" }}>
                                {product.stock}
                            </div>
                        </div>
                        {/* Thumbnails */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem", marginTop: "0.625rem" }}>
                            {product.images.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    style={{ aspectRatio: "1/1", background: "#F2F2F0", overflow: "hidden", cursor: "pointer", border: i === activeImg ? "2px solid #1C1C1C" : "2px solid transparent", transition: "border-color 0.2s" }}
                                >
                                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {/* Category */}
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888" }}>
                            {product.category}
                        </span>

                        {/* Title */}
                        <div>
                            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#111", marginBottom: "0.25rem" }}>
                                {product.title}
                            </h1>
                            <p style={{ fontSize: "1rem", color: "#666", fontWeight: 400 }}>{product.subtitle}</p>
                        </div>

                        {/* Price */}
                        <div>
                            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", lineHeight: 1 }}>
                                ₹{product.price.toLocaleString("en-IN")}
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.375rem" }}>Inclusive of GST · Free Shipping Available</p>
                        </div>

                        {/* Short description */}
                        <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.75, borderLeft: "2px solid #E6E6E6", paddingLeft: "1rem" }}>
                            {product.description.split(".").slice(0, 2).join(". ") + "."}
                        </p>

                        {/* Finish selector */}
                        <div>
                            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555", marginBottom: "0.625rem" }}>
                                Finish: <span style={{ color: "#111" }}>{finish}</span>
                            </p>
                            <div style={{ display: "flex", gap: "0.625rem" }}>
                                {["Matte Charcoal Black", "Graphite Grey"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFinish(f)}
                                        style={{
                                            padding: "0.5rem 1rem", fontSize: "0.78rem", border: finish === f ? "2px solid #111" : "1.5px solid #ddd",
                                            background: finish === f ? "#111" : "#fff", color: finish === f ? "#fff" : "#555",
                                            cursor: "pointer", fontWeight: 600, transition: "all 0.2s", letterSpacing: "0.03em",
                                        }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stock status */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: stockLow ? "#b04000" : "#1a6b3a" }}>
                                {stockLow ? `⚠ Only ${product.stockQty} units left` : "✓ In Stock"}
                            </span>
                        </div>

                        {/* Qty selector */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555" }}>Qty</span>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #ddd" }}>
                                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 42, height: 42, background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#111" }}>−</button>
                                <span style={{ width: 42, textAlign: "center", fontWeight: 700, color: "#111" }}>{qty}</span>
                                <button onClick={() => setQty(qty + 1)} style={{ width: 42, height: 42, background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#111" }}>+</button>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button style={{ flex: 1, padding: "1rem", background: "#1C1C1C", color: "#fff", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                                Add to Cart
                            </button>
                            <button style={{ flex: 1, padding: "1rem", background: "transparent", color: "#1C1C1C", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "2px solid #1C1C1C", cursor: "pointer" }}>
                                Buy Now
                            </button>
                        </div>

                        {/* Trust line */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.25rem" }}>
                            {["10 Year Structural Warranty", "10 Days Replacement", "COD Available"].map((t) => (
                                <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#444" }}>
                                    <CheckIcon /> {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: KEY FEATURES ──────────────────────────── */}
            <section style={{ background: "#EBEBEB", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6", padding: "2.5rem 1.5rem" }}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#ddd]" style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {[
                        { icon: "⬛", label: "Structural Steel Frame", sub: "Certified mild steel" },
                        { icon: "◼", label: "Premium Powder Coating", sub: "Scratch & corrosion resistant" },
                        { icon: "🔩", label: "Self Assembly Design", sub: "15–20 mins, tools included" },
                        { icon: "📐", label: "Precision Fabricated", sub: "CNC bent, welded joints" },
                    ].map((f) => (
                        <div key={f.label} style={{ background: "#fff", padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: "#888", textTransform: "uppercase" }}>{f.icon}</div>
                            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111" }}>{f.label}</p>
                            <p style={{ fontSize: "0.75rem", color: "#888" }}>{f.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SECTION 3: TABS ──────────────────────────────────── */}
            <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "0 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Tab bar */}
                    <div style={{ display: "flex", borderBottom: "1px solid #E6E6E6" }}>
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: "1.125rem 1.75rem", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em",
                                    textTransform: "uppercase", background: "none", border: "none", cursor: "pointer",
                                    color: activeTab === tab ? "#111" : "#888",
                                    borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent",
                                    marginBottom: "-1px", transition: "all 0.2s",
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div style={{ padding: "2.5rem 0 3rem" }}>
                        {activeTab === "Description" && (
                            <div style={{ maxWidth: 680 }}>
                                <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.8 }}>{product.description}</p>
                            </div>
                        )}

                        {activeTab === "Specifications" && (
                            <div style={{ maxWidth: 560 }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        {Object.entries(product.specs).map(([k, v], i) => (
                                            <tr key={k} style={{ background: i % 2 === 0 ? "#F8F8F8" : "#fff" }}>
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", fontWeight: 700, color: "#555", width: "40%", borderBottom: "1px solid #eee" }}>{k}</td>
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", color: "#111", borderBottom: "1px solid #eee" }}>{v}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Assembly" && (
                            <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {[
                                    ["Self Assembly Required", "No professional tools needed."],
                                    ["Estimated Time", "15–20 minutes"],
                                    ["Tools Required", "Basic Allen Key (Included in box)"],
                                ].map(([label, val]) => (
                                    <div key={label} style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#F8F8F8" }}>
                                        <CheckIcon />
                                        <div>
                                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111" }}>{label}</p>
                                            <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.125rem" }}>{val}</p>
                                        </div>
                                    </div>
                                ))}
                                <button style={{ alignSelf: "flex-start", marginTop: "0.5rem", padding: "0.75rem 1.5rem", border: "1.5px solid #111", background: "transparent", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                                    ↓ Download Assembly Guide (PDF)
                                </button>
                            </div>
                        )}

                        {activeTab === "Warranty" && (
                            <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <div style={{ background: "#111", color: "#fff", padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1 }}>10</div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.05em" }}>Year Structural Warranty</p>
                                        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>On all primary steel frame components</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.875rem", color: "#444", lineHeight: 1.75 }}>
                                    SANRA LIVING offers a 10 Year Structural Warranty on the primary steel frame. This warranty reflects our confidence in the materials and fabrication standards we maintain.
                                </p>
                                <div>
                                    <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Not Covered</p>
                                    {["Improper installation or assembly", "Surface scratches or cosmetic damage", "Damage due to misuse or overloading"].map((item) => (
                                        <p key={item} style={{ fontSize: "0.82rem", color: "#666", padding: "0.375rem 0", borderBottom: "1px solid #f0f0f0", paddingLeft: "0.5rem" }}>— {item}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: DELIVERY & REPLACEMENT ───────────────── */}
            <section style={{ padding: "60px 1.5rem", background: "#F5F5F5" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "2rem" }}>Delivery &amp; Replacement</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div style={{ background: "#fff", padding: "2rem", borderLeft: "3px solid #111" }}>
                            <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "#111", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Delivery Timeline</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                                    <span style={{ color: "#555" }}>Tamil Nadu</span>
                                    <span style={{ fontWeight: 700, color: "#111" }}>3 – 5 Days</span>
                                </div>
                                <div style={{ height: "1px", background: "#f0f0f0" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                                    <span style={{ color: "#555" }}>Rest of India</span>
                                    <span style={{ fontWeight: 700, color: "#111" }}>5 – 8 Days</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ background: "#fff", padding: "2rem", borderLeft: "3px solid #555" }}>
                            <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "#111", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Replacement Policy</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <p style={{ fontSize: "0.84rem", color: "#333" }}>✓ <strong>10 Days</strong> replacement window</p>
                                <p style={{ fontSize: "0.84rem", color: "#555" }}>✓ Unboxing video mandatory for all replacement requests</p>
                                <p style={{ fontSize: "0.84rem", color: "#555" }}>✓ Original packaging required</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: RELATED PRODUCTS ─────────────────────── */}
            <section style={{ padding: "60px 1.5rem", background: "#EBEBEB", borderTop: "1px solid #E6E6E6" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>You May Also Like</p>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111", marginBottom: "2rem", letterSpacing: "-0.01em" }}>Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {related.map((p) => (
                            <Link key={p.id} href={`/shop/${p.id}`} style={{ textDecoration: "none" }}>
                                <div style={{ background: "#fff", overflow: "hidden" }}>
                                    <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                                        <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", display: "block" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                        />
                                    </div>
                                    <div style={{ padding: "1.25rem" }}>
                                        <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111" }}>{p.title}</p>
                                        <p style={{ fontSize: "0.78rem", color: "#666", marginTop: "0.125rem", marginBottom: "0.75rem" }}>{p.subtitle}</p>
                                        <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111" }}>₹{p.price.toLocaleString("en-IN")}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: FAQ ───────────────────────────────────── */}
            <section style={{ padding: "60px 1.5rem", background: "#fff" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", color: "#888", textTransform: "uppercase", marginBottom: "0.5rem" }}>Common Questions</p>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111", marginBottom: "2rem", letterSpacing: "-0.01em" }}>FAQ</h2>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {faqs.map((faq, i) => (
                            <div key={i} style={{ borderTop: "1px solid #E6E6E6" }}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{ width: "100%", textAlign: "left", padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}
                                >
                                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111" }}>{faq.q}</span>
                                    <span style={{ fontSize: "1.25rem", color: "#555", flexShrink: 0, transition: "transform 0.25s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                                </button>
                                {openFaq === i && (
                                    <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.75, paddingBottom: "1.25rem" }}>{faq.a}</p>
                                )}
                            </div>
                        ))}
                        <div style={{ borderTop: "1px solid #E6E6E6" }} />
                    </div>
                </div>
            </section>

            {/* ── SECTION 7: FINAL CTA STRIP ──────────────────────── */}
            <section style={{ background: "#1C1C1C", padding: "80px 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                        Built to Last 10 Years
                    </p>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                        Upgrade Your Space with<br />Engineered Steel Living.
                    </h2>
                    <Link href="/shop" style={{ display: "inline-block", padding: "0.9rem 2.5rem", background: "#fff", color: "#111", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
                        Shop Collection
                    </Link>
                </div>
            </section>

            {/* ── FOOTER ──────────────────────────────────────────── */}
            <footer style={{ background: "#111", color: "#555", padding: "1.5rem", textAlign: "center", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                © {new Date().getFullYear()} SANRA LIVING™ · Premium Steel Furniture by Indian Make Steel Industries
            </footer>

            {/* ── MOBILE STICKY BUY NOW (hidden on desktop) ───────── */}
            <div className="flex md:hidden" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #E6E6E6", padding: "0.875rem 1.5rem", gap: "0.625rem", zIndex: 50 }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.7rem", color: "#888" }}>{product.title}</p>
                    <p style={{ fontSize: "1rem", fontWeight: 800, color: "#111" }}>₹{product.price.toLocaleString("en-IN")}</p>
                </div>
                <button style={{ flex: 2, background: "#1C1C1C", color: "#fff", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", padding: "0.875rem" }}>
                    Buy Now
                </button>
            </div>
            <div className="h-20 md:h-0" />
        </main>
    );
}
