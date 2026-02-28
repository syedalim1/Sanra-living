import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy – SANRA LIVING",
    description:
        "SANRA LIVING's privacy policy explains how we collect, use and protect your personal information when you shop for steel furniture on sanraliving.com.",
    alternates: { canonical: "/privacy-policy" },
    openGraph: {
        title: "Privacy Policy – SANRA LIVING",
        description: "How SANRA LIVING handles your personal information and data privacy.",
        url: "/privacy-policy",
        type: "website",
    },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
