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

export const IMAGE_BLUR_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23e2e8f0' offset='0'/%3E%3Cstop stop-color='%23cbd5e1' offset='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='16' height='9' fill='url(%23g)'/%3E%3C/svg%3E";

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
