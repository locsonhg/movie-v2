import type { MovieImagesData } from "@/types/ophim";

const PHIMIMG_BASE = "https://phimimg.com";

/** Normalize CDN base URL: strip old img.ophim.live domain */
function normalizeCdn(cdnUrl: string): string {
  return cdnUrl
    .replace("https://img.ophim.live/uploads/movies", PHIMIMG_BASE)
    .replace("https://img.ophim.live", PHIMIMG_BASE)
    .replace(/\/$/, ""); // remove trailing slash
}

/**
 * Build the correct image URL from a thumb_url/poster_url value.
 * Handles:
 *  - Absolute img.ophim.live URLs (old CDN) → swap domain
 *  - Relative paths → prepend normalized CDN base
 *  - Other absolute URLs → use as-is
 */
export function normalizeImageUrl(url: string, cdnUrl: string): string {
  if (!url) return "";

  // Always normalize the CDN base so we never call img.ophim.live
  const base = normalizeCdn(cdnUrl);

  // Absolute img.ophim.live URL — swap to phimimg.com
  if (url.startsWith("https://img.ophim.live")) {
    return url.replace("https://img.ophim.live", PHIMIMG_BASE);
  }

  // Other absolute URLs — use as-is
  if (url.startsWith("http")) {
    return url;
  }

  // Relative path — prepend normalized CDN base
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;
  return `${base}/${cleanPath}`;
}

/**
 * Build a full TMDB image URL from the /images API response.
 * @param imageSizes  - `data.image_sizes` from MovieImagesData
 * @param type        - "backdrop" or "poster"
 * @param filePath    - e.g. "/bxQCOVPIlAmNpTF25ghGlTNeF3z.jpg"
 * @param size        - preferred size key, defaults to w1280 for backdrop / w500 for poster
 */
export function buildTmdbImageUrl(
  imageSizes: MovieImagesData["image_sizes"],
  type: "backdrop" | "poster",
  filePath: string,
  size?: string
): string {
  const sizeMap = type === "backdrop" ? imageSizes.backdrop : imageSizes.poster;
  const preferredSize = size ?? (type === "backdrop" ? "w1280" : "w500");
  const baseUrl = sizeMap[preferredSize] ?? sizeMap["original"] ?? "";
  return `${baseUrl}${filePath}`;
}
