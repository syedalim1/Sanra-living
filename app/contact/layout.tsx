import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us – SANRA LIVING Steel Furniture",
    description:
        "Get in touch with SANRA LIVING for product enquiries, bulk orders, warranty claims & support. Email: hello@sanraliving.com | Phone: 9585745303. Coimbatore, Tamil Nadu.",
    keywords: [
        "contact SANRA LIVING", "steel furniture support", "SANRA LIVING phone number",
        "steel furniture enquiry India", "bulk order steel furniture contact",
        "SANRA LIVING email", "furniture support Coimbatore",
    ],
    alternates: { canonical: "/contact" },
    openGraph: {
        title: "Contact SANRA LIVING – Steel Furniture Enquiries & Support",
        description: "Reach out for product enquiries, bulk orders, warranty claims & support. Response within 24-48 hours.",
        url: "/contact",
        type: "website",
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
