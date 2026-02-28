import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bulk & Institutional Steel Furniture Orders – SANRA LIVING",
    description:
        "Order premium steel furniture in bulk for offices, hostels, institutions & commercial spaces. Direct manufacturer pricing, pan-India delivery. SANRA LIVING by Indian Make Steel Industries.",
    keywords: [
        "bulk steel furniture India", "institutional furniture order", "office furniture bulk order",
        "hostel furniture manufacturer", "commercial steel furniture India",
        "steel furniture wholesale", "bulk furniture Coimbatore",
        "school furniture manufacturer India", "steel furniture supplier",
    ],
    alternates: { canonical: "/bulk-orders" },
    openGraph: {
        title: "Bulk & Institutional Steel Furniture – SANRA LIVING",
        description: "Premium steel furniture for large-scale projects. Direct manufacturer pricing with pan-India logistics.",
        url: "/bulk-orders",
        type: "website",
    },
};

export default function BulkOrdersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
