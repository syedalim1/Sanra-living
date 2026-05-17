import Link from "next/link";

export default function SiteFooter() {
    const waLink = "https://wa.me/918300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture.";

    return (
        <footer className="bg-[#111] text-white font-montserrat pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 lg:pt-20">

                {/* ── MAIN CONTENT ──────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12 lg:mb-16">

                    {/* Col 1 – Brand */}
                    <div className="flex flex-col">
                        <div className="text-xl lg:text-2xl font-semibold tracking-tight text-white mb-2">SANRA LIVING</div>
                        <div className="text-[0.6rem] font-medium tracking-[0.2em] text-white/40 uppercase mb-5">Steel Furniture Manufacturer</div>
                        <p className="text-[0.85rem] text-white/50 font-outfit font-light leading-[1.8] max-w-[280px]">
                            Premium engineered steel furniture owned and operated by <strong className="text-white/80 font-normal">Indian Make Steel Industries</strong>.
                        </p>
                    </div>

                    {/* Col 2 – Contact Info */}
                    <div className="flex flex-col">
                        <p className="text-[0.6rem] lg:text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/30 font-montserrat mb-4">
                            Connect
                        </p>
                        <div className="text-[0.85rem] text-white/60 font-outfit font-light flex flex-col gap-3">
                            <a href="tel:+919585745303" className="hover:text-white transition-colors duration-300 w-fit">+91 95857 45303</a>
                            <a href="mailto:hello@sanraliving.com" className="hover:text-white transition-colors duration-300 w-fit">hello@sanraliving.com</a>
                        </div>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-5 text-white/50 hover:text-white text-[0.85rem] font-outfit transition-all duration-300 w-fit group"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 group-hover:opacity-100 transition-opacity"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            Chat on WhatsApp
                        </a>
                    </div>

                    {/* Col 3 – Address */}
                    <div className="flex flex-col">
                        <p className="text-[0.6rem] lg:text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/30 font-montserrat mb-4">
                            Location
                        </p>
                        <div className="text-[0.85rem] text-white/60 font-outfit font-light leading-[1.8]">
                            <p className="m-0">NO.K-6, SIDCO, Kurichi,</p>
                            <p className="m-0">SIDCO Industrial Estate,</p>
                            <p className="m-0">Coimbatore, Tamil Nadu – 641021</p>
                        </div>
                        <p className="text-[0.65rem] text-white/40 font-outfit mt-5 tracking-[0.15em] uppercase font-medium">
                            GSTIN: 33FAXPM0581G1ZC
                        </p>
                    </div>

                    {/* Col 4 – Quick Links */}
                    <div className="flex flex-col">
                        <p className="text-[0.6rem] lg:text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/30 font-montserrat mb-4">
                            Explore
                        </p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Shop Furniture", href: "/shop" },
                                { label: "Bulk Orders", href: "/bulk-orders" },
                                { label: "Privacy Policy", href: "/privacy-policy" },
                                { label: "Terms & Conditions", href: "/terms" },
                            ].map((l) => (
                                <Link 
                                    key={l.href} 
                                    href={l.href} 
                                    className="text-[0.85rem] text-white/60 font-outfit font-light no-underline hover:text-white hover:translate-x-1 transition-all duration-300 w-fit"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── LEGAL & COPYRIGHT ──────────────────────────────── */}
                <div className="border-t border-white/[0.05] pt-8 pb-10 flex flex-col gap-6">
                    <p className="text-[0.75rem] text-white/40 font-outfit font-light leading-[1.8] max-w-2xl m-0">
                        All GST invoices and billing are issued under <strong className="text-white/60 font-normal">Indian Make Steel Industries</strong> in compliance with Indian tax regulations.
                    </p>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <p className="text-[0.6rem] text-white/30 font-montserrat tracking-[0.15em] uppercase m-0">
                            © {new Date().getFullYear()} SANRA LIVING. All Rights Reserved.
                        </p>
                        <p className="text-[0.6rem] text-white/30 font-montserrat tracking-[0.15em] uppercase m-0">
                            Engineered in Coimbatore, India.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
