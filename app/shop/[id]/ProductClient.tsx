"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { optimizeImage } from "@/utils/cloudinary";
import { useCart } from "@/app/context/CartContext";

/* ── DB PRODUCT TYPE ── */
interface DbProduct {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    compare_at_price?: number | null;
    category: string;
    product_type?: string;
    finish: string;
    stock_status: string;
    stock_qty: number;
    image_url: string;
    hover_image_url: string;
    lifestyle_image?: string;
    mobile_thumbnail?: string;
    images?: string[];
    description?: string;
    is_new: boolean;
    is_active: boolean;
    tags?: string[];
    highlights?: string[];
    trust_features?: string[];
    badge?: string;
    material?: string;
    pipe_type?: string;
    color?: string;
    dimensions?: string;
    weight_kg?: number;
    warranty?: string;
    delivery_info?: string;
    whatsapp_link?: string;
    faqs?: { question: string; answer: string }[];
    related_products?: string;
}

const WHATSAPP_NUMBER = "918300904920";

/* ── ACCORDION ── */
function Accordion({ title, children, open = false }: { title: string, children: React.ReactNode, open?: boolean }) {
    const [isOpen, setIsOpen] = useState(open);
    return (
        <div className={`border-b border-black/[0.035] transition-colors duration-300 ${isOpen ? 'bg-black/[0.005]' : 'bg-transparent'}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer py-4 px-5 group"
                aria-expanded={isOpen}
            >
                <span className="font-medium font-montserrat text-[0.62rem] text-[#111111]/80 tracking-[0.18em] uppercase text-left group-hover:text-[#C5A880] transition-colors">
                    {title}
                </span>
                <span className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${isOpen ? 'bg-black/5 rotate-180' : 'bg-transparent rotate-0 group-hover:bg-black/5'}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/40">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </span>
            </button>
            <div className="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                    <div className={`text-black/55 text-[0.8rem] font-outfit leading-[1.7] font-light transition-all duration-300 px-5 ${isOpen ? 'pb-6 opacity-100 translate-y-0' : 'pb-0 opacity-0 -translate-y-1'}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function ProductDetailPage({ initialProduct }: { initialProduct?: DbProduct }) {
    const params = useParams();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    const router = useRouter();
    const { dispatch } = useCart();

    const [dbProduct, setDbProduct] = useState<DbProduct | null>(initialProduct || null);
    const [relatedProducts, setRelatedProducts] = useState<DbProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [fullscreenImage, setFullscreenImage] = useState<number | null>(null);
    const [selectedFinish, setSelectedFinish] = useState(initialProduct?.finish || "Matte Black");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        if (initialProduct) {
            setLoading(false);
            setSelectedFinish(initialProduct.finish || "Matte Black");
            if (initialProduct.category) {
                fetch(`/api/products?category=${encodeURIComponent(initialProduct.category)}&limit=5`)
                    .then(r => r.json())
                    .then(data => {
                        if (data.products) {
                            setRelatedProducts(data.products.filter((p: DbProduct) => p.id !== initialProduct.id).slice(0, 4));
                        }
                    }).catch(console.error);
            }
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) { if (!cancelled) setNotFound(true); return; }
                const json = await res.json();
                if (!cancelled) {
                    if (json.product?.is_active === false) setNotFound(true);
                    else {
                        setDbProduct(json.product);
                        setSelectedFinish(json.product.finish || "Matte Black");
                        if (json.product.category) {
                            fetch(`/api/products?category=${encodeURIComponent(json.product.category)}&limit=5`)
                                .then(r => r.json())
                                .then(data => {
                                    if (!cancelled && data.products) {
                                        setRelatedProducts(data.products.filter((p: DbProduct) => p.id !== json.product.id).slice(0, 4));
                                    }
                                }).catch(console.error);
                        }
                    }
                }
            } catch {
                if (!cancelled) setNotFound(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id, initialProduct]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin" />
            </div>
        );
    }
    if (notFound || !dbProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] font-outfit">
                <p className="text-lg font-light text-black">Product Not Found</p>
                <Link href="/" className="mt-4 text-sm text-[#C5A880] underline">Back to Home</Link>
            </div>
        );
    }

    const images = [
        dbProduct.image_url,
        dbProduct.hover_image_url,
        dbProduct.lifestyle_image,
        dbProduct.mobile_thumbnail,
        ...(dbProduct.images || [])
    ].filter(Boolean) as string[];

    if (images.length === 0) images.push("/images/sanra_stool.png");

    const trustFeatures = dbProduct.trust_features?.length ? dbProduct.trust_features : [
        "Premium Grade Steel", "3 Year Warranty", "Rust Resistant Coating", "Free Shipping in India"
    ];

    const handleAddToCart = () => {
        dispatch({ type: "ADD", payload: {
            id: dbProduct.id, title: dbProduct.title, finish: selectedFinish,
            price: dbProduct.price, image: dbProduct.image_url, qty: quantity, stockQty: dbProduct.stock_qty
        } });
    };

    const handleBuyNow = () => {
        dispatch({ type: "ADD", payload: {
            id: dbProduct.id, title: dbProduct.title, finish: selectedFinish,
            price: dbProduct.price, image: dbProduct.image_url, qty: quantity, stockQty: dbProduct.stock_qty
        } });
        router.push("/checkout");
    };

    const handleWhatsApp = () => {
        const link = dbProduct.whatsapp_link;
        if (link && link.includes("wa.me")) {
            window.open(link, "_blank");
            return;
        }
        const msg = `Hi, I want to inquire about:\n${dbProduct.title}\nFinish: ${selectedFinish}\nPrice: ₹${dbProduct.price}\nLink: ${window.location.href}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.clientWidth;
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const index = Math.round(scrollLeft / width);
        setActiveImg(index);
    };

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": dbProduct.title,
        "image": images.map(img => optimizeImage(img, 1000)),
        "description": dbProduct.description || dbProduct.subtitle || "Premium engineered steel furniture by SANRA LIVING.",
        "sku": dbProduct.id,
        "offers": {
            "@type": "Offer",
            "url": typeof window !== "undefined" ? window.location.href : `https://www.sanraliving.com/shop/${dbProduct.id}`,
            "priceCurrency": "INR",
            "price": dbProduct.price,
            "availability": dbProduct.stock_qty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "priceValidUntil": "2030-01-01",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF9F6] font-outfit break-words">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <SiteHeader />

            <div className="max-w-7xl mx-auto lg:pb-12 pt-20 lg:pt-28 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <p className="text-[0.52rem] tracking-[0.22em] uppercase text-black/35 font-montserrat mb-6 hidden lg:block">
                    <Link href="/" className="hover:text-black transition-colors duration-300">Home</Link>
                    <span className="mx-2 opacity-40">/</span>
                    <Link href="/shop" className="hover:text-black transition-colors duration-300">Shop</Link>
                    <span className="mx-2 opacity-40">/</span>
                    <span className="text-black/80 font-normal">{dbProduct.title}</span>
                </p>

                <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12 lg:justify-between">
                    
                    {/* 2. PRODUCT IMAGE SECTION */}
                    <section className="w-full lg:w-[50%] flex gap-4 self-start lg:sticky lg:top-28">
                        {/* Desktop Vertical Thumbnails */}
                        {images.length > 1 && (
                            <div className="hidden lg:flex flex-col gap-3 w-16 shrink-0">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(idx)}
                                        className={`w-16 h-16 rounded-2xl overflow-hidden border bg-[#F5F4F0] p-1 transition-all duration-300
                                            ${activeImg === idx ? "border-[#C5A880] scale-102 shadow-sm" : "border-black/5 hover:border-black/20"}`}
                                        aria-label={`View image ${idx + 1}`}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={optimizeImage(img, 150)}
                                                alt=""
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image View */}
                        <div className="flex-1 relative w-full overflow-hidden bg-transparent">
                            {/* Mobile Scroll Swipe Gallery */}
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full aspect-[4/5] no-scrollbar rounded-2xl bg-[#F5F4F0] border border-black/[0.015]"
                            >
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-[0_0_100%] w-full h-full snap-start snap-always relative shrink-0 flex items-center justify-center p-8 cursor-zoom-in"
                                        onClick={() => setFullscreenImage(idx)}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={optimizeImage(img, 1000)}
                                                alt={dbProduct.title}
                                                fill
                                                className="object-contain object-center scale-[0.95]"
                                                sizes="100vw"
                                                priority={idx === 0}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Single Active Image display */}
                            <div
                                className="hidden lg:flex w-full aspect-[4/5] rounded-3xl bg-[#F5F4F0] border border-black/[0.01] items-center justify-center p-10 cursor-zoom-in relative group overflow-hidden"
                                onClick={() => setFullscreenImage(activeImg)}
                            >
                                <div className="relative w-full h-full transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]">
                                    <Image
                                        src={optimizeImage(images[activeImg], 1200)}
                                        alt={dbProduct.title}
                                        fill
                                        className="object-contain object-center scale-[0.95]"
                                        sizes="50vw"
                                        priority
                                    />
                                </div>
                                
                                {/* Desktop Expand Icon */}
                                <div className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black/60 hover:text-black shadow-sm transition-all hover:scale-105 active:scale-95 border border-black/[0.015]">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Gallery Indicators */}
                            {images.length > 1 && (
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none lg:hidden">
                                    <div className="flex items-center gap-1.5 bg-[#FAF9F6]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/[0.02]">
                                        {images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${activeImg === idx ? "w-4 bg-[#1A1917]" : "w-1.5 bg-[#1A1917]/20"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* DETAILS SECTION */}
                    <div className="w-full lg:w-[46%] flex flex-col min-w-0">
                        
                        {/* 3. PRODUCT TITLE AREA */}
                        <section className="mb-6">
                            <div className="flex flex-col gap-3">
                                {(dbProduct.badge || dbProduct.is_new) && (
                                    <div className="flex">
                                        <span className="inline-flex items-center justify-center bg-[#1A1917] text-[#C5A880] px-3.5 py-1.2 text-[0.48rem] font-medium font-montserrat tracking-[0.2em] rounded-full uppercase leading-none border border-[#C5A880]/10">
                                            {dbProduct.badge || "New Arrival"}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-xl md:text-2.5xl lg:text-3xl font-light font-montserrat text-[#111111] leading-[1.25] tracking-tight mb-2">
                                        {dbProduct.title}
                                    </h1>
                                    {dbProduct.subtitle && (
                                        <p className="text-[0.85rem] text-black/45 font-light leading-[1.6] max-w-xl">
                                            {dbProduct.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 pt-5 mt-5 border-t border-black/[0.035]">
                                <div className="flex items-baseline gap-2.5">
                                    <span className="text-xl md:text-2.5xl font-light font-montserrat text-[#111111] tracking-tight">
                                        ₹{dbProduct.price.toLocaleString("en-IN")}
                                    </span>
                                    {dbProduct.compare_at_price && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[0.88rem] text-black/30 line-through font-light">
                                                ₹{dbProduct.compare_at_price.toLocaleString("en-IN")}
                                            </span>
                                            <span className="text-[0.52rem] font-montserrat uppercase tracking-[0.2em] font-semibold text-[#8E7557] bg-[#8E7557]/10 px-2 py-0.5 rounded-full">
                                                {Math.round(((dbProduct.compare_at_price - dbProduct.price) / dbProduct.compare_at_price) * 100)}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[0.52rem] text-black/35 font-montserrat tracking-[0.15em] uppercase mt-0.5">
                                    Inclusive of all taxes & free shipping
                                </p>
                            </div>
                        </section>

                        {/* Variant/Finish Selection */}
                        <div className="mb-6 pt-5 border-t border-black/[0.035]">
                            <p className="text-[0.52rem] font-montserrat uppercase tracking-[0.18em] font-medium text-black/45 mb-2.5">
                                Selected Finish: <span className="text-[#111111] font-semibold">{selectedFinish}</span>
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {[
                                    { name: "Matte Black", color: "#1A1917" },
                                    { name: "Satin Stainless", color: "#8A8A87" },
                                    { name: "Champagne Gold", color: "#C5A880" }
                                ].map((fin) => {
                                    const active = selectedFinish.toLowerCase().includes(fin.name.toLowerCase()) || 
                                                   selectedFinish === fin.name;
                                    return (
                                        <button
                                            key={fin.name}
                                            onClick={() => setSelectedFinish(fin.name)}
                                            className={`flex items-center gap-2 px-3.5 py-2 border rounded-full text-[0.68rem] font-montserrat transition-all duration-300 cursor-pointer
                                                ${active 
                                                    ? "border-[#1A1917] bg-[#1A1917] text-white shadow-sm" 
                                                    : "border-black/10 hover:border-black/25 text-[#111111] bg-transparent"
                                                }`}
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: fin.color }} />
                                            <span className="font-light tracking-wide">{fin.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 5. BUY / ADD TO CART ACTIONS */}
                        <section className="mb-6 pt-5 border-t border-black/[0.035]">
                            <div className="flex gap-3.5 mb-3">
                                {/* Quantity selector */}
                                <div className="flex items-center border border-black/10 rounded-full bg-transparent p-1 w-[100px] shrink-0 transition-colors focus-within:border-black/30">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                                        className="flex-1 h-9 bg-transparent border-none text-base text-black/40 hover:text-black cursor-pointer active:scale-90 transition-all focus:outline-none"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <span className="flex-1 text-center text-xs font-semibold font-outfit text-[#111111]">
                                        {quantity}
                                    </span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)} 
                                        className="flex-1 h-9 bg-transparent border-none text-base text-black/40 hover:text-black cursor-pointer active:scale-90 transition-all focus:outline-none"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                
                                {/* Add to Cart */}
                                <button 
                                    onClick={handleAddToCart} 
                                    className="flex-1 h-[48px] bg-white border border-black/15 hover:border-black/30 text-black rounded-full text-[0.6rem] font-medium font-montserrat uppercase tracking-[0.2em] cursor-pointer active:scale-[0.98] transition-all duration-400"
                                >
                                    Add to Cart
                                </button>
                            </div>

                            {/* Buy Now (Express Checkout) */}
                            <button 
                                onClick={handleBuyNow} 
                                className="w-full h-[48px] bg-[#1A1917] hover:bg-black text-white border-none rounded-full text-[0.6rem] font-medium font-montserrat uppercase tracking-[0.2em] cursor-pointer shadow-md active:scale-[0.98] transition-all duration-400 mb-3"
                            >
                                Buy Now (Express Checkout)
                            </button>
                            
                            {/* WhatsApp Inquiry */}
                            <button 
                                onClick={handleWhatsApp} 
                                className="w-full h-[44px] bg-transparent hover:bg-black/5 text-black/60 hover:text-black border border-black/10 rounded-full text-[0.58rem] font-medium font-montserrat uppercase tracking-[0.18em] cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all duration-400"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span>Have Questions? Chat on WhatsApp</span>
                            </button>
                        </section>

                        {/* 4. QUICK TRUST ICONS */}
                        <section className="grid grid-cols-4 py-4 border-y border-black/[0.035] mb-6 gap-3">
                            {trustFeatures.slice(0, 4).map((feat, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group">
                                    <div className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#1A1917] group-hover:border-transparent">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-black group-hover:text-[#C5A880] transition-colors">
                                            {i === 0 && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>}
                                            {i === 1 && <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>}
                                            {i === 2 && <><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></>}
                                            {i === 3 && <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></>}
                                            {i > 3 && <path d="M5 12l5 5l10 -10"></path>}
                                        </svg>
                                    </div>
                                    <span className="text-[0.48rem] font-montserrat text-black/45 text-center leading-[1.3] tracking-[0.15em] uppercase max-w-[70px]">{feat}</span>
                                </div>
                            ))}
                        </section>

                        {/* 8. ACCORDION INFORMATION SECTION */}
                        <section className="mb-6 border border-black/[0.035] rounded-2xl overflow-hidden bg-transparent">
                            <Accordion title="Materials & Finish" open>
                                <ul className="pl-0 m-0 space-y-2.5 list-none">
                                    {dbProduct.material && <li className="flex items-baseline gap-2"><span className="text-black/85 font-medium min-w-[90px] shrink-0">Material:</span> <span className="text-black/60 font-light">{dbProduct.material}</span></li>}
                                    {dbProduct.pipe_type && <li className="flex items-baseline gap-2"><span className="text-black/85 font-medium min-w-[90px] shrink-0">Structure:</span> <span className="text-black/60 font-light">{dbProduct.pipe_type}</span></li>}
                                    {selectedFinish && <li className="flex items-baseline gap-2"><span className="text-black/85 font-medium min-w-[90px] shrink-0">Finish:</span> <span className="text-black/60 font-light">{selectedFinish}</span></li>}
                                    {dbProduct.color && <li className="flex items-baseline gap-2"><span className="text-black/85 font-medium min-w-[90px] shrink-0">Color:</span> <span className="text-black/60 font-light">{dbProduct.color}</span></li>}
                                    {!dbProduct.material && !dbProduct.finish && <li>Premium steel with expert structural coatings.</li>}
                                </ul>
                            </Accordion>
                            
                            <Accordion title="Dimensions & Specifications">
                                <div className="flex flex-col gap-3">
                                    <div className="bg-black/[0.01] rounded-xl p-4 border border-black/[0.02]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/45"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M3 9h18M9 21V9"></path></svg>
                                            <span className="text-[0.55rem] font-montserrat uppercase tracking-[0.15em] font-medium text-black/45">Measurements</span>
                                        </div>
                                        {dbProduct.dimensions ? (
                                            <p className="m-0 leading-relaxed text-black/80 text-[0.82rem] font-medium tracking-wide">{dbProduct.dimensions}</p>
                                        ) : (
                                            <p className="m-0 leading-relaxed text-black/45 text-[0.78rem] font-light">Detailed measurements are specified in our product catalogs.</p>
                                        )}
                                    </div>
                                    {dbProduct.weight_kg && (
                                        <div className="bg-black/[0.01] rounded-xl p-4 border border-black/[0.02] flex items-center gap-3.5">
                                            <div className="w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center shadow-sm shrink-0 border border-black/5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/45"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[0.52rem] font-montserrat uppercase tracking-[0.15em] font-semibold text-black/40 mb-0.5">Product Weight</span>
                                                <span className="text-xs font-medium text-black/75">{dbProduct.weight_kg} kg</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Accordion>
                            
                            <Accordion title="Delivery & Installation">
                                <p className="m-0 leading-relaxed">{dbProduct.delivery_info || "Pan-India delivery available within 5-7 business days. Arrives fully assembled. Unbox and place directly in your living space."}</p>
                            </Accordion>
                            
                            <Accordion title="Warranty Details">
                                <p className="m-0 leading-relaxed">{dbProduct.warranty || "Standard 3-Year structural warranty included. We guarantee the structural engineering, welding joints, and powder coating integrity."}</p>
                            </Accordion>
                            
                            <Accordion title="Care & Maintenance">
                                <ul className="pl-0 m-0 space-y-2 list-none">
                                    <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.5rem] before:w-1 before:h-1 before:bg-[#C5A880] before:rounded-full">Wipe with a soft, dry lint-free microfiber cloth.</li>
                                    <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.5rem] before:w-1 before:h-1 before:bg-[#C5A880] before:rounded-full">Avoid abrasive scrubbers and acid-based cleaning products.</li>
                                    <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.5rem] before:w-1 before:h-1 before:bg-[#C5A880] before:rounded-full">Protect finishes from persistent outdoor moisture.</li>
                                </ul>
                            </Accordion>

                            {dbProduct.faqs && dbProduct.faqs.length > 0 && (
                                <Accordion title="Frequently Asked Questions">
                                    <div className="flex flex-col gap-5">
                                        {dbProduct.faqs.map((faq, i) => (
                                            <div key={i} className="border-b border-black/[0.035] pb-4 last:border-0 last:pb-0">
                                                <h4 className="text-[0.8rem] font-medium font-montserrat text-[#111] mb-2 leading-snug">{faq.question}</h4>
                                                <p className="text-[0.78rem] text-black/55 font-light leading-relaxed m-0">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Accordion>
                            )}
                        </section>

                    </div>
                </div>

                {/* 9. RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <section className="mt-12 lg:mt-16 border-t border-black/[0.035] pt-12">
                        <div className="mb-8">
                            <p className="text-[0.52rem] tracking-[0.3em] uppercase text-[#C5A880] font-montserrat font-medium mb-2.5">
                                COMPLEMENTARY ACCENTS
                            </p>
                            <h2 className="text-xl md:text-2xl font-light font-montserrat text-black tracking-tight leading-none">Complete The Look</h2>
                        </div>
                        
                        <div className="flex overflow-x-auto gap-5 pb-4 no-scrollbar snap-x snap-mandatory">
                            {relatedProducts.map(rp => (
                                <Link key={rp.id} href={`/shop/${rp.id}`} className="snap-start shrink-0 w-[72vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] group flex flex-col h-full focus:outline-none">
                                    <div className="rounded-2xl aspect-[4/5] mb-4 overflow-hidden relative flex items-center justify-center p-6 bg-[#F5F4F0] border border-black/[0.015] transition-all duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[#EFECE6] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                                        <img src={optimizeImage(rp.image_url, 600)} alt={rp.title} className="w-full h-full object-contain object-center scale-[0.93] transition-all duration-1000 group-hover:scale-[0.97]" />
                                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-sm border border-black/[0.015]">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/80"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </div>
                                    </div>
                                    <div className="px-1 flex flex-col flex-1">
                                        <p className="text-[0.52rem] text-black/40 font-montserrat uppercase tracking-[0.15em] font-medium mb-1">{rp.category}</p>
                                        <h3 className="text-[0.82rem] font-light font-montserrat text-[#111111] mb-1.5 line-clamp-1 group-hover:text-[#C5A880] transition-colors">{rp.title}</h3>
                                        <p className="text-[0.85rem] text-[#111111] font-medium tracking-tight font-montserrat">₹{rp.price.toLocaleString("en-IN")}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

            </div>
            
            <SiteFooter />

            {/* FULLSCREEN GALLERY MODAL */}
            {fullscreenImage !== null && (
                <div className="fixed inset-0 z-[9999] bg-[#FAF9F6] flex flex-col animate-in fade-in zoom-in-95 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <div className="absolute top-6 right-6 z-50">
                        <button 
                            onClick={() => setFullscreenImage(null)}
                            className="w-11 h-11 bg-white/80 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center text-black transition-all shadow-md border border-black/5"
                            aria-label="Close fullscreen"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <div 
                        className="flex-1 w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex no-scrollbar"
                        ref={(el) => {
                            if (el && !el.dataset.initialized) {
                                el.dataset.initialized = 'true';
                                el.scrollTo({ left: el.clientWidth * fullscreenImage, behavior: 'instant' });
                            }
                        }}
                    >
                        {images.map((img, idx) => (
                            <div 
                                key={idx} 
                                className="w-full h-full flex-[0_0_100%] snap-start snap-always flex items-center justify-center relative cursor-zoom-out"
                                onClick={() => setFullscreenImage(null)}
                            >
                                <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center p-6 md:p-16 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01]">
                                    <Image 
                                        src={optimizeImage(img, 2000)} 
                                        alt={`${dbProduct.title} - View ${idx + 1}`} 
                                        fill
                                        className="object-contain object-center" 
                                        sizes="100vw"
                                        quality={100}
                                        priority
                                    />
                                </div>
                                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10 pointer-events-none">
                                    <div className="bg-[#FAF9F6]/80 backdrop-blur-md px-4 py-2 rounded-full text-[0.58rem] font-montserrat font-medium text-black tracking-[0.2em] uppercase border border-black/5">
                                        {idx + 1} / {images.length}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STICKY BOTTOM BAR (MOBILE ONLY) */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#FAF9F6]/80 backdrop-blur-2xl border-t border-black/[0.04] px-6 py-3 flex items-center justify-between z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden animate-in slide-in-from-bottom-full duration-700">
                <div className="flex flex-col justify-center">
                    <span className="text-[0.48rem] text-black/40 font-montserrat uppercase tracking-[0.18em] font-medium mb-[2px]">Total Price</span>
                    <span className="text-lg font-light font-montserrat text-black tracking-tight leading-none">₹{dbProduct?.price?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex gap-3 ml-4">
                    <button 
                        onClick={handleWhatsApp} 
                        className="w-[44px] h-[44px] bg-transparent border border-black/10 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300 shadow-sm shrink-0"
                        aria-label="Buy on WhatsApp"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </button>
                    <button 
                        onClick={handleAddToCart} 
                        className="px-6 h-[44px] bg-[#1A1917] hover:bg-black text-[#FFFFFF] border-none rounded-full text-[0.6rem] font-medium font-montserrat uppercase tracking-[0.2em] cursor-pointer active:scale-95 transition-all duration-300"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
