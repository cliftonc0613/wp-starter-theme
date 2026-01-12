import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/wordpress";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const typesParam = searchParams.get("types");
  const perPage = parseInt(searchParams.get("per_page") || "5", 10);

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const types = typesParam
    ? (typesParam.split(",") as ("post" | "page" | "service")[])
    : undefined;

  try {
    const results = await search({
      query,
      types,
      per_page: perPage,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
