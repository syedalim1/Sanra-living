"use client";

import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";

export default function ContactPage() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I%20have%20a%20question%20about%20SANRA%20LIVING%20furniture.";

    return (
        <main className="bg-white min-h-screen font-outfit">
            <SiteHeader />

            {/* ── HERO SECTION ──────────────────────────── */}
            <section className="pt-20 pb-10 lg:pt-28 lg:pb-12 px-6 lg:px-8 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight font-montserrat leading-[1.1] mb-6">
                    Let’s Build Your Space.
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                    Connect with SANRA Living for premium steel furniture, bulk orders, commercial projects, and custom requirements.
                </p>
            </section>

            {/* ── PREMIUM VISUAL SECTION ───────────────── */}
            <section className="px-6 lg:px-8 max-w-6xl mx-auto mb-16 lg:mb-24">
                <div className="w-full relative aspect-[21/9] lg:aspect-[24/9] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                    <img 
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2000&q=80" 
                        alt="Premium Furniture Craftsmanship" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
                </div>
            </section>

            {/* ── CONTACT CARDS ──────────────────────────── */}
            <section className="px-6 lg:px-8 max-w-6xl mx-auto mb-20 lg:mb-28">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    
                    {/* WhatsApp Card (Prioritized) */}
                    <div className="bg-white border-2 border-[#E8F5E9] rounded-2xl p-8 lg:p-10 flex flex-col items-center text-center shadow-[0_8px_30px_rgba(37,211,102,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#25D366]" />
                        <div className="w-14 h-14 bg-[#E8F5E9] text-[#25D366] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>
                        <h2 className="text-sm font-bold text-black uppercase tracking-widest font-montserrat mb-3">WhatsApp</h2>
                        <p className="text-sm text-gray-500 font-light mb-8">Fastest way to connect with our team.</p>
                        <div className="mt-auto w-full">
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-[#25D366] text-white font-bold text-xs tracking-[0.15em] uppercase font-montserrat rounded-xl hover:bg-[#20bd5a] hover:shadow-lg transition-all duration-300"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white border border-black/5 rounded-2xl p-8 lg:p-10 flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-gray-50 text-black rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h2 className="text-sm font-bold text-black uppercase tracking-widest font-montserrat mb-5">Phone</h2>
                        <div className="flex flex-col gap-2 mb-6">
                            <a href="tel:+919585745303" className="text-lg text-black font-semibold font-montserrat tracking-tight hover:text-gray-600 transition-colors">
                                +91 95857 45303
                            </a>
                            <a href="tel:+918300904920" className="text-lg text-black font-semibold font-montserrat tracking-tight hover:text-gray-600 transition-colors">
                                +91 83009 04920
                            </a>
                        </div>
                        <div className="mt-auto pt-4 border-t border-black/5 w-full">
                            <p className="text-xs text-gray-400 font-outfit uppercase tracking-wider font-medium">Business Hours</p>
                            <p className="text-sm text-gray-500 font-outfit mt-1">Mon – Sat, 10 AM – 6 PM</p>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white border border-black/5 rounded-2xl p-8 lg:p-10 flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-gray-50 text-black rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <h2 className="text-sm font-bold text-black uppercase tracking-widest font-montserrat mb-5">Location</h2>
                        <div className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                            <p>NO.K-6, SIDCO, Kurichi,</p>
                            <p>SIDCO Industrial Estate,</p>
                            <p>Coimbatore, TN – 641021</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-black/5 w-full">
                            <p className="text-[0.65rem] text-gray-400 font-montserrat uppercase tracking-[0.15em]">GSTIN</p>
                            <p className="text-xs text-gray-400 font-outfit mt-1">33FAXPM0581G1ZC</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── HOW WE CAN HELP (TRUST SECTION) ───────── */}
            <section className="bg-[#F9F9F9] py-20 lg:py-28 border-y border-black/5">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl lg:text-3xl font-black text-black tracking-tight font-montserrat">
                            How We Can Help
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {[
                            { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", title: "Commercial Projects" },
                            { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", title: "Bulk Orders" },
                            { icon: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z", title: "Custom Requirements" },
                            { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "Product Assistance" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-black/5 flex flex-col items-center text-center shadow-sm">
                                <svg className="w-6 h-6 text-black mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                <h3 className="text-sm font-semibold text-black tracking-wide font-montserrat">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MAP SECTION ────────────────────────────── */}
            <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] bg-gray-100 relative">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3917.4725066914567!2d76.9687!3d10.9272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85b002c000001%3A0x2a0c8b0!2sSIDCO%20Industrial%20Estate%2C%20Kurichi%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="SANRA Living Location"
                        className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
                    ></iframe>
                </div>
            </section>

            {/* ── MINI BRAND STORY ───────────────────────── */}
            <section className="bg-black py-24 lg:py-32 px-6 lg:px-8 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight font-montserrat mb-6 leading-tight">
                        Built in Coimbatore.<br/>Designed for Modern India.
                    </h2>
                    <p className="text-base text-gray-400 font-outfit font-light">
                        Premium steel furniture crafted with durability, simplicity, and modern living in mind.
                    </p>
                </div>
            </section>

            <SiteFooter />
            <WhatsAppFloat />
        </main>
    );
}
