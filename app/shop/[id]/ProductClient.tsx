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
        <div className={`border-b border-black/[0.04] transition-colors duration-500 ${isOpen ? 'bg-[#FAFAFA]' : 'bg-transparent'}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer py-5 px-5 md:px-6 group"
                aria-expanded={isOpen}
            >
                <span className="font-medium font-montserrat text-[0.8rem] md:text-[0.85rem] text-[#111] tracking-[0.05em] uppercase text-left group-hover:text-black/60 transition-colors">{title}</span>
                <span className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? 'bg-black/5 rotate-180' : 'bg-transparent rotate-0 group-hover:bg-black/5'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/60">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </span>
            </button>
            <div className="grid transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                    <div className={`text-gray-500 text-[0.9rem] md:text-[0.95rem] font-outfit leading-[1.8] font-light transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] px-5 md:px-6 ${isOpen ? 'pb-7 opacity-100 translate-y-0' : 'pb-0 opacity-0 -translate-y-2'}`}>
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
    const { totalItems, dispatch } = useCart();
    const cartCount = totalItems;

    const [dbProduct, setDbProduct] = useState<DbProduct | null>(initialProduct || null);
    const [relatedProducts, setRelatedProducts] = useState<DbProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [fullscreenImage, setFullscreenImage] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        if (initialProduct) {
            setLoading(false);
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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-[#EAEAEA] border-t-black rounded-full animate-spin" />
            </div>
        );
    }
    if (notFound || !dbProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white font-outfit">
                <p className="text-xl font-semibold text-black">Product Not Found</p>
                <Link href="/" className="mt-4 text-gray-600 underline">Back to Home</Link>
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
        "Jindal Steel", "3 Year Warranty", "Rust Resistant", "Pan India Delivery"
    ];

    const highlights = dbProduct.highlights?.length ? dbProduct.highlights : [
        "Premium Materials", "Expert Craftsmanship", "Long Lasting", "Sustainable Design"
    ];

    const handleAddToCart = () => {
        dispatch({ type: "ADD", payload: {
            id: dbProduct.id, title: dbProduct.title, finish: dbProduct.finish || "",
            price: dbProduct.price, image: dbProduct.image_url, qty: quantity, stockQty: dbProduct.stock_qty
        } });
    };

    const handleWhatsApp = () => {
        const link = dbProduct.whatsapp_link;
        if (link && link.includes("wa.me")) {
            window.open(link, "_blank");
            return;
        }
        const msg = `Hi, I want to buy:\n${dbProduct.title}\nPrice: ₹${dbProduct.price}\nLink: ${window.location.href}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.clientWidth;
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const index = Math.round(scrollLeft / width);
        setActiveImg(index);
    };

    return (
        <main className="min-h-screen bg-white font-outfit break-words">
            <SiteHeader />

            <div className="max-w-7xl mx-auto pb-24 lg:pb-12 pt-0 lg:pt-8 px-0 md:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-0 lg:gap-10 xl:gap-14 lg:justify-center">
                    
                    {/* 2. PRODUCT IMAGE SECTION */}
                    <section className="w-full lg:w-[50%] relative bg-[#F9F9F9] md:bg-transparent overflow-hidden self-start sticky lg:top-24 group">
                        {/* Swipe Gallery */}
                        <div 
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full aspect-square md:aspect-[4/5] max-h-[85vh] no-scrollbar md:rounded-[2rem] md:bg-[#F5F5F7]"
                        >
                            {images.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex-[0_0_100%] w-full h-full snap-start snap-always relative shrink-0 flex items-center justify-center p-6 sm:p-12 md:p-16 cursor-zoom-in group/img"
                                    onClick={() => setFullscreenImage(idx)}
                                >
                                    <div className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/img:scale-105 active:scale-95">
                                        <Image 
                                            src={optimizeImage(img, 1000)} 
                                            alt={dbProduct.title} 
                                            fill
                                            className="object-contain object-center mix-blend-darken drop-shadow-sm" 
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority={idx === 0}
                                        />
                                    </div>
                                    {/* Watermark Overlay */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-10 mix-blend-darken">
                                        <span className="text-[18vw] lg:text-[10vw] font-black font-montserrat -rotate-[30deg] text-black whitespace-nowrap">SANRA LIVING</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Premium Gallery Indicators */}
                        {images.length > 1 && (
                            <div className="absolute bottom-5 md:bottom-8 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
                                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-2 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-white/60 pointer-events-auto">
                                    {images.map((_, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => {
                                                const container = scrollContainerRef.current;
                                                if (container) {
                                                    container.scrollTo({ left: container.clientWidth * idx, behavior: 'smooth' });
                                                }
                                            }}
                                            className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${activeImg === idx ? "w-6 bg-[#111]" : "w-1.5 bg-[#111]/20 hover:bg-[#111]/40"}`} 
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Expand Icon */}
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                                onClick={() => setFullscreenImage(activeImg)}
                                className="w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center text-black/60 hover:text-black shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:scale-105 active:scale-95 border border-white/50"
                                aria-label="View fullscreen"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                            </button>
                        </div>
                    </section>

                    {/* DETAILS SECTION */}
                    <div className="w-full lg:w-[52%] px-4  md:px-0 lg:py-0 flex flex-col min-w-0">
                        
                        {/* 3. PRODUCT TITLE AREA */}
                        <section className=" lg:mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                            <div className="flex flex-col gap-2.5 mb-5 md:mb-6">
                                {dbProduct.badge && (
                                    <div className="flex">
                                        <span className="inline-flex items-center justify-center bg-[#111] text-white px-3 py-1 text-[0.6rem] font-semibold font-montserrat tracking-[0.2em] rounded-full uppercase leading-none">
                                            {dbProduct.badge}
                                        </span>
                                    </div>
                                )}
                                <h1 className="text-[1.5rem] md:text-[1.7rem] lg:text-[2.1rem] font-semibold font-montserrat text-black leading-[1.1] tracking-[-0.02em]">
                                    {dbProduct.title}
                                </h1>
                                {dbProduct.subtitle && (
                                    <p className="text-[0.85rem] md:text-base text-gray-500 font-outfit leading-relaxed font-light tracking-wide max-w-xl">
                                        {dbProduct.subtitle}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-1   border-black/[0.04] py-1">
                                <div className="flex items-baseline gap-3 md:gap-4">
                                    <span className="text-3xl lg:text-4xl font-medium font-montserrat text-black tracking-tight">₹{dbProduct.price.toLocaleString("en-IN")}</span>
                                    {dbProduct.compare_at_price && (
                                        <span className="text-lg md:text-xl text-gray-400 line-through font-outfit font-light tracking-wide">₹{dbProduct.compare_at_price.toLocaleString("en-IN")}</span>
                                    )}
                                </div>
                                <p className="text-[0.65rem] md:text-xs text-gray-400 font-outfit font-light tracking-widest uppercase mt-1">Inclusive of all taxes</p>
                            </div>
                        </section>

                        {/* 4. QUICK TRUST ICONS */}
                        <section className="flex justify-between py-3 my-4 border-y border-black/[0.04] overflow-x-auto gap-2 md:gap-4 no-scrollbar animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100 ease-[cubic-bezier(0.2,0.8,0.2,1)] fill-mode-both">
                            {trustFeatures.slice(0, 4).map((feat, i) => (
                                <div key={i} className="flex flex-col items-center gap-2.5 min-w-[72px] flex-1 group">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FAFAFA] border border-black/[0.04] flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 group-hover:bg-[#F0F0F0]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                                            {i === 0 && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>}
                                            {i === 1 && <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>}
                                            {i === 2 && <><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></>}
                                            {i === 3 && <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></>}
                                            {i > 3 && <path d="M5 12l5 5l10 -10"></path>}
                                        </svg>
                                    </div>
                                    <span className="text-[0.6rem] md:text-[0.65rem] font-montserrat font-medium text-gray-500 text-center leading-tight tracking-[0.05em] uppercase">{feat}</span>
                                </div>
                            ))}
                        </section>

                        {/* 5. QUANTITY + BUY SECTION (Inline) */}
                        <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] fill-mode-both">
                            <div className="flex gap-3 md:gap-4 mb-3 md:mb-4">
                                {/* Quantity selector */}
                                <div className="flex items-center border border-black/10 rounded-xl bg-white p-1 w-[110px] md:w-[130px] shrink-0 transition-colors hover:border-black/20 focus-within:border-black/30 shadow-sm">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-12 bg-transparent border-none text-xl text-gray-500 hover:text-black cursor-pointer active:scale-90 transition-all focus:outline-none">−</button>
                                    <span className="flex-1 text-center text-sm font-medium font-outfit text-black">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-12 bg-transparent border-none text-xl text-gray-500 hover:text-black cursor-pointer active:scale-90 transition-all focus:outline-none">+</button>
                                </div>
                                {/* Add to cart */}
                                <button onClick={handleAddToCart} className="flex-1 h-[56px] bg-[#111] hover:bg-black text-white border-none rounded-xl text-[0.75rem] md:text-[0.8rem] font-semibold font-montserrat uppercase tracking-[0.15em] cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all duration-300">
                                    Add to Cart
                                </button>
                            </div>
                            
                            {/* Buy on WhatsApp */}
                            <button onClick={handleWhatsApp} className="w-full h-[56px] bg-[#25D366] hover:bg-[#20ba59] text-white border-none rounded-xl text-[0.75rem] md:text-[0.8rem] font-semibold font-montserrat uppercase tracking-[0.15em] cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all duration-300 group shadow-[0_4px_14px_rgba(37,211,102,0.2)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.3)]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-300"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                Buy On WhatsApp
                            </button>

                            {/* 6. TRUST MESSAGE */}
                            <div className="flex justify-center items-center gap-4 md:gap-5 mt-6 md:mt-8">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    <span className="text-[0.65rem] font-montserrat uppercase tracking-widest font-medium">Secure</span>
                                </div>
                                <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10"></path></svg>
                                    <span className="text-[0.65rem] font-montserrat uppercase tracking-widest font-medium">Verified</span>
                                </div>
                                <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.87-11.57l-3.22 3.22"></path></svg>
                                    <span className="text-[0.65rem] font-montserrat uppercase tracking-widest font-medium">Returns</span>
                                </div>
                            </div>
                        </section>

                        {/* 8. ACCORDION INFORMATION SECTION */}
                        <section className="mb-16 mt-2">
                            <div className="-mx-4 md:mx-0 border-y md:border border-black/[0.04] md:rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] fill-mode-both">
                                <Accordion title="Materials & Finish" open>
                                    <ul className="pl-2 m-0 space-y-2.5">
                                        {dbProduct.material && <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-black/20 before:rounded-full"><span className="text-black/80 font-medium">Material:</span> {dbProduct.material}</li>}
                                        {dbProduct.pipe_type && <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-black/20 before:rounded-full"><span className="text-black/80 font-medium">Structure:</span> {dbProduct.pipe_type}</li>}
                                        {dbProduct.finish && <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-black/20 before:rounded-full"><span className="text-black/80 font-medium">Finish:</span> {dbProduct.finish}</li>}
                                        {dbProduct.color && <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-black/20 before:rounded-full"><span className="text-black/80 font-medium">Color:</span> {dbProduct.color}</li>}
                                        {!dbProduct.material && !dbProduct.finish && <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-black/20 before:rounded-full">Premium stainless steel with expert powder coating.</li>}
                                    </ul>
                                </Accordion>
                                
                                <Accordion title="Dimensions & Weight">
                                    <div className="space-y-4">
                                        {dbProduct.dimensions ? (
                                            <p className="m-0 leading-relaxed text-black/70">{dbProduct.dimensions}</p>
                                        ) : (
                                            <p className="m-0 leading-relaxed text-black/70">Please reference the product gallery images for detailed dimensional drawings.</p>
                                        )}
                                        {dbProduct.weight_kg && (
                                            <div className="flex items-center gap-3 pt-4 border-t border-black/[0.03]">
                                                <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/60"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                </div>
                                                <p className="m-0 text-[0.85rem]"><span className="text-black/80 font-medium uppercase tracking-widest text-[0.7rem] mr-2">Capacity:</span> {dbProduct.weight_kg}kg</p>
                                            </div>
                                        )}
                                    </div>
                                </Accordion>
                                
                                <Accordion title="Delivery & Installation">
                                    <p className="m-0 leading-relaxed text-black/70">{dbProduct.delivery_info || "Pan India delivery available within 5-7 business days. No complex installation required. Our products arrive ready to elevate your space immediately."}</p>
                                </Accordion>
                                
                                <Accordion title="Warranty Details">
                                    <p className="m-0 leading-relaxed text-black/70">{dbProduct.warranty || "Standard 3 Year structural warranty included. We stand behind the quality, engineering, and durability of our premium steel furniture."}</p>
                                </Accordion>
                                
                                <Accordion title="Care Instructions">
                                    <ul className="pl-2 m-0 space-y-2.5 text-black/70">
                                        <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-black/20 before:rounded-full">Wipe clean with a soft, slightly damp cloth.</li>
                                        <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-black/20 before:rounded-full">Avoid using harsh chemicals, solvents, or abrasive sponges.</li>
                                        <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-black/20 before:rounded-full">Dry immediately to prevent water spots and protect the finish.</li>
                                    </ul>
                                </Accordion>
                            </div>
                        </section>

                    </div>
                </div>

                {/* 9. RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <section className="mt-12 lg:mt-20 px-4 md:px-0">
                        <h2 className="text-xl lg:text-2xl font-medium font-montserrat text-black mb-6 tracking-wide">Complete The Look</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.map(rp => (
                                <Link key={rp.id} href={`/shop/${rp.id}`} className="group flex flex-col justify-between h-full bg-white p-2 lg:p-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 min-w-0">
                                    <div className="bg-white rounded-lg aspect-[4/5] mb-3 overflow-hidden relative shrink-0">
                                        <img src={optimizeImage(rp.image_url, 400)} alt={rp.title} className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="px-1 min-w-0 flex flex-col justify-between flex-1">
                                        <p className="text-sm lg:text-base font-medium font-montserrat text-black mb-1 line-clamp-2 leading-snug min-h-[40px]">{rp.title}</p>
                                        <p className="text-sm lg:text-sm text-gray-600 font-light font-outfit mt-auto">₹{rp.price.toLocaleString("en-IN")}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* 10. SOCIAL PROOF */}
                <section className="py-8 mt-6 border-t border-black/5 text-center px-4 md:px-0">
                    <p className="text-base lg:text-lg font-medium font-montserrat text-black m-0 tracking-wide">Trusted by 10,000+ customers<br className="lg:hidden"/> across India.</p>
                </section>
            </div>
            
            <SiteFooter />

            {/* FULLSCREEN GALLERY MODAL */}
            {fullscreenImage !== null && (
                <div className="fixed inset-0 z-[9999] bg-[#FAFAFA] flex flex-col animate-in fade-in zoom-in-95 duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/5 to-transparent z-50 pointer-events-none" />
                    
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
                        <button 
                            onClick={() => setFullscreenImage(null)}
                            className="w-11 h-11 bg-white/80 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center text-black transition-all shadow-[0_4px_20px_rgba(0,0,0,0.08)] active:scale-90 border border-black/5"
                            aria-label="Close fullscreen"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <div 
                        className="flex-1 w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex no-scrollbar"
                        ref={(el) => {
                            if (el && !el.dataset.initialized) {
                                el.dataset.initialized = 'true';
                                // instantaneous scroll to correct image
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
                                <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center p-4 md:p-16 transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.02]">
                                    <Image 
                                        src={optimizeImage(img, 2000)} 
                                        alt={`${dbProduct.title} - View ${idx + 1}`} 
                                        fill
                                        className="object-contain object-center mix-blend-darken" 
                                        sizes="100vw"
                                        quality={100}
                                        priority
                                    />
                                </div>
                                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10 pointer-events-none">
                                    <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[0.65rem] font-montserrat font-bold text-black tracking-[0.2em] uppercase shadow-sm border border-black/5">
                                        {idx + 1} / {images.length}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STICKY BOTTOM BAR (MOBILE ONLY) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-2xl border-t border-black/[0.04] px-4 md:px-6 py-2.5 flex items-center justify-between z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] pb-[calc(0.6rem+env(safe-area-inset-bottom))] lg:hidden animate-in slide-in-from-bottom-full duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                <div className="flex flex-col justify-center">
                    <span className="text-[0.55rem] text-gray-400 font-outfit uppercase tracking-[0.2em] font-medium mb-[3px]">Total</span>
                    <span className="text-xl font-medium font-montserrat text-black tracking-[-0.02em] leading-none">₹{dbProduct?.price?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex gap-2.5 ml-4">
                    <button 
                        onClick={handleWhatsApp} 
                        className="w-[52px] h-[52px] bg-white border border-black/5 rounded-[14px] flex items-center justify-center cursor-pointer active:scale-90 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#25D366]/30 text-[#25D366] shrink-0"
                        aria-label="Buy on WhatsApp"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </button>
                    <button 
                        onClick={handleAddToCart} 
                        className="px-6 sm:px-8 h-[52px] bg-[#111] text-white border-none rounded-[14px] text-[0.75rem] font-semibold font-montserrat uppercase tracking-[0.15em] cursor-pointer active:scale-95 transition-all shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.16)] whitespace-nowrap"
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
