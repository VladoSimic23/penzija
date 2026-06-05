import { NextRequest, NextResponse } from "next/server";
import { getLatestPostsPage } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = Number(searchParams.get("start") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "5");
  const category = searchParams.get("category")?.trim() || undefined;

  const { posts, hasMore } = await getLatestPostsPage(start, limit, category);

  return NextResponse.json({
    posts,
    hasMore,
  });
}
