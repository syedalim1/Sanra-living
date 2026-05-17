import React from "react";
import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import WhatsAppFloat from "./components/WhatsAppFloat";

/* ── Homepage Sections ── */
import HeroSection from "./components/home/HeroSection";
import CategoryGrid from "./components/home/CategoryGrid";
import FeaturedProducts from "./components/home/FeaturedProducts";
import ApplicationShowcase from "./components/home/ApplicationShowcase";

export const metadata: Metadata = {
  title: "SANRA LIVING | Premium Steel Furniture Manufacturer Coimbatore",
  description: "Modern luxury stainless steel and powder-coated furniture. Dining chairs, tables, and bulk restaurant/hotel furniture manufactured in Coimbatore. Buy online.",
  alternates: { canonical: "https://www.sanraliving.com/" }
};

export default function Homepage() {
  return (
    <div className="bg-white min-h-screen">
      <SiteHeader />
      
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 1.5. TRUST BADGES STRIP */}
      <section className="bg-white border-b border-black/[0.04] overflow-hidden">

  <div className="relative w-full">

    {/* Left Fade */}
    <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />

    {/* Right Fade */}
    <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />

    <div
      className="flex w-max"
      style={{
        animation: "scroll 25s linear infinite",
      }}
    >

      {[...Array(2)].map((_, i) => (

        <div key={i} className="flex shrink-0 items-center">

          {[
            "10 Year Warranty",
            "Premium Jindal Steel",
            "Pan India Delivery",
            "Secure Payments",
            "Made in Coimbatore",
          ].map((text) => (

            <div
              key={text}
              className="flex items-center gap-3 px-10 py-5 shrink-0"
            >

              <div className="w-1.5 h-1.5 rounded-full bg-black/30" />

              <span className="text-[0.58rem] uppercase tracking-[0.28em] text-black/55 whitespace-nowrap font-light">
                {text}
              </span>

            </div>

          ))}

        </div>

      ))}

    </div>

  </div>

</section>
      {/* 2. Visual Categories */}
      <CategoryGrid />

      {/* 3. Best Sellers Carousel */}
      <FeaturedProducts 
        title="Curated Selection" 
        filterBy="bestseller" 
        limit={9} 
      />

      {/* 4. Application/Space Showcase */}
      <ApplicationShowcase />

      {/* 5. Factory/Workshop Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 bg-[#0A0A0A] text-white">
        <div className="relative lg:min-h-[600px] w-full">
            {/* <img 
                src="/steel-welding.png" 
                alt="Sanra Steel Factory" 
                className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-50 mix-blend-luminosity"
            /> */}
            {/* <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" /> */}
        </div>
        <div className="flex flex-col justify-center px-8 py-16 lg:px-24 lg:py-32 relative z-10">
            <p className="text-[0.58rem] tracking-[0.3em] uppercase text-white/30 font-montserrat mb-5">Our Craft</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-montserrat text-white leading-[1.15] tracking-tight mb-6">
                Forged in Excellence.<br />Crafted in Coimbatore.
            </h2>
            <p className="text-sm lg:text-base text-white/40 font-outfit font-light leading-[1.9] max-w-lg mb-12">
                Our manufacturing facility combines traditional craftsmanship with precision engineering. We use only premium Jindal Steel to create furniture that lasts generations.
            </p>
            <div className="flex items-center gap-10 lg:gap-16">
                <div>
                    <h4 className="text-4xl lg:text-5xl font-light font-montserrat text-white mb-2 tracking-tight">15+</h4>
                    <p className="text-[0.58rem] lg:text-[0.62rem] uppercase tracking-[0.22em] text-white/35 font-montserrat">Years Expertise</p>
                </div>
                <div>
                    <h4 className="text-4xl lg:text-5xl font-light font-montserrat text-white mb-2 tracking-tight">10k+</h4>
                    <p className="text-[0.58rem] lg:text-[0.62rem] uppercase tracking-[0.22em] text-white/35 font-montserrat">Spaces Designed</p>
                </div>
            </div>
        </div>
      </section>

      {/* 6. Commercial / Enquiry CTA */}
      <section className="py-16 lg:py-24 px-6 bg-white text-center border-t border-black/[0.04]">
          <div className="max-w-xl mx-auto">
              <p className="text-[0.58rem] tracking-[0.28em] uppercase text-black/30 font-montserrat mb-5">Commercial & Bulk</p>
              <h2 className="text-2xl md:text-3xl font-light text-black font-montserrat tracking-tight mb-4">
                  For Commercial Projects
              </h2>
              <p className="text-sm text-black/40 font-outfit font-light mb-10 max-w-sm mx-auto leading-[1.8]">
                  Hotels, restaurants, and interior designers — speak with us directly for custom pricing and bulk orders.
              </p>
              <a 
                  href="https://wa.me/8300904920" 
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#111] text-white rounded-full font-montserrat text-[0.62rem] font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:bg-black hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
              >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Get in Touch
              </a>
          </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}