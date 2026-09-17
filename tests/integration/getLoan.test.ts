import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/loans/[id]/route";

vi.mock("@/lib/auth/verifyToken", () => ({
  requireAuth: vi.fn().mockResolvedValue({ uid: "test-user", email: "test@example.com" }),
}));

describe("GET /api/loans/:id (integration - failure path)", () => {
  it("returns 404 with the standard error shape for an unknown loan id", async () => {
    const request = new Request("http://localhost/api/loans/does-not-exist", {
      headers: { authorization: "Bearer fake-token" },
    });

    const response = await GET(request, { params: Promise.resolve({ id: "does-not-exist" }) });
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });
});
