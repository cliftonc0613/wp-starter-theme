import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

/**
 * Exit Preview Mode
 *
 * Disables Next.js Draft Mode and redirects back to the page.
 *
 * Query params:
 * - redirect: Path to redirect to after exiting preview (default: /)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get("redirect") || "/";

  // Disable Draft Mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to the specified path
  return NextResponse.redirect(new URL(redirectPath, request.nextUrl.origin));
}
