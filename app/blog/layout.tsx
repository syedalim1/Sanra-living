import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog – Steel Furniture Guide & Interior Design Tips | SANRA LIVING",
    description:
        "Read expert articles on modern steel furniture, luxury interior design ideas, furniture buying guides, maintenance tips & more. SANRA LIVING Blog.",
    keywords: [
        "steel furniture blog", "modern furniture guide", "luxury steel interior design",
        "furniture buying guide India", "steel furniture maintenance tips",
        "modular furniture ideas", "best steel furniture for homes",
        "why steel furniture is better than wood",
    ],
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Blog – Steel Furniture Guide & Tips | SANRA LIVING",
        description: "Expert articles on modern steel furniture, interior design ideas & buying guides.",
        url: "/blog",
        type: "website",
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
