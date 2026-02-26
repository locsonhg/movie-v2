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

    // Build image URL: TMDB poster > CDN poster_url > CDN thumb_url
    let imageUrl = "";
    if (imagesData) {
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
      }
    }
    if (!imageUrl && movie.poster_url) {
      imageUrl = normalizeImageUrl(
        movie.poster_url,
        OPHIM_CONFIG.CDN_IMAGE_URL
      );
    }
    if (!imageUrl && movie.thumb_url) {
      imageUrl = normalizeImageUrl(movie.thumb_url, OPHIM_CONFIG.CDN_IMAGE_URL);
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
    const pageUrl = `${OPHIM_CONFIG.BASE_URL}/phim/${slug}`;

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
                width: 500,
                height: 750,
                alt: movie.name,
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
