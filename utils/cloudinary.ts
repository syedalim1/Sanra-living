/**
 * Cloudinary URL Auto-Optimization
 *
 * Transforms Cloudinary URLs to include automatic format,
 * quality, and width optimizations.
 *
 * @param url  – The original Cloudinary image URL
 * @param width – Desired width in pixels (default 800)
 * @returns      Optimized URL string
 */
export const optimizeImage = (url: string | undefined | null, width = 800): string => {
    if (!url) return "";

    // Only transform Cloudinary URLs
    if (!url.includes("/upload/")) return url;

    return url.replace(
        "/upload/",
        `/upload/f_auto,q_auto,w_${width}/`,
    );
};

/**
 * Pre-defined size helpers
 */
export const imgThumb = (url: string | undefined | null) => optimizeImage(url, 200);
export const imgCard = (url: string | undefined | null) => optimizeImage(url, 400);
export const imgFull = (url: string | undefined | null) => optimizeImage(url, 800);
export const imgHero = (url: string | undefined | null) => optimizeImage(url, 1200);

/**
 * Cloudinary Video Optimization
 *
 * Transforms Cloudinary video URLs for optimal delivery:
 * - Auto format (WebM/MP4 based on browser)
 * - Auto quality compression
 * - Width-based resizing
 */
export const optimizeVideo = (url: string | undefined | null, width = 720): string => {
    if (!url) return "";
    if (!url.includes("/upload/")) return url;
    return url.replace(
        "/upload/",
        `/upload/f_auto,q_auto,w_${width}/`,
    );
};

/**
 * Get video thumbnail from a Cloudinary video URL.
 * Converts the video URL to a JPG poster image at a specific time offset.
 */
export const videoThumb = (url: string | undefined | null, width = 400): string => {
    if (!url) return "";
    if (!url.includes("/upload/")) return url;
    // Replace video extension with .jpg and add thumbnail transformations
    const thumbUrl = url
        .replace("/upload/", `/upload/f_jpg,q_auto,w_${width},so_1/`)
        .replace(/\.(mp4|webm|mov|avi|mkv)$/i, ".jpg");
    return thumbUrl;
};
