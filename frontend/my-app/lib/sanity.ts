import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "lmt8oc1w";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-29",
  useCdn: true,
});

export const sanityLiveClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-29",
  useCdn: false,
});

const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof imageBuilder.image>[0]) {
  return imageBuilder.image(source);
}

type BuildOptimizedImageUrlOptions = {
  width: number;
  height?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "min" | "scale";
  quality?: number;
};

export function buildOptimizedImageUrl(
  source: Parameters<typeof imageBuilder.image>[0],
  options: BuildOptimizedImageUrlOptions,
) {
  const { width, height, fit = "crop", quality = 72 } = options;

  let builder = urlFor(source).width(width).auto("format").quality(quality);

  if (typeof height === "number") {
    builder = builder.height(height);
  }

  return builder.fit(fit).url();
}
