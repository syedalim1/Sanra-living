import Link from "next/link";

export default function SiteFooter() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture.";

    return (
        <footer className="bg-[#1C1C1C] text-white font-montserrat pb-20 lg:pb-0">
            <div className="max-w-7xl mx-auto px-5 pt-6 lg:pt-8 md:px-6 lg:px-8">

                {/* ── MAIN CONTENT ──────────────────────────────────── */}
                <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8 lg:mb-12">

                    {/* Col 1 – Brand */}
                    <div>
                        <div className="text-sm lg:text-base font-black tracking-widest text-white uppercase mb-1">SANRA LIVING</div>
                        <div className="text-[0.6rem] lg:text-[0.65rem] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-4">Steel Furniture Manufacturer</div>
                        <p className="text-[0.8rem] lg:text-sm text-gray-400 font-outfit leading-relaxed max-w-[300px] mb-4">
                            Premium steel furniture brand owned and operated by <strong className="text-gray-300">Indian Make Steel Industries</strong>.
                        </p>
                    </div>

                    {/* Col 2 – Contact Info */}
                    <div>
                        <p className="text-[0.65rem] lg:text-xs font-bold tracking-[0.2em] uppercase text-white font-montserrat mb-3">
                            Contact
                        </p>
                        <div className="text-[0.8rem] lg:text-sm text-gray-400 font-outfit leading-loose">
                            <p className="m-0 mb-1">📞 9585745303 / 8300904920</p>
                            <p className="m-0 mb-1">✉ <a href="mailto:hello@sanraliving.com" className="text-gray-400 no-underline hover:text-white transition-colors">hello@sanraliving.com</a></p>
                        </div>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 px-5 py-3 bg-[#25D366] text-white text-[0.7rem] lg:text-xs font-bold tracking-widest uppercase no-underline font-montserrat rounded hover:bg-[#20ba59] transition-colors"
                        >
                            💬 Chat on WhatsApp
                        </a>
                    </div>

                    {/* Col 3 – Address */}
                    <div>
                        <p className="text-[0.65rem] lg:text-xs font-bold tracking-[0.2em] uppercase text-white font-montserrat mb-3">
                            Address
                        </p>
                        <div className="text-[0.8rem] lg:text-sm text-gray-400 font-outfit leading-loose">
                            <p className="m-0 mb-1">NO.K-6, SIDCO, Kurichi,</p>
                            <p className="m-0 mb-1">SIDCO Industrial Estate,</p>
                            <p className="m-0 mb-1">Coimbatore, Tamil Nadu – 641021</p>
                        </div>
                        <p className="text-[0.7rem] lg:text-xs text-gray-500 font-outfit mt-4">
                            GSTIN: 33FAXPM0581G1ZC
                        </p>
                    </div>

                    {/* Col 4 – Quick Links */}
                    <div>
                        <p className="text-[0.65rem] lg:text-xs font-bold tracking-[0.2em] uppercase text-white font-montserrat mb-3">
                            Quick Links
                        </p>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: "Products", href: "/shop" },
                                { label: "Bulk Orders", href: "/bulk-orders" },
                                { label: "Privacy Policy", href: "/privacy-policy" },
                                { label: "Terms & Conditions", href: "/terms" },
                            ].map((l) => (
                                <Link 
                                    key={l.href} 
                                    href={l.href} 
                                    className="text-[0.8rem] lg:text-sm text-gray-400 font-outfit no-underline leading-loose hover:text-white transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── LEGAL DISCLOSURE ──────────────────────────────── */}
                <div className="border-t border-white/10 pt-6">
                    <p className="text-[0.7rem] lg:text-xs text-gray-500 font-outfit leading-relaxed max-w-[600px] m-0 mb-2">
                        All GST invoices and billing are issued under <strong className="text-gray-400">Indian Make Steel Industries</strong> in compliance with Indian tax regulations.
                    </p>
                </div>

                {/* ── BOTTOM STRIP ──────────────────────────────────── */}
                <div className="border-t border-white/10 mt-4 py-6 flex flex-col lg:flex-row gap-2 justify-between items-start lg:items-center">
                    <p className="text-[0.7rem] lg:text-xs text-gray-500 font-montserrat tracking-wider m-0">
                        © {new Date().getFullYear()} SANRA LIVING. All Rights Reserved.
                    </p>
                    <p className="text-[0.7rem] lg:text-xs text-gray-500 font-montserrat tracking-wide m-0 text-left lg:text-right">
                        A Steel Furniture Brand by Indian Make Steel Industries.
                    </p>
                </div>
            </div>
        </footer>
    );
}
