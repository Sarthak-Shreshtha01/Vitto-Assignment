import { handleRoute } from "@/lib/http";
import * as loanController from "@/lib/controllers/loanController";

// Get a loan's schedule plus the position derived as of right now.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return handleRoute(() => loanController.getLoan(request, id));
}
