import type { Metadata } from "next";
import { Inter, Montserrat, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/app/context/CartContext";
import "./globals.css";

import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/* ── GLOBAL SEO METADATA ─────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "SANRA LIVING | Premium & Luxury Steel Furniture Brand in India",
    template: "%s | SANRA LIVING",
  },
  description:
    "SANRA LIVING is India's premium steel furniture brand offering 100+ modern, luxury & custom steel furniture models for homes, offices & resellers. State-wise shipping across Tamil Nadu, Kerala & all India.",
  keywords: [
    "Steel furniture India", "Premium steel furniture", "Luxury steel furniture",
    "Modern steel furniture", "Industrial furniture India", "Steel shoe rack online",
    "Steel table India", "Steel chair manufacturer", "Custom steel furniture India",
    "Steel furniture Tamil Nadu", "Steel furniture Kerala", "Steel furniture wholesale India",
    "Balcony steel furniture", "Office steel furniture", "Designer metal furniture India",
    "Powder coated steel furniture", "Heavy duty steel furniture", "Modular steel furniture",
    "Space saving steel furniture", "Contemporary steel furniture",
    /* Long-tail & regional */
    "buy steel shoe rack online India", "steel wardrobe manufacturer Coimbatore",
    "steel study table for home", "dismantlable steel furniture",
    "steel furniture Coimbatore", "steel furniture Chennai", "steel furniture Bangalore",
    "steel furniture Hyderabad", "steel furniture manufacturer South India",
    "steel bed frame India", "steel dining table set", "steel bookshelf online",
    "CNC cut steel furniture", "custom metal furniture India",
    "steel furniture for hostel", "institutional steel furniture India",
    "bulk steel furniture order", "commercial steel furniture manufacturer",
    "powder coated shoe rack", "steel wall shelf India",
    "steel coffee table", "steel nightstand India", "steel outdoor furniture India",
    "Sanra Living", "SANRA LIVING furniture", "sanraliving.com",
  ],
  category: "Furniture",
  formatDetection: { telephone: false },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Coimbatore",
    "geo.position": "10.9925;76.9614",
    "ICBM": "10.9925, 76.9614",
    "revisit-after": "3 days",
    "rating": "general",
    "distribution": "global",
    "coverage": "India",
  },
  authors: [{ name: "SANRA LIVING" }],
  creator: "SANRA LIVING",
  publisher: "SANRA LIVING",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  metadataBase: new URL("https://www.sanraliving.com"),
  alternates: { canonical: "/" },
  verification: {
    /* Replace with actual IDs when available */
    // google: "YOUR_GOOGLE_SITE_VERIFICATION_ID",
    // yandex: "YOUR_YANDEX_VERIFICATION_ID",
    other: { "msvalidate.01": "" },
  },
  openGraph: {
    title: "SANRA LIVING | Premium Steel Furniture India",
    description: "Explore 100+ luxury, modern & custom steel furniture models. State-wise delivery across India.",
    type: "website",
    url: "https://www.sanraliving.com/",
    siteName: "SANRA LIVING",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SANRA LIVING – Premium Steel Furniture India",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANRA LIVING | Premium Steel Furniture India",
    description: "100+ luxury, modern & custom steel furniture. Delivered across India.",
    images: ["/og-image.jpg"],
  },
};

/* ── STRUCTURED DATA (LD+JSON) ──────────────────────── */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "FurnitureStore", "LocalBusiness"],
  name: "SANRA LIVING",
  legalName: "Indian Make Steel Industries",
  url: "https://www.sanraliving.com",
  logo: "https://www.sanraliving.com/logo.png",
  image: "https://www.sanraliving.com/og-image.jpg",
  description: "Premium luxury steel furniture brand. Manufacturer of modern stainless steel and powder-coated furniture in Coimbatore, India. Perfect for homes, restaurants, hostels, and hotels.",
  telephone: ["+91-9585745303", "+91-8300904920"],
  email: "hello@sanraliving.com",
  taxID: "33FAXPM0581G1ZC",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    streetAddress: "NO.K-6, SIDCO, Kurichi, SIDCO Industrial Estate",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    postalCode: "641021",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "10.9925",
    longitude: "76.9614",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  priceRange: "₹₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking, Cash on Delivery",
  openingHours: "Mo-Sa 09:00-18:00",
  sameAs: [
    "https://www.instagram.com/sanraliving",
    "https://www.facebook.com/sanraliving",
    "https://www.pinterest.com/sanraliving",
    "https://www.youtube.com/@sanraliving",
    "https://www.linkedin.com/company/sanraliving"
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Premium Steel Furniture Collection",
    itemListElement: [
      { "@type": "OfferCatalog", name: "Steel Chairs", url: "https://www.sanraliving.com/shop/seating" },
      { "@type": "OfferCatalog", name: "Steel Tables", url: "https://www.sanraliving.com/shop/tables" },
      { "@type": "OfferCatalog", name: "Steel Storage", url: "https://www.sanraliving.com/shop/storage" },
      { "@type": "OfferCatalog", name: "Steel Bedroom Furniture", url: "https://www.sanraliving.com/shop/bedroom" },
      { "@type": "OfferCatalog", name: "Workspace Furniture", url: "https://www.sanraliving.com/shop/workspace" },
      { "@type": "OfferCatalog", name: "Bulk Commercial Furniture", url: "https://www.sanraliving.com/bulk-orders" },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SANRA LIVING",
  alternateName: "Sanra Living Steel Furniture",
  url: "https://www.sanraliving.com",
  inLanguage: "en-IN",
  publisher: { "@type": "Organization", name: "SANRA LIVING", url: "https://www.sanraliving.com" },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://www.sanraliving.com/shop?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sanraliving.com" },
    { "@type": "ListItem", position: 2, name: "Shop", item: "https://www.sanraliving.com/shop" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script
            id="schema-org"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          <Script
            id="schema-website"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
          <Script
            id="schema-breadcrumb"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        </head>
        <body className={`${inter.variable} ${montserrat.variable} ${outfit.variable} antialiased`}>
            <CartProvider>
              {children}
            </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
