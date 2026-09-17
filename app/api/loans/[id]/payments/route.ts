import { handleRoute } from "@/lib/http";
import * as paymentController from "@/lib/controllers/paymentController";

// Record a payment against a loan's schedule.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return handleRoute(() => paymentController.recordPayment(request, id));
}
