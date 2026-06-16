"use client";

import { FormEvent, useMemo, useState } from "react";
import type { PostComment } from "@/components/comments/types";

type CommentsSectionProps = {
  postId: string;

  initialComments: PostComment[];
};

type SubmitState = "idle" | "loading" | "error" | "success";

const NAME_MIN = 2;
const NAME_MAX = 80;
const MESSAGE_MIN = 2;
const MESSAGE_MAX = 1500;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function normalizeInput(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function CommentsSection({
  postId,

  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<PostComment[]>(initialComments);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string>("");

  const commentsCountLabel = useMemo(() => {
    if (comments.length === 1) return "1 komentar";
    if (comments.length > 1 && comments.length < 5)
      return `${comments.length} komentara`;
    return `${comments.length} komentara`;
  }, [comments.length]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    const normalizedName = normalizeInput(name);
    const normalizedMessage = normalizeInput(message);

    if (normalizedName.length < NAME_MIN || normalizedName.length > NAME_MAX) {
      setSubmitState("error");
      setServerError(`Ime mora imati ${NAME_MIN}-${NAME_MAX} znakova.`);
      return;
    }

    if (
      normalizedMessage.length < MESSAGE_MIN ||
      normalizedMessage.length > MESSAGE_MAX
    ) {
      setSubmitState("error");
      setServerError(
        `Komentar mora imati ${MESSAGE_MIN}-${MESSAGE_MAX} znakova.`,
      );
      return;
    }

    setSubmitState("loading");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          name: normalizedName,
          message: normalizedMessage,
          website,
        }),
      });

      const payload = (await response.json()) as {
        comment?: PostComment;
        error?: string;
      };

      if (!response.ok || !payload.comment) {
        throw new Error(payload.error || "Neuspjelo slanje komentara.");
      }

      setComments((current) => [payload.comment!, ...current]);
      setName("");
      setMessage("");
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setServerError(
        error instanceof Error ? error.message : "Dogodila se greska.",
      );
    }
  }

  return (
    <section className="mt-12 space-y-8 border-t border-black/10 pt-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Komentari</h2>
        <p className="text-lg text-black/60">{commentsCountLabel}</p>
      </div>
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/20 bg-black/5 px-4 py-5 text-lg text-black/70">
            Jos nema komentara. Budi prvi koji ce ostaviti komentar.
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment._id}
              className="rounded-xl border border-black/10 bg-white px-4 py-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{comment.name}</h3>
                <time
                  className="text-sm text-black/50"
                  dateTime={comment._createdAt}
                >
                  {formatDate(comment._createdAt)}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-lg leading-8 text-black/80">
                {comment.message}
              </p>
            </article>
          ))
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-black/10 bg-black/[0.03] p-5"
      >
        <h3 className="text-xl font-semibold">Ostavi komentar</h3>

        <label className="block space-y-2">
          <span className="text-lg font-medium">Ime</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={NAME_MIN}
            maxLength={NAME_MAX}
            required
            className="w-full rounded-lg border border-black/20 bg-white px-3 py-2.5 text-lg outline-none transition focus:border-black/40"
            placeholder="Unesi ime"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-lg font-medium">Komentar</span>
          <textarea
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={MESSAGE_MIN}
            maxLength={MESSAGE_MAX}
            required
            rows={5}
            className="w-full resize-y rounded-lg border border-black/20 bg-white px-3 py-2.5 text-lg outline-none transition focus:border-black/40"
            placeholder="Napisi svoj komentar"
          />
        </label>

        <label className="hidden" aria-hidden="true">
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="submit"
            disabled={submitState === "loading"}
            className="rounded-lg bg-black px-5 py-2.5 text-lg font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitState === "loading" ? "Slanje..." : "Ostavi komentar"}
          </button>
        </div>

        {submitState === "success" ? (
          <p className="text-sm text-emerald-700">
            Komentar je uspjesno dodan.
          </p>
        ) : null}

        {submitState === "error" && serverError ? (
          <p className="text-sm text-red-700">{serverError}</p>
        ) : null}
      </form>
    </section>
  );
}
