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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.sanraliving.com/#organization",
        "name": "SANRA LIVING",
        "url": "https://www.sanraliving.com",
        "logo": "https://www.sanraliving.com/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-95857-45303",
          "contactType": "sales",
          "areaServed": "IN",
          "availableLanguage": "en"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.sanraliving.com/#localbusiness",
        "name": "SANRA LIVING",
        "image": "https://www.sanraliving.com/steel-factory.png",
        "telephone": "+919585745303",
        "email": "hello@sanraliving.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "NO. K-6, SIDCO, Kurichi, SIDCO Industrial Estate",
          "addressLocality": "Coimbatore",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641021",
          "addressCountry": "IN"
        },
        "priceRange": "$$$",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        }
      }
    ]
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 1.5. TRUST BADGES STRIP */}
      <section className="bg-white border-y border-black/[0.04] overflow-hidden">
        <div className="relative w-full">
          <div className="absolute left-0 top-0 z-10 h-full w-16 sm:w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 z-10 h-full w-16 sm:w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          <div
            className="flex w-max"
            style={{ animation: "scroll 28s linear infinite" }}
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
                  <div key={text} className="flex items-center gap-3 px-8 sm:px-12 py-3.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880] flex-shrink-0" />
                    <span className="text-[0.58rem] uppercase tracking-[0.22em] text-black/50 font-montserrat font-medium whitespace-nowrap">
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
      <section className="grid grid-cols-1 lg:grid-cols-2 bg-[#1A1917] text-white overflow-hidden">
        {/* Image */}
        <div className="relative group" style={{ minHeight: "clamp(280px, 45vw, 600px)" }}>
          <img
            src="/steel-welding.png"
            alt="Sanra Steel Factory Craftsman welding steel"
            className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-45 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1A1917] via-[#1A1917]/50 to-transparent" />
        </div>
        {/* Content */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-20 lg:py-28 relative z-10">
          <p className="text-[0.56rem] tracking-[0.32em] uppercase text-[#C5A880] font-montserrat mb-4">Our Craft</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light font-montserrat text-white leading-[1.2] tracking-tight mb-5">
            Forged in Excellence.<br />Crafted in Coimbatore.
          </h2>
          <p className="text-[0.85rem] lg:text-base text-white/50 font-outfit font-light leading-[1.9] max-w-md mb-10">
            Our manufacturing facility combines traditional craftsmanship with precision engineering. We use only premium Jindal Steel to create furniture that lasts generations.
          </p>
          <div className="flex items-center gap-10 lg:gap-16">
            <div>
              <h4 className="text-3xl lg:text-4xl xl:text-5xl font-light font-montserrat text-white mb-1.5 tracking-tight">15+</h4>
              <p className="text-[0.56rem] uppercase tracking-[0.22em] text-white/35 font-montserrat">Years Expertise</p>
            </div>
            <div>
              <h4 className="text-3xl lg:text-4xl xl:text-5xl font-light font-montserrat text-white mb-1.5 tracking-tight">10k+</h4>
              <p className="text-[0.56rem] uppercase tracking-[0.22em] text-white/35 font-montserrat">Spaces Designed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Commercial / Enquiry CTA */}
      <section className="py-20 lg:py-28 px-6 bg-[#FCFCFA] text-center border-t border-black/[0.02]">
        <div className="max-w-xl mx-auto">
          <p className="text-[0.58rem] tracking-[0.28em] uppercase text-black/40 font-montserrat mb-5">Commercial & Bulk</p>
          <h2 className="text-2xl md:text-3xl font-light text-black font-montserrat tracking-tight mb-4">
            For Commercial Projects
          </h2>
          <p className="text-sm text-black/45 font-outfit font-light mb-10 max-w-sm mx-auto leading-[1.8]">
            Hotels, restaurants, and interior designers — speak with us directly for custom pricing and bulk orders.
          </p>
          <a 
            href="https://wa.me/918300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20commercial%20orders." 
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-[#1A1917] hover:bg-black text-white rounded-full font-montserrat text-[0.62rem] font-medium tracking-[0.22em] uppercase transition-all duration-500 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] active:scale-[0.97]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact on WhatsApp
          </a>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}