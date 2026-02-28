"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { useCart } from "@/app/context/CartContext";
import { optimizeImage } from "@/utils/cloudinary";

/* ── Components ── */
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductVideo from "./components/ProductVideo";
import ProductFeatures from "./components/ProductFeatures";
import ProductTabs from "./components/ProductTabs";
import ProductDelivery from "./components/ProductDelivery";
import ProductFAQ from "./components/ProductFAQ";

/* ── FONTS ── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── RESPONSIVE HOOK ── */
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

/* ── DB PRODUCT TYPE ── */
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
    images?: string[];
    video_url?: string;
    video_thumbnail?: string;
    description?: string;
    is_new: boolean;
}

/* ══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { dispatch } = useCart();

    const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const isMobile = useIsMobile(768);

    /* ── Fetch product ── */
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) { setNotFound(true); return; }
                const json = await res.json();
                setDbProduct(json.product);
            } catch {
                setNotFound(true);
            } finally {
                setLoadingProduct(false);
            }
        })();
    }, [id]);

    /* ── Dynamic SEO: title + LD+JSON ── */
    useEffect(() => {
        if (!dbProduct) return;
        document.title = `${dbProduct.title} – ${dbProduct.category} | SANRA LIVING`;
        const descMeta = document.querySelector('meta[name="description"]');
        const descText = `${dbProduct.title} – Premium ${dbProduct.finish} steel ${dbProduct.category.toLowerCase()} by SANRA LIVING. ${dbProduct.description?.slice(0, 120) ?? "Powder-coated, dismantlable design."}. Buy online with state-wise delivery across India.`;
        if (descMeta) descMeta.setAttribute("content", descText);
        else {
            const m = document.createElement("meta");
            m.name = "description"; m.content = descText;
            document.head.appendChild(m);
        }
        /* ── Product Schema ── */
        const schemaId = "product-schema";
        let el = document.getElementById(schemaId);
        if (!el) { el = document.createElement("script"); el.id = schemaId; el.setAttribute("type", "application/ld+json"); document.head.appendChild(el); }
        el.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: dbProduct.title,
            description: dbProduct.description ?? `${dbProduct.title} – Premium steel furniture by SANRA LIVING.`,
            image: optimizeImage(dbProduct.image_url, 800),
            sku: dbProduct.id,
            brand: { "@type": "Brand", name: "SANRA LIVING" },
            manufacturer: {
                "@type": "Organization",
                name: "Indian Make Steel Industries",
                url: "https://www.sanraliving.com",
            },
            material: "Powder Coated Mild Steel",
            color: dbProduct.finish,
            category: dbProduct.category,
            itemCondition: "https://schema.org/NewCondition",
            offers: {
                "@type": "Offer",
                price: dbProduct.price,
                priceCurrency: "INR",
                availability: dbProduct.stock_qty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                url: `https://www.sanraliving.com/shop/${id}`,
                seller: { "@type": "Organization", name: "SANRA LIVING", url: "https://www.sanraliving.com" },
                priceValidUntil: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
                itemCondition: "https://schema.org/NewCondition",
                shippingDetails: {
                    "@type": "OfferShippingDetails",
                    shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
                    deliveryTime: {
                        "@type": "ShippingDeliveryTime",
                        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
                        transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 10, unitCode: "DAY" },
                    },
                },
                hasMerchantReturnPolicy: {
                    "@type": "MerchantReturnPolicy",
                    applicableCountry: "IN",
                    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                    merchantReturnDays: 10,
                    returnMethod: "https://schema.org/ReturnByMail",
                },
            },
            additionalProperty: [
                { "@type": "PropertyValue", name: "Frame Thickness", value: "1.2 mm" },
                { "@type": "PropertyValue", name: "Warranty", value: "10 Year Structural Warranty" },
                { "@type": "PropertyValue", name: "Assembly", value: "Self-Assembly (15-20 min)" },
            ],
        });

        /* ── Breadcrumb Schema ── */
        const bcId = "pdp-breadcrumb-schema";
        let bcEl = document.getElementById(bcId);
        if (!bcEl) { bcEl = document.createElement("script"); bcEl.id = bcId; bcEl.setAttribute("type", "application/ld+json"); document.head.appendChild(bcEl); }
        bcEl.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sanraliving.com" },
                { "@type": "ListItem", position: 2, name: "Shop", item: "https://www.sanraliving.com/shop" },
                { "@type": "ListItem", position: 3, name: dbProduct.category, item: `https://www.sanraliving.com/shop` },
                { "@type": "ListItem", position: 4, name: dbProduct.title, item: `https://www.sanraliving.com/shop/${id}` },
            ],
        });

        return () => {
            document.getElementById(schemaId)?.remove();
            document.getElementById(bcId)?.remove();
        };
    }, [dbProduct, id]);

    /* ── Build image array ── */
    const buildImages = (p: DbProduct): string[] => {
        if (p.images && p.images.length > 0) return p.images;
        const fallback: string[] = [];
        if (p.image_url) fallback.push(p.image_url);
        if (p.hover_image_url && p.hover_image_url !== p.image_url) fallback.push(p.hover_image_url);
        return fallback.length > 0 ? fallback : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85"];
    };

    const images = dbProduct ? buildImages(dbProduct) : [];

    /* ── Loading state ── */
    if (loadingProduct) {
        return (
            <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
                <SiteHeader />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid #E6E6E6", borderTopColor: "#1C1C1C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem" }}>Loading product…</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </main>
        );
    }

    /* ── Not Found state ── */
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

    /* ── Product data ── */
    const product = {
        ...dbProduct,
        images,
        stock: dbProduct.stock_status,
        stockQty: dbProduct.stock_qty,
        description: dbProduct.description && dbProduct.description.trim()
            ? dbProduct.description
            : `${dbProduct.title} is precision-engineered from structural-grade steel, finished in premium matte powder coating. Designed for modern homes that value both function and aesthetic clarity.`,
        specs: {
            Material: "Powder Coated Mild Steel",
            "Frame Thickness": "1.2 mm",
            Finish: dbProduct.finish,
            "Load Capacity": "25 kg",
            Dimensions: "Custom",
            Weight: "N/A",
        },
    };

    /* ── Cart handlers ── */
    const handleAddToCart = (finish: string, qty: number) => {
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

    const handleBuyNow = (finish: string, qty: number) => {
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

    const handleWhatsApp = () => {
        const msg = encodeURIComponent(`Hi! I'm interested in the *${product.title}* (₹${product.price.toLocaleString("en-IN")}). Can you share more details?`);
        window.open(`https://wa.me/8300904920?text=${msg}`, "_blank");
    };

    const label = (extra?: object) => ({
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em",
        textTransform: "uppercase" as const, color: "#888", fontFamily: FM, ...extra,
    });

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── BREADCRUMB ── */}
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

            {/* ── SECTION 1: GALLERY + INFO ── */}
            <section style={{ background: "#fff", padding: isMobile ? "2rem 1.25rem 3rem" : "3rem 1.5rem 4rem" }}>
                <div style={{
                    maxWidth: 1200, margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? "2rem" : "4rem",
                    alignItems: "start",
                }}>
                    <ProductGallery
                        images={product.images}
                        title={product.title}
                        stockLabel={product.stock}
                        isMobile={isMobile}
                    />
                    <ProductInfo
                        title={product.title}
                        subtitle={product.subtitle}
                        category={product.category}
                        price={product.price}
                        description={product.description}
                        defaultFinish={dbProduct.finish}
                        stockQty={product.stockQty}
                        isMobile={isMobile}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onWhatsApp={handleWhatsApp}
                        addedToCart={addedToCart}
                    />
                </div>
            </section>

            {/* ── PRODUCT VIDEO ── */}
            <ProductVideo
                videoUrl={product.video_url}
                videoThumbnail={product.video_thumbnail}
                isMobile={isMobile}
            />

            {/* ── KEY FEATURES ── */}
            <ProductFeatures isMobile={isMobile} />

            {/* ── TABS ── */}
            <ProductTabs
                description={product.description}
                specs={product.specs}
                isMobile={isMobile}
            />

            {/* ── DELIVERY ── */}
            <ProductDelivery isMobile={isMobile} />

            {/* ── RELATED PRODUCTS ── */}
            <section style={{ padding: isMobile ? "2.5rem 1.25rem" : "3.75rem 1.5rem", background: "#EBEBEB", borderTop: "1px solid #E6E6E6" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <p style={label({ marginBottom: "0.375rem" })}>You May Also Like</p>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111", marginBottom: "1.75rem", letterSpacing: "-0.01em", fontFamily: FM }}>Related Products</h2>
                    <p style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem" }}>Browse more products in our <Link href="/shop" style={{ color: "#111", fontWeight: 700, textDecoration: "underline" }}>shop collection</Link>.</p>
                </div>
            </section>

            {/* ── FAQ ── */}
            <ProductFAQ isMobile={isMobile} />

            {/* ── FINAL CTA ── */}
            <section style={{ background: "#1C1C1C", padding: isMobile ? "3.5rem 1.25rem" : "5rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontFamily: FM }}>Built to Last 10 Years</p>
                    <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", fontFamily: FM }}>
                        Upgrade Your Space with<br />Engineered Steel Living.
                    </h2>
                    <Link href="/shop" style={{ display: "inline-block", padding: "0.9rem 2.5rem", background: "#fff", color: "#111", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontFamily: FM }}>
                        Shop Collection
                    </Link>
                </div>
            </section>

            <SiteFooter />

            {/* ── MOBILE STICKY BAR ── */}
            {isMobile && (
                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #E6E6E6", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 50 }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.68rem", color: "#888", fontFamily: FM }}>{product.title}</p>
                        <p style={{ fontSize: "1rem", fontWeight: 800, color: "#111", fontFamily: FM }}>₹{product.price.toLocaleString("en-IN")}</p>
                    </div>
                    <button onClick={handleWhatsApp} style={{ padding: "0.875rem 0.75rem", background: "#25D366", color: "#fff", fontWeight: 700, fontSize: "0.72rem", border: "none", cursor: "pointer", fontFamily: FM, borderRadius: 2 }}>
                        WhatsApp
                    </button>
                    <button onClick={() => handleBuyNow(dbProduct.finish, 1)} style={{ flex: 2, background: "#1C1C1C", color: "#fff", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", padding: "0.875rem", fontFamily: FM }}>
                        Buy Now
                    </button>
                </div>
            )}
            {isMobile && <div style={{ height: 72 }} />}
        </main>
    );
}
