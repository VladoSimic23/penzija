import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  windowStartedAt: number;
};

const NAME_MIN = 2;
const NAME_MAX = 80;
const MESSAGE_MIN = 2;
const MESSAGE_MAX = 1500;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "lmt8oc1w";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const writeToken =
  process.env.SANITY_API_WRITE_TOKEN ??
  "sklWzfXujxAJicCRUKLmGNXBbFaamIptJ4HSWDOVeWcdJiHwgLiP0TItqXZgAEXAGQgNhotBZa5ECTZPZE7LE2gVLBxsAvYXOxCarsg25VjOWFNCWHthooOhxk6VFkFcie5KgVJ1GLRbJerKgDshLRUSEHFbYp2qPEpLceUcCWrxUkgPPl6S";

const globalRateLimitStore = globalThis as typeof globalThis & {
  commentRateLimits?: Map<string, RateLimitEntry>;
};

const rateLimitStore =
  globalRateLimitStore.commentRateLimits ?? new Map<string, RateLimitEntry>();
globalRateLimitStore.commentRateLimits = rateLimitStore;

const sanityReadClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-29",
  useCdn: false,
});

const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-29",
  useCdn: false,
  token: writeToken,
});

function normalizeInput(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || now - current.windowStartedAt > RATE_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStartedAt: now });
    return false;
  }

  if (current.count >= RATE_LIMIT) {
    return true;
  }

  current.count += 1;
  rateLimitStore.set(ip, current);
  return false;
}

export async function POST(request: NextRequest) {
  if (!writeToken) {
    return NextResponse.json(
      { error: "Nedostaje SANITY_API_WRITE_TOKEN za upis komentara." },
      { status: 500 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Previse zahtjeva. Pokusaj ponovo za nekoliko minuta." },
      { status: 429 },
    );
  }

  let body: {
    postId?: unknown;
    name?: unknown;
    message?: unknown;
    website?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Neispravan JSON payload." },
      { status: 400 },
    );
  }

  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({ success: true }, { status: 202 });
  }

  const postId = typeof body.postId === "string" ? body.postId : "";
  const name = typeof body.name === "string" ? normalizeInput(body.name) : "";
  const message =
    typeof body.message === "string" ? normalizeInput(body.message) : "";

  if (!postId) {
    return NextResponse.json({ error: "Nedostaje postId." }, { status: 400 });
  }

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return NextResponse.json(
      { error: `Ime mora imati ${NAME_MIN}-${NAME_MAX} znakova.` },
      { status: 400 },
    );
  }

  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    return NextResponse.json(
      { error: `Komentar mora imati ${MESSAGE_MIN}-${MESSAGE_MAX} znakova.` },
      { status: 400 },
    );
  }

  const post = await sanityReadClient.fetch<{
    _id: string;
    allowComments?: boolean;
  } | null>(`*[_type == "post" && _id == $postId][0]{_id, allowComments}`, {
    postId,
  });

  if (!post) {
    return NextResponse.json({ error: "Post ne postoji." }, { status: 404 });
  }

  if (post.allowComments === false) {
    return NextResponse.json(
      { error: "Komentari nisu dozvoljeni za ovaj post." },
      { status: 403 },
    );
  }

  const createdComment = await sanityWriteClient.create({
    _type: "comment",
    post: {
      _type: "reference",
      _ref: postId,
    },
    name,
    message,
  });

  return NextResponse.json({
    comment: {
      _id: createdComment._id,
      name,
      message,
      _createdAt: createdComment._createdAt,
    },
  });
}
