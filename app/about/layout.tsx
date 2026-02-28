import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About SANRA LIVING – Premium Steel Furniture Brand India",
    description:
        "Learn about SANRA LIVING, India's premium steel furniture brand by Indian Make Steel Industries. Engineered steel furniture for modern homes, offices & institutions. Based in Coimbatore, Tamil Nadu.",
    keywords: [
        "about SANRA LIVING", "steel furniture brand India", "Indian Make Steel Industries",
        "steel furniture manufacturer Coimbatore", "premium furniture brand Tamil Nadu",
        "engineered steel furniture", "about sanraliving",
    ],
    alternates: { canonical: "/about" },
    openGraph: {
        title: "About SANRA LIVING – Engineered Steel Furniture Brand",
        description: "Discover the story behind India's premium steel furniture brand. Structural-grade steel, CNC precision, 10-year warranty.",
        url: "/about",
        type: "website",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
