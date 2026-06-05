import "server-only";

import { createClient } from "@sanity/client";
import type { PollOption, PollResults } from "@/components/post/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "lmt8oc1w";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const readToken =
  process.env.SANITY_API_WRITE_TOKEN ??
  "sklWzfXujxAJicCRUKLmGNXBbFaamIptJ4HSWDOVeWcdJiHwgLiP0TItqXZgAEXAGQgNhotBZa5ECTZPZE7LE2gVLBxsAvYXOxCarsg25VjOWFNCWHthooOhxk6VFkFcie5KgVJ1GLRbJerKgDshLRUSEHFbYp2qPEpLceUcCWrxUkgPPl6S";

const pollReadClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-29",
  useCdn: false,
  token: readToken,
});

type PollVoteRow = {
  optionKey?: string;
};

export function buildPollResults(
  options: PollOption[],
  votes: PollVoteRow[],
): PollResults {
  const counts = new Map<string, number>();

  for (const vote of votes) {
    if (!vote.optionKey) {
      continue;
    }

    counts.set(vote.optionKey, (counts.get(vote.optionKey) ?? 0) + 1);
  }

  const totalVotes = votes.length;

  return {
    totalVotes,
    options: options.map((option) => {
      const optionVotes = counts.get(option._key) ?? 0;
      const percentage =
        totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

      return {
        optionKey: option._key,
        label: option.label,
        votes: optionVotes,
        percentage,
      };
    }),
  };
}

export async function getPollResultsByPostId(
  postId: string,
  options: PollOption[],
): Promise<PollResults> {
  if (options.length === 0) {
    return {
      totalVotes: 0,
      options: [],
    };
  }

  const votes = await pollReadClient.fetch<PollVoteRow[]>(
    `*[_type == "pollVote" && post._ref == $postId]{optionKey}`,
    { postId },
  );

  return buildPollResults(options, votes);
}
