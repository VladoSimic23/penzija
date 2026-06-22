import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "@sanity/client";
import type { QueryParams } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "lmt8oc1w";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const useCdnInReadClient = process.env.NODE_ENV === "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-29",
  useCdn: useCdnInReadClient,
});

export const sanityLiveClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-29",
  useCdn: false,
});

type SanityQueryParams = QueryParams;

type SanityFetchOptions = {
  preferLive?: boolean;
  retries?: number;
};

const DEFAULT_SANITY_RETRIES = 2;

function isNetworkError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    isNetworkError?: boolean;
    message?: string;
    cause?: unknown;
  };

  if (candidate.isNetworkError) {
    return true;
  }

  if (
    candidate.cause &&
    typeof candidate.cause === "object" &&
    "code" in candidate.cause
  ) {
    const code = (candidate.cause as { code?: unknown }).code;

    if (typeof code === "string" && code.startsWith("UND_ERR_")) {
      return true;
    }
  }

  const message = candidate.message ?? "";
  return (
    message.includes("fetch failed") ||
    message.includes("Connect Timeout") ||
    message.includes("network")
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchWithRetry<T>(
  client: typeof sanityClient,
  query: string,
  params?: SanityQueryParams,
  retries = DEFAULT_SANITY_RETRIES,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      if (params) {
        return await client.fetch<T>(query, params);
      }

      return await client.fetch<T>(query);
    } catch (error) {
      lastError = error;

      const canRetry = isNetworkError(error) && attempt < retries;

      if (!canRetry) {
        throw error;
      }

      await sleep(250 * (attempt + 1));
    }
  }

  throw lastError;
}

export async function fetchSanity<T>(
  query: string,
  params?: SanityQueryParams,
  options: SanityFetchOptions = {},
): Promise<T> {
  const { preferLive = false, retries = DEFAULT_SANITY_RETRIES } = options;
  const primaryClient = preferLive ? sanityLiveClient : sanityClient;
  const fallbackClient = preferLive ? sanityClient : sanityLiveClient;

  try {
    return await fetchWithRetry<T>(primaryClient, query, params, retries);
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }

    return fetchWithRetry<T>(fallbackClient, query, params, retries);
  }
}

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
