"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { useCart } from "@/app/context/CartContext";

/* ── FONTS ────────────────────────────────────────────────────── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── RESPONSIVE HOOK ───────────────────────────────────────────── */
function useIsMobile(bp = 768) {
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`);
        setMobile(mq.matches);
        const h = (e: MediaQueryListEvent) => setMobile(e.matches);
        mq.addEventListener("change", h);
        return () => mq.removeEventListener("change", h);
    }, [bp]);
    return mobile;
}

/* ── DB PRODUCT TYPE ────────────────────────────────────────── */
interface DbProduct {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    category: string;
    finish: string;
    stock_status: string;
    stock_qty: number;
    image_url: string;
    hover_image_url: string;
    is_new: boolean;
    description?: string;
}

const faqs = [
    { q: "Is self-assembly difficult?", a: "No. The kit uses a simple bolt-together system with pre-drilled holes. Assembly takes 15–20 minutes with the included Allen key. A step-by-step guide is also available for download." },
    { q: "Is COD available?", a: "Yes, Cash on Delivery is available across India. A token advance may be required for orders above ₹5,000." },
    { q: "Is the steel rust resistant?", a: "Yes. All products use a premium powder-coat finish applied over treated mild steel, providing strong resistance to humidity and corrosion under normal indoor use." },
    { q: "What does the 10 Year Warranty cover?", a: "The structural warranty covers the primary steel frame against manufacturing defects and structural failure under normal use. It does not cover surface scratches, misuse, or improper installation." },
    { q: "Can I return the product?", a: "Yes — within 10 days of delivery. An unboxing video is mandatory for all replacement and return requests. Products must be in original packaging." },
];

const TABS = ["Description", "Specifications", "Assembly", "Warranty"] as const;
type Tab = (typeof TABS)[number];

/* ── ICON ─────────────────────────────────────────────────────────── */
const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke="#1C1C1C" strokeWidth="1.3" />
        <path d="M5 8l2 2 4-4" stroke="#1C1C1C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── PAGE ────────────────────────────────────────────────────── */
export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { dispatch } = useCart();

    const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>("Description");
    const [finish, setFinish] = useState("");
    const [qty, setQty] = useState(1);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [zoomed, setZoomed] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const isMobile = useIsMobile(768);
    const isTablet = useIsMobile(1024);

    // Fetch product from Supabase
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) { setNotFound(true); return; }
                const json = await res.json();
                setDbProduct(json.product);
                setFinish(json.product.finish ?? "");
            } catch {
                setNotFound(true);
            } finally {
                setLoadingProduct(false);
            }
        })();
    }, [id]);

    if (loadingProduct) {
        return (
            <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
                <SiteHeader />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                    <p style={{ color: "#888", fontFamily: FO, fontSize: "0.9rem" }}>Loading product…</p>
                </div>
            </main>
        );
    }

    if (notFound || !dbProduct) {
        return (
            <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
                <SiteHeader />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "60vh", gap: "1rem" }}>
                    <p style={{ color: "#111", fontFamily: FO, fontSize: "1.1rem", fontWeight: 700 }}>Product Not Found</p>
                    <Link href="/shop" style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem", textDecoration: "underline" }}>Back to Shop</Link>
                </div>
            </main>
        );
    }

    // Map DB product to UI-friendly shape
    const defaultImages = [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85",
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=85",
    ];
    const images = dbProduct.image_url
        ? [dbProduct.image_url, dbProduct.hover_image_url || dbProduct.image_url, ...defaultImages.slice(2)]
        : defaultImages;

    const product = {
        ...dbProduct,
        images,
        stock: dbProduct.stock_status,
        stockQty: dbProduct.stock_qty,
        description: dbProduct.description || `${dbProduct.title} is precision-engineered from structural-grade steel, finished in premium matte powder coating. Designed for modern homes that value both function and aesthetic clarity.`,
        specs: {
            Material: "Powder Coated Mild Steel",
            "Frame Thickness": "1.2 mm",
            Finish: dbProduct.finish,
            "Load Capacity": "25 kg",
            Dimensions: "Custom",
            Weight: "N/A",
        },
    };

    const stockLow = product.stockQty <= 5;

    const handleAddToCart = () => {
        dispatch({
            type: "ADD",
            payload: {
                id: product.id as unknown as number, title: product.title,
                subtitle: product.subtitle, finish,
                price: product.price, image: product.images[0],
                qty, stockQty: product.stockQty,
            },
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        dispatch({
            type: "ADD",
            payload: {
                id: product.id as unknown as number, title: product.title,
                subtitle: product.subtitle, finish,
                price: product.price, image: product.images[0],
                qty, stockQty: product.stockQty,
            },
        });
        router.push("/checkout");
    };

    /* shared style helpers */
    const label = (extra?: object) => ({
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em",
        textTransform: "uppercase" as const, color: "#888", fontFamily: FM, ...extra,
    });

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>

            {/* ── TOP NAV BAR ─────────────────────────────────────── */}
            <SiteHeader />


            {/* ── BREADCRUMB ───────────────────────────────────────── */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "0.875rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: "0.72rem", color: "#888", letterSpacing: "0.08em", fontFamily: FM, display: "flex", flexWrap: "wrap", gap: "0.25rem", alignItems: "center" }}>
                    <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
                    <span style={{ margin: "0 0.35rem" }}>/</span>
                    <Link href="/shop" style={{ color: "#888", textDecoration: "none" }}>Shop</Link>
                    <span style={{ margin: "0 0.35rem" }}>/</span>
                    <span style={{ color: "#555" }}>{product.category}</span>
                    <span style={{ margin: "0 0.35rem" }}>/</span>
                    <span style={{ color: "#111", fontWeight: 700 }}>{product.title}</span>
                </div>
            </div>

            {/* ── SECTION 1: MAIN PRODUCT ─────────────────────────── */}
            <section style={{ background: "#fff", padding: isMobile ? "2rem 1.25rem 3rem" : "3rem 1.5rem 4rem" }}>
                <div style={{
                    maxWidth: 1200, margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? "2rem" : "4rem",
                    alignItems: "start",
                }}>
                    {/* LEFT: Gallery */}
                    <div>
                        <div
                            style={{ aspectRatio: "1/1", background: "#F2F2F0", overflow: "hidden", position: "relative", cursor: "zoom-in" }}
                            onMouseEnter={() => setZoomed(true)}
                            onMouseLeave={() => setZoomed(false)}
                        >
                            <img src={product.images[activeImg]} alt={product.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: zoomed ? "scale(1.08)" : "scale(1)", display: "block" }}
                            />
                            <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "#1C1C1C", color: "#fff", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", padding: "0.35rem 0.75rem", textTransform: "uppercase", fontFamily: FM }}>
                                {product.stock}
                            </div>
                        </div>
                        {/* Thumbnails */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem", marginTop: "0.625rem" }}>
                            {product.images.map((img, i) => (
                                <div key={i} onClick={() => setActiveImg(i)}
                                    style={{ aspectRatio: "1/1", background: "#F2F2F0", overflow: "hidden", cursor: "pointer", border: i === activeImg ? "2px solid #1C1C1C" : "2px solid transparent", transition: "border-color 0.2s" }}>
                                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.375rem" }}>
                        <span style={label()}>{product.category}</span>

                        <div>
                            <h1 style={{ fontSize: isMobile ? "1.75rem" : "clamp(1.6rem,3vw,2.25rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#111", marginBottom: "0.375rem", fontFamily: FM }}>
                                {product.title}
                            </h1>
                            <p style={{ fontSize: "1rem", color: "#666", fontFamily: FO }}>{product.subtitle}</p>
                        </div>

                        {/* Price */}
                        <div>
                            <div style={{ fontSize: isMobile ? "1.875rem" : "2.25rem", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", lineHeight: 1, fontFamily: FM }}>
                                ₹{product.price.toLocaleString("en-IN")}
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.375rem", fontFamily: FO }}>Inclusive of GST · Free Shipping Available</p>
                        </div>

                        {/* Short desc */}
                        <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.8, borderLeft: "2.5px solid #E6E6E6", paddingLeft: "1rem", fontFamily: FO }}>
                            {product.description.split(".").slice(0, 2).join(". ") + "."}
                        </p>

                        {/* Finish selector */}
                        <div>
                            <p style={{ ...label({ marginBottom: "0.625rem", color: "#555" }) }}>
                                Finish: <span style={{ color: "#111", fontWeight: 700 }}>{finish}</span>
                            </p>
                            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                                {["Matte Charcoal Black", "Graphite Grey"].map((f) => (
                                    <button key={f} onClick={() => setFinish(f)} style={{
                                        padding: "0.5rem 1rem", fontSize: "0.78rem", fontFamily: FM,
                                        border: finish === f ? "2px solid #111" : "1.5px solid #ddd",
                                        background: finish === f ? "#111" : "#fff",
                                        color: finish === f ? "#fff" : "#555",
                                        cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                                    }}>{f}</button>
                                ))}
                            </div>
                        </div>

                        {/* Stock */}
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: stockLow ? "#b04000" : "#1a6b3a", fontFamily: FM }}>
                            {stockLow ? `⚠ Only ${product.stockQty} units left` : "✓ In Stock – Ready to Ship"}
                        </span>

                        {/* Qty */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={label({ color: "#555" })}>Qty</span>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #ddd" }}>
                                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 42, height: 42, background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#111" }}>−</button>
                                <span style={{ width: 42, textAlign: "center", fontWeight: 700, color: "#111", fontFamily: FM }}>{qty}</span>
                                <button onClick={() => setQty(qty + 1)} style={{ width: 42, height: 42, background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#111" }}>+</button>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div style={{ display: "flex", gap: "0.75rem", flexDirection: isMobile ? "column" : "row" }}>
                            <button onClick={handleAddToCart} style={{ flex: 1, padding: "1rem", background: addedToCart ? "#2a7d4f" : "#1C1C1C", color: "#fff", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: FM, transition: "background 0.3s" }}>
                                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                            </button>
                            <button onClick={handleBuyNow} style={{ flex: 1, padding: "1rem", background: "transparent", color: "#1C1C1C", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "2px solid #1C1C1C", cursor: "pointer", fontFamily: FM }}>
                                Buy Now
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.25rem" }}>
                            {/* Warranty — clickable link */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.82rem", color: "#444", fontFamily: FO }}>
                                <CheckIcon />
                                <Link
                                    href="/warranty"
                                    style={{ color: "#111", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "3px", letterSpacing: "0.01em" }}
                                >
                                    10 Year Structural Warranty Included
                                </Link>
                            </div>
                            {/* Other badges */}
                            {["10 Days Replacement", "COD Available Across India"].map((t) => (
                                <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.82rem", color: "#444", fontFamily: FO }}>
                                    <CheckIcon /> {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: KEY FEATURES ─────────────────────────── */}
            <section style={{ background: "#EBEBEB", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6", padding: "2rem 1.5rem" }}>
                <div style={{
                    maxWidth: 1200, margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
                    gap: 1,
                    background: "#ddd",
                }}>
                    {[
                        { icon: "▪", label: "Structural Steel Frame", sub: "Certified mild steel" },
                        { icon: "◼", label: "Premium Powder Coating", sub: "Scratch & corrosion resistant" },
                        { icon: "⚙", label: "Self Assembly Design", sub: "15–20 mins, tools included" },
                        { icon: "✦", label: "Precision Fabricated", sub: "CNC bent, welded joints" },
                    ].map((f) => (
                        <div key={f.label} style={{ background: "#fff", padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <span style={{ fontSize: "1.125rem", color: "#1C1C1C" }}>{f.icon}</span>
                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{f.label}</p>
                            <p style={{ fontSize: "0.75rem", color: "#888", fontFamily: FO }}>{f.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SECTION 3: TABS ─────────────────────────────────── */}
            <section style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "0 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Tab Bar */}
                    <div style={{
                        display: isMobile ? "grid" : "flex",
                        gridTemplateColumns: isMobile ? "1fr 1fr" : "none",
                        borderBottom: isMobile ? "none" : "1px solid #E6E6E6",
                        gap: isMobile ? "1px" : "0",
                        background: isMobile ? "#E6E6E6" : "transparent"
                    }}>
                        {TABS.map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                padding: isMobile ? "1rem 0.5rem" : "1.125rem 1.75rem",
                                fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
                                textTransform: "uppercase", background: "#fff", border: "none", cursor: "pointer",
                                color: activeTab === tab ? "#111" : "#999",
                                borderBottom: activeTab === tab ? "2.5px solid #111" : "2.5px solid transparent",
                                marginBottom: isMobile ? 0 : "-1px", transition: "all 0.2s", whiteSpace: "nowrap",
                                fontFamily: FM,
                                width: "100%",
                            }}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ padding: isMobile ? "2rem 0 2.5rem" : "2.5rem 0 3rem" }}>
                        {activeTab === "Description" && (
                            <p style={{ fontSize: "0.9375rem", color: "#444", lineHeight: 1.85, maxWidth: 680, fontFamily: FO }}>{product.description}</p>
                        )}

                        {activeTab === "Specifications" && (
                            <div style={{ maxWidth: 560 }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        {Object.entries(product.specs).map(([k, v], i) => (
                                            <tr key={k} style={{ background: i % 2 === 0 ? "#F8F8F8" : "#fff" }}>
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", fontWeight: 700, color: "#555", width: "40%", borderBottom: "1px solid #eee", fontFamily: FM }}>{k}</td>
                                                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", color: "#111", borderBottom: "1px solid #eee", fontFamily: FO }}>{v}</td>
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
                                ].map(([lbl, val]) => (
                                    <div key={lbl} style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#F8F8F8", alignItems: "flex-start" }}>
                                        <CheckIcon />
                                        <div>
                                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{lbl}</p>
                                            <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.125rem", fontFamily: FO }}>{val}</p>
                                        </div>
                                    </div>
                                ))}
                                <button style={{ alignSelf: "flex-start", marginTop: "0.5rem", padding: "0.75rem 1.5rem", border: "1.5px solid #111", background: "transparent", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: FM }}>
                                    ↓ Download Assembly Guide (PDF)
                                </button>
                            </div>
                        )}

                        {activeTab === "Warranty" && (
                            <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <div style={{ background: "#111", color: "#fff", padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1, fontFamily: FM }}>10</div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.05em", fontFamily: FM }}>Year Structural Warranty</p>
                                        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem", fontFamily: FO }}>On all primary steel frame components</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.875rem", color: "#444", lineHeight: 1.8, fontFamily: FO }}>
                                    SANRA LIVING offers a 10 Year Structural Warranty on the primary steel frame. This warranty reflects our confidence in the materials and fabrication standards we maintain.
                                </p>
                                <div>
                                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FM }}>Not Covered</p>
                                    {["Improper installation or assembly", "Surface scratches or cosmetic damage", "Damage due to misuse or overloading"].map((item) => (
                                        <p key={item} style={{ fontSize: "0.82rem", color: "#666", padding: "0.45rem 0 0.45rem 0.75rem", borderBottom: "1px solid #f0f0f0", fontFamily: FO }}>— {item}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: DELIVERY info ─────────────────────────── */}
            <section style={{ padding: isMobile ? "2.5rem 1.25rem" : "3.75rem 1.5rem", background: "#F5F5F5" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <p style={label({ marginBottom: "1.5rem" })}>Delivery & Replacement</p>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                        <div style={{ background: "#fff", padding: "1.75rem", borderLeft: "3px solid #111" }}>
                            <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "#111", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FM }}>Delivery Timeline</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                                {[["Tamil Nadu", "3 – 5 Days"], ["Rest of India", "5 – 8 Days"]].map(([region, time]) => (
                                    <div key={region}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", fontFamily: FO }}>
                                            <span style={{ color: "#555" }}>{region}</span>
                                            <span style={{ fontWeight: 700, color: "#111", fontFamily: FM }}>{time}</span>
                                        </div>
                                        {region === "Tamil Nadu" && <div style={{ height: 1, background: "#f0f0f0", margin: "0.5rem 0" }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: "#fff", padding: "1.75rem", borderLeft: "3px solid #555" }}>
                            <p style={{ fontWeight: 800, fontSize: "0.875rem", color: "#111", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FM }}>Replacement Policy</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <p style={{ fontSize: "0.84rem", color: "#333", fontFamily: FO }}>✓ <strong>10 Days</strong> replacement window</p>
                                <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ Unboxing video mandatory for all claims</p>
                                <p style={{ fontSize: "0.84rem", color: "#555", fontFamily: FO }}>✓ Original packaging required</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: RELATED PRODUCTS ────────────────────── */}
            <section style={{ padding: isMobile ? "2.5rem 1.25rem" : "3.75rem 1.5rem", background: "#EBEBEB", borderTop: "1px solid #E6E6E6" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <p style={label({ marginBottom: "0.375rem" })}>You May Also Like</p>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111", marginBottom: "1.75rem", letterSpacing: "-0.01em", fontFamily: FM }}>Related Products</h2>
                    <p style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem" }}>Browse more products in our <Link href="/shop" style={{ color: "#111", fontWeight: 700, textDecoration: "underline" }}>shop collection</Link>.</p>
                </div>
            </section>

            {/* ── SECTION 6: FAQ ───────────────────────────────────── */}
            <section style={{ padding: isMobile ? "2.5rem 1.25rem" : "3.75rem 1.5rem", background: "#fff" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <p style={label({ marginBottom: "0.375rem" })}>Common Questions</p>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111", marginBottom: "2rem", letterSpacing: "-0.01em", fontFamily: FM }}>FAQ</h2>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {faqs.map((faq, i) => (
                            <div key={i} style={{ borderTop: "1px solid #E6E6E6" }}>
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{ width: "100%", textAlign: "left", padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111", fontFamily: FM }}>{faq.q}</span>
                                    <span style={{ fontSize: "1.5rem", color: "#555", flexShrink: 0, transition: "transform 0.25s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", display: "inline-block", lineHeight: 1 }}>+</span>
                                </button>
                                {openFaq === i && (
                                    <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.8, paddingBottom: "1.25rem", fontFamily: FO }}>{faq.a}</p>
                                )}
                            </div>
                        ))}
                        <div style={{ borderTop: "1px solid #E6E6E6" }} />
                    </div>
                </div>
            </section>

            {/* ── SECTION 7: FINAL CTA ─────────────────────────────── */}
            <section style={{ background: "#1C1C1C", padding: isMobile ? "3.5rem 1.25rem" : "5rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontFamily: FM }}>
                        Built to Last 10 Years
                    </p>
                    <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", fontFamily: FM }}>
                        Upgrade Your Space with<br />Engineered Steel Living.
                    </h2>
                    <Link href="/shop" style={{ display: "inline-block", padding: "0.9rem 2.5rem", background: "#fff", color: "#111", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontFamily: FM }}>
                        Shop Collection
                    </Link>
                </div>
            </section>

            <SiteFooter />

            {/* ── MOBILE STICKY BUY NOW ────────────────────────────── */}
            {isMobile && (
                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #E6E6E6", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 50 }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.68rem", color: "#888", fontFamily: FM }}>{product.title}</p>
                        <p style={{ fontSize: "1rem", fontWeight: 800, color: "#111", fontFamily: FM }}>₹{product.price.toLocaleString("en-IN")}</p>
                    </div>
                    <button onClick={handleBuyNow} style={{ flex: 2, background: "#1C1C1C", color: "#fff", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", padding: "0.875rem", fontFamily: FM }}>
                        Buy Now
                    </button>
                </div>
            )}
            {isMobile && <div style={{ height: 72 }} />}
        </main>
    );
}
