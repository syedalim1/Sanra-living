import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop Premium Steel Furniture Online – SANRA LIVING",
    description:
        "Browse 100+ premium steel furniture models across seating, tables, storage, bedroom, workspace, balcony, modular systems & more. Powder-coated finishes, dismantlable designs, state-wise delivery across India.",
    alternates: { canonical: "/shop" },
    openGraph: {
        title: "Shop Steel Furniture – SANRA LIVING",
        description: "100+ premium steel furniture models. Browse by category, filter by finish & price.",
        url: "/shop",
    },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
