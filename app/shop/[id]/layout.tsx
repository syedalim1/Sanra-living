import { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { data: product } = await supabaseAdmin
        .from("products")
        .select("title, description, category, image_url, finish")
        .eq("id", params.id)
        .single();

    if (!product) {
        return {
            title: "Product Not Found | SANRA LIVING",
            description: "The requested product could not be found.",
        };
    }

    const descText = product.description 
        ? product.description.substring(0, 160)
        : `${product.title} – Premium ${product.finish || "steel"} ${product.category?.toLowerCase() || "furniture"} by SANRA LIVING. Heavy-duty, modern design. Contact us for bulk pricing.`;

    return {
        title: `${product.title} – ${product.category || "Furniture"} | SANRA LIVING`,
        description: descText,
        openGraph: {
            title: `${product.title} | SANRA LIVING`,
            description: descText,
            images: product.image_url ? [product.image_url] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: product.title,
            description: descText,
            images: product.image_url ? [product.image_url] : [],
        }
    };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
