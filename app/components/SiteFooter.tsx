import Link from "next/link";

export default function SiteFooter() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture.";

    return (
        <footer className="bg-[#111111] text-white font-montserrat pb-20 lg:pb-0">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 lg:pt-20">

                {/* ── MAIN CONTENT ──────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12 lg:mb-16">

                    {/* Col 1 – Brand */}
                    <div>
                        <div className="text-base lg:text-lg font-black tracking-[0.15em] text-white uppercase mb-1">SANRA LIVING</div>
                        <div className="text-[0.6rem] lg:text-[0.65rem] font-semibold tracking-[0.2em] text-white/50 uppercase mb-6">Steel Furniture Manufacturer</div>
                        <p className="text-sm text-white/60 font-outfit font-light leading-relaxed max-w-[280px]">
                            Premium steel furniture brand owned and operated by <strong className="text-white/80 font-normal">Indian Make Steel Industries</strong>.
                        </p>
                    </div>

                    {/* Col 2 – Contact Info */}
                    <div>
                        <p className="text-[0.65rem] lg:text-xs font-bold tracking-[0.2em] uppercase text-white/40 font-montserrat mb-5">
                            Contact
                        </p>
                        <div className="text-sm text-white/60 font-outfit font-light leading-loose">
                            <p className="m-0 mb-2 hover:text-white transition-colors duration-300">📞 9585745303 / 8300904920</p>
                            <p className="m-0 mb-4">✉ <a href="mailto:hello@sanraliving.com" className="text-white/60 no-underline hover:text-white transition-colors duration-300">hello@sanraliving.com</a></p>
                        </div>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-white/10 text-white text-[0.7rem] lg:text-xs font-semibold tracking-[0.15em] uppercase no-underline font-montserrat rounded-xl hover:bg-white hover:text-black transition-all duration-300"
                        >
                            💬 Chat on WhatsApp
                        </a>
                    </div>

                    {/* Col 3 – Address */}
                    <div>
                        <p className="text-[0.65rem] lg:text-xs font-bold tracking-[0.2em] uppercase text-white/40 font-montserrat mb-5">
                            Address
                        </p>
                        <div className="text-sm text-white/60 font-outfit font-light leading-loose">
                            <p className="m-0">NO.K-6, SIDCO, Kurichi,</p>
                            <p className="m-0">SIDCO Industrial Estate,</p>
                            <p className="m-0">Coimbatore, Tamil Nadu – 641021</p>
                        </div>
                        <p className="text-xs text-white/40 font-outfit mt-6 tracking-wide">
                            GSTIN: 33FAXPM0581G1ZC
                        </p>
                    </div>

                    {/* Col 4 – Quick Links */}
                    <div>
                        <p className="text-[0.65rem] lg:text-xs font-bold tracking-[0.2em] uppercase text-white/40 font-montserrat mb-5">
                            Quick Links
                        </p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Products", href: "/shop" },
                                { label: "Bulk Orders", href: "/bulk-orders" },
                                { label: "Privacy Policy", href: "/privacy-policy" },
                                { label: "Terms & Conditions", href: "/terms" },
                            ].map((l) => (
                                <Link 
                                    key={l.href} 
                                    href={l.href} 
                                    className="text-sm text-white/60 font-outfit font-light no-underline hover:text-white hover:translate-x-1 transition-all duration-300 w-fit"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── LEGAL DISCLOSURE ──────────────────────────────── */}
                <div className="border-t border-white/5 pt-8">
                    <p className="text-xs text-white/40 font-outfit font-light leading-relaxed max-w-2xl m-0 mb-4">
                        All GST invoices and billing are issued under <strong className="text-white/60 font-normal">Indian Make Steel Industries</strong> in compliance with Indian tax regulations.
                    </p>
                </div>

                {/* ── BOTTOM STRIP ──────────────────────────────────── */}
                <div className="border-t border-white/5 py-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <p className="text-xs text-white/40 font-montserrat tracking-[0.1em] uppercase m-0">
                        © {new Date().getFullYear()} SANRA LIVING. All Rights Reserved.
                    </p>
                    <p className="text-xs text-white/40 font-montserrat tracking-[0.1em] uppercase m-0">
                        A Steel Furniture Brand by Indian Make Steel Industries.
                    </p>
                </div>
            </div>
        </footer>
    );
}
