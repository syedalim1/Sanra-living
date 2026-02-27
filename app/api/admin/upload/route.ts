import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function checkAdminKey(req: NextRequest) {
    const key = req.headers.get("x-admin-key");
    return key === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const mediaType = (formData.get("type") as string) || "image"; // "image" or "video"

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type based on media type
        if (mediaType === "video") {
            const allowedVideo = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
            if (!allowedVideo.includes(file.type)) {
                return NextResponse.json({ error: "Invalid video format. Allowed: MP4, WebM, MOV, AVI" }, { status: 400 });
            }
            // Max 100MB for video
            if (file.size > 100 * 1024 * 1024) {
                return NextResponse.json({ error: "Video too large. Maximum 100MB." }, { status: 400 });
            }
        } else {
            const allowedImage = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
            if (!allowedImage.includes(file.type)) {
                return NextResponse.json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, GIF" }, { status: 400 });
            }
            // Max 10MB for image
            if (file.size > 10 * 1024 * 1024) {
                return NextResponse.json({ error: "File too large. Maximum 10MB." }, { status: 400 });
            }
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const isVideo = mediaType === "video";
        const folder = isVideo ? "sanra-living/videos" : "sanra-living/products";

        // Upload to Cloudinary
        const result = await new Promise<{
            secure_url: string;
            public_id: string;
            width: number;
            height: number;
            format: string;
            bytes: number;
            duration?: number;
        }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: isVideo ? "video" : "image",
                    ...(isVideo
                        ? {
                            // Video-specific optimizations
                            eager: [
                                { streaming_profile: "auto", format: "m3u8" }, // HLS adaptive streaming
                            ],
                            eager_async: true,
                        }
                        : {
                            transformation: [
                                { quality: "auto:good", fetch_format: "auto" },
                            ],
                        }),
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as any);
                },
            ).end(buffer);
        });

        // For videos, generate a thumbnail URL
        let thumbnail_url = "";
        if (isVideo) {
            thumbnail_url = cloudinary.url(result.public_id, {
                resource_type: "video",
                format: "jpg",
                transformation: [
                    { width: 480, crop: "scale", quality: "auto", start_offset: "1" },
                ],
            });
        }

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
            duration: result.duration ?? null,
            thumbnail_url,
            media_type: isVideo ? "video" : "image",
        });
    } catch (err) {
        console.error("[admin/upload POST]", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// Delete media from Cloudinary
export async function DELETE(req: NextRequest) {
    if (!checkAdminKey(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const publicId = searchParams.get("public_id");
        const resourceType = searchParams.get("resource_type") || "image";
        if (!publicId) {
            return NextResponse.json({ error: "public_id is required" }, { status: 400 });
        }
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[admin/upload DELETE]", err);
        return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
    }
}
