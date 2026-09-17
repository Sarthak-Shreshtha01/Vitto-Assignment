import { describe, expect, it } from "vitest";
import { POST as createLoan } from "@/app/api/loans/route";
import { GET as getLoan } from "@/app/api/loans/[id]/route";

// Deliberately does not mock requireAuth - this is the one test that
// exercises the real auth guard, with no Authorization header at all.
describe("authentication (integration)", () => {
  it("rejects requests without a valid token, before validation or the database", async () => {
    const createRequest = new Request("http://localhost/api/loans", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}), // deliberately invalid - should never be reached
    });
    const createResponse = await createLoan(createRequest);
    expect(createResponse.status).toBe(401);
    expect((await createResponse.json()).error.code).toBe("UNAUTHORIZED");

    const getRequest = new Request("http://localhost/api/loans/anything");
    const getResponse = await getLoan(getRequest, { params: Promise.resolve({ id: "anything" }) });
    expect(getResponse.status).toBe(401);
    expect((await getResponse.json()).error.code).toBe("UNAUTHORIZED");
  });
});
