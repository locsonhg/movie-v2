import type { Metadata } from "next";
import { WatchClientWrapper } from "./WatchClientWrapper";
import { ophimService } from "@/services/ophimService";
import { normalizeImageUrl, buildTmdbImageUrl } from "@/utils/image";
import { OPHIM_CONFIG } from "@/constants/ophim";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Strip HTML tags and trim whitespace for use in meta description */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Fetch movie detail and images in parallel
    const [detailRes, imagesRes] = await Promise.allSettled([
      ophimService.getMovieDetail(slug),
      ophimService.getMovieImages(slug),
    ]);

    const movie =
      detailRes.status === "fulfilled" ? detailRes.value.data.item : null;

    const imagesData =
      imagesRes.status === "fulfilled" ? imagesRes.value.data : null;

    if (!movie) {
      // Fallback if API fails
      const name = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { title: `Xem phim ${name} - LocsongPhim` };
    }

    // Build image URL for OG:
    // Priority: TMDB backdrop (landscape, ideal for Messenger/social) > TMDB poster > CDN poster_url > CDN thumb_url
    let imageUrl = "";
    let imageWidth = 1280;
    let imageHeight = 720;

    if (imagesData) {
      // 1. Try backdrop first — landscape ratio, best for Messenger previews
      const backdropImage = imagesData.images.find(
        (img) => img.type === "backdrop"
      );
      if (backdropImage) {
        imageUrl = buildTmdbImageUrl(
          imagesData.image_sizes,
          "backdrop",
          backdropImage.file_path,
          "w1280"
        );
        imageWidth = 1280;
        imageHeight = 720;
      }

      // 2. Fallback to TMDB poster
      if (!imageUrl) {
        const posterImage = imagesData.images.find(
          (img) => img.type === "poster"
        );
        if (posterImage) {
          imageUrl = buildTmdbImageUrl(
            imagesData.image_sizes,
            "poster",
            posterImage.file_path,
            "w500"
          );
          imageWidth = 500;
          imageHeight = 750;
        }
      }
    }

    // 3. Fallback to CDN URLs
    if (!imageUrl && movie.poster_url) {
      imageUrl = normalizeImageUrl(movie.poster_url, OPHIM_CONFIG.CDN_IMAGE_URL);
      imageWidth = 500;
      imageHeight = 750;
    }
    if (!imageUrl && movie.thumb_url) {
      imageUrl = normalizeImageUrl(movie.thumb_url, OPHIM_CONFIG.CDN_IMAGE_URL);
      imageWidth = 500;
      imageHeight = 750;
    }

    // Build description from movie content (strip HTML, max 160 chars)
    const rawDescription = stripHtml(movie.content || "");
    const description =
      rawDescription.length > 160
        ? rawDescription.slice(0, 157) + "..."
        : rawDescription;

    const title = `${movie.name}${
      movie.origin_name ? ` (${movie.origin_name})` : ""
    } - LocsongPhim`;
    const categories = movie.category?.map((c) => c.name).join(", ") ?? "";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const pageUrl = `${siteUrl}/phim/${slug}`;

    return {
      title,
      description,
      keywords: categories,
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: "LocsongPhim",
        type: "video.movie",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                secureUrl: imageUrl,
                width: imageWidth,
                height: imageHeight,
                alt: movie.name,
                type: "image/jpeg",
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    const name = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { title: `Xem phim ${name} - LocsongPhim` };
  }
}

export default async function MoviePage({ params }: Props) {
  const { slug } = await params;
  return <WatchClientWrapper slug={slug} />;
}
