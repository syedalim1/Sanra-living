import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping & Replacement Policy – SANRA LIVING",
    description:
        "Learn about SANRA LIVING's shipping policy, delivery timelines, state-wise charges, Cash on Delivery options & replacement policy for steel furniture orders across India.",
    keywords: [
        "SANRA LIVING shipping policy", "steel furniture delivery India",
        "furniture shipping charges", "COD steel furniture",
        "furniture replacement policy", "SANRA LIVING delivery",
    ],
    alternates: { canonical: "/shipping-policy" },
    openGraph: {
        title: "Shipping & Replacement Policy – SANRA LIVING",
        description: "State-wise delivery timelines, shipping charges & replacement policy for steel furniture.",
        url: "/shipping-policy",
        type: "website",
    },
};

export default function ShippingPolicyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
