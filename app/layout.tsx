import type { Metadata } from "next";
import { Inter, Montserrat, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
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
  ],
  authors: [{ name: "SANRA LIVING" }],
  creator: "SANRA LIVING",
  publisher: "SANRA LIVING",
  robots: { index: true, follow: true },
  metadataBase: new URL("https://www.sanraliving.com"),
  alternates: { canonical: "/" },
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
  "@type": "Organization",
  name: "SANRA LIVING",
  url: "https://www.sanraliving.com",
  logo: "https://www.sanraliving.com/logo.png",
  description:
    "Premium and luxury steel furniture brand in India offering modern, custom and designer metal furniture for homes, offices and resellers.",
  address: { "@type": "PostalAddress", addressCountry: "India" },
  sameAs: [
    "https://www.instagram.com/sanraliving",
    "https://www.youtube.com/@sanraliving",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SANRA LIVING",
  url: "https://www.sanraliving.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.sanraliving.com/shop?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
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
