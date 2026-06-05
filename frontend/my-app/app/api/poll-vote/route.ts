import { createHash } from "crypto";
import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";
import { buildPollResults } from "@/lib/poll";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "lmt8oc1w";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const writeToken =
  process.env.SANITY_API_WRITE_TOKEN ??
  "sklWzfXujxAJicCRUKLmGNXBbFaamIptJ4HSWDOVeWcdJiHwgLiP0TItqXZgAEXAGQgNhotBZa5ECTZPZE7LE2gVLBxsAvYXOxCarsg25VjOWFNCWHthooOhxk6VFkFcie5KgVJ1GLRbJerKgDshLRUSEHFbYp2qPEpLceUcCWrxUkgPPl6S";

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

function normalizeIdPart(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function createVoterHash(voterId: string) {
  return createHash("sha256").update(voterId).digest("hex");
}

type PollOption = {
  _key?: string;
  label?: string;
};

type PollPost = {
  _id: string;
  poll?: {
    question?: string;
    options?: PollOption[];
  };
};

export async function POST(request: NextRequest) {
  if (!writeToken) {
    return NextResponse.json(
      { error: "Nedostaje SANITY_API_WRITE_TOKEN za upis glasova." },
      { status: 500 },
    );
  }

  let body: {
    postId?: unknown;
    optionKey?: unknown;
    voterId?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Neispravan JSON payload." },
      { status: 400 },
    );
  }

  const postId = typeof body.postId === "string" ? body.postId.trim() : "";
  const optionKey =
    typeof body.optionKey === "string" ? body.optionKey.trim() : "";
  const voterId = typeof body.voterId === "string" ? body.voterId.trim() : "";

  if (!postId || !optionKey || !voterId) {
    return NextResponse.json(
      { error: "Nedostaje postId, optionKey ili voterId." },
      { status: 400 },
    );
  }

  const post = await sanityReadClient.fetch<PollPost | null>(
    `*[_type == "post" && _id == $postId][0]{
      _id,
      poll{
        question,
        options[]{
          _key,
          label
        }
      }
    }`,
    { postId },
  );

  if (!post) {
    return NextResponse.json({ error: "Post ne postoji." }, { status: 404 });
  }

  const validOptions = (post.poll?.options ?? []).filter(
    (option): option is { _key: string; label: string } =>
      typeof option._key === "string" &&
      option._key.length > 0 &&
      typeof option.label === "string" &&
      option.label.length > 0,
  );

  if (validOptions.length < 2 || !post.poll?.question) {
    return NextResponse.json(
      { error: "Anketa nije aktivna za ovaj post." },
      { status: 400 },
    );
  }

  const optionExists = validOptions.some((option) => option._key === optionKey);

  if (!optionExists) {
    return NextResponse.json(
      { error: "Nepostojeca opcija ankete." },
      { status: 400 },
    );
  }

  const voterHash = createVoterHash(voterId);
  const voteDocumentId = `pollVote.${normalizeIdPart(postId)}.${voterHash}`;

  await sanityWriteClient.createOrReplace({
    _id: voteDocumentId,
    _type: "pollVote",
    post: {
      _type: "reference",
      _ref: postId,
    },
    optionKey,
    voterHash,
  });

  const votes = await sanityWriteClient.fetch<Array<{ optionKey?: string }>>(
    `*[_type == "pollVote" && post._ref == $postId]{optionKey}`,
    { postId },
  );

  const results = buildPollResults(validOptions, votes);

  return NextResponse.json({
    results,
    selectedOption: optionKey,
  });
}
