import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import ProductClient from "./ProductClient";
import Script from "next/script";

// Define the shape of our product data
interface ProductParams {
    params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const matchColumn = isUUID ? "id" : "slug";

    const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq(matchColumn, id)
        .eq("is_active", true)
        .single();

    if (error || !data) return null;
    return data;
}

export async function generateMetadata({ params }: ProductParams): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return { title: "Product Not Found | SANRA LIVING" };
    }

    const title = product.seo_title || `${product.title} | Premium Steel Furniture | SANRA LIVING`;
    const description = product.seo_description || product.subtitle || `Buy ${product.title} online. Premium, minimalist luxury steel furniture by SANRA LIVING. Pan-India Delivery.`;
    const imageUrl = product.image_url;

    return {
        title,
        description,
        keywords: product.seo_keywords ? product.seo_keywords.split(',') : [product.title, "Steel furniture", "Luxury furniture India", product.category],
        openGraph: {
            title,
            description,
            url: `https://www.sanraliving.com/shop/${product.slug || product.id}`,
            images: imageUrl ? [{ url: imageUrl, width: 800, height: 800, alt: title }] : undefined,
            type: "website",
            siteName: "SANRA LIVING",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
        alternates: {
            canonical: `https://www.sanraliving.com/shop/${product.slug || product.id}`
        }
    };
}

export default async function ProductPage({ params }: ProductParams) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // JSON-LD Product Schema
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": product.image_url ? [product.image_url] : [],
        "description": product.seo_description || product.description || product.subtitle,
        "sku": product.sku || product.id,
        "mpn": product.sku || product.id,
        "brand": {
            "@type": "Brand",
            "name": "SANRA LIVING"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://www.sanraliving.com/shop/${product.slug || product.id}`,
            "priceCurrency": "INR",
            "price": product.price,
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.stock_qty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "SANRA LIVING"
            }
        }
    };

    return (
        <>
            <Script
                id="product-schema"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <ProductClient initialProduct={product} />
        </>
    );
}
