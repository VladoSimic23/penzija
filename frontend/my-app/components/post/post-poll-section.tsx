"use client";

import {
  type PollResults,
  type PostPoll,
  type PollResultOption,
} from "@/components/post/types";
import { useMemo, useState } from "react";

type PostPollSectionProps = {
  postId: string;
  poll: PostPoll;
  initialResults: PollResults;
};

type SubmitState = "idle" | "loading" | "error";

const VOTER_ID_STORAGE_KEY = "poll-voter-id";

function getOrCreateVoterId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingId = window.localStorage.getItem(VOTER_ID_STORAGE_KEY);

  if (existingId) {
    return existingId;
  }

  const newId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(VOTER_ID_STORAGE_KEY, newId);
  return newId;
}

function formatVoteLabel(totalVotes: number) {
  if (totalVotes === 1) {
    return "1 glas";
  }

  return `${totalVotes} glasova`;
}

function getSelectedOption(postId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(`poll-vote:${postId}`);
}

function saveSelectedOption(postId: string, optionKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(`poll-vote:${postId}`, optionKey);
}

export function PostPollSection({
  postId,
  poll,
  initialResults,
}: PostPollSectionProps) {
  const [results, setResults] = useState<PollResults>(initialResults);
  const [selectedOption, setSelectedOption] = useState<string | null>(() =>
    getSelectedOption(postId),
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState("");

  const optionsByKey = useMemo(() => {
    const map = new Map<string, PollResultOption>();

    for (const option of results.options) {
      map.set(option.optionKey, option);
    }

    return map;
  }, [results.options]);

  async function handleVote(optionKey: string) {
    const voterId = getOrCreateVoterId();

    if (!voterId) {
      setSubmitState("error");
      setServerError("Neuspjelo kreiranje korisnickog ID-a za glasanje.");
      return;
    }

    setSubmitState("loading");
    setServerError("");

    try {
      const response = await fetch("/api/poll-vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          optionKey,
          voterId,
        }),
      });

      const payload = (await response.json()) as {
        results?: PollResults;
        selectedOption?: string;
        error?: string;
      };

      if (!response.ok || !payload.results || !payload.selectedOption) {
        throw new Error(payload.error || "Glasanje nije uspjelo.");
      }

      setResults(payload.results);
      setSelectedOption(payload.selectedOption);
      saveSelectedOption(postId, payload.selectedOption);
      setSubmitState("idle");
    } catch (error) {
      setSubmitState("error");
      setServerError(
        error instanceof Error ? error.message : "Dogodila se greska.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-black/[0.03] p-5 sm:p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold sm:text-2xl">Anketa</h2>
        <p className="text-base font-medium text-black/90">{poll.question}</p>
        <p className="text-sm text-black/60">
          {formatVoteLabel(results.totalVotes)}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {poll.options.map((option) => {
          const optionResult = optionsByKey.get(option._key) ?? {
            optionKey: option._key,
            label: option.label,
            votes: 0,
            percentage: 0,
          };
          const isSelected = selectedOption === option._key;

          return (
            <button
              key={option._key}
              type="button"
              onClick={() => handleVote(option._key)}
              disabled={submitState === "loading"}
              className={`w-full overflow-hidden rounded-xl border text-left transition ${
                isSelected
                  ? "border-black bg-white shadow-sm"
                  : "border-black/15 bg-white/80 hover:border-black/35"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="relative px-4 py-3 sm:px-5">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 bg-black/10"
                  style={{ width: `${optionResult.percentage}%` }}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-medium text-black/90">
                    {optionResult.label}
                  </span>
                  <span className="text-sm font-semibold text-black/80">
                    {optionResult.percentage}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedOption ? (
        <p className="mt-4 text-sm text-emerald-700">
          Glas je sacuvan. Mozes promijeniti izbor klikom na drugu opciju.
        </p>
      ) : null}

      {submitState === "error" && serverError ? (
        <p className="mt-3 text-sm text-red-700">{serverError}</p>
      ) : null}
    </section>
  );
}
