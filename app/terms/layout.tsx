import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions – SANRA LIVING",
    description:
        "Read the terms and conditions for using the SANRA LIVING website and purchasing steel furniture products. Operated by Indian Make Steel Industries, Coimbatore.",
    alternates: { canonical: "/terms" },
    openGraph: {
        title: "Terms & Conditions – SANRA LIVING",
        description: "Terms of use and purchase conditions for SANRA LIVING steel furniture.",
        url: "/terms",
        type: "website",
    },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
