// A controller's result before it becomes an HTTP response. Kept
// framework-agnostic (no NextResponse here) so controllers stay easy to
// unit test and don't need to know about Next.js at all - lib/http.ts is
// the only place that turns this into a real response.
export interface RouteResult {
  status: number;
  body: unknown;
}
