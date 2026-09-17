import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/verifyToken";
import { findLoanWithScheduleAndPayments } from "@/lib/repository/loanRepository";
import { derivePosition } from "@/lib/services/positionService";
import { toErrorResponse } from "@/lib/errors";
import { todayInIst } from "@/lib/dates";
import { serializeInstalment, serializeLoanHeader, serializePosition } from "@/lib/serializers";

// GET /api/loans/:id - schedule plus the position derived as of right now.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(request);
    const { id } = await params;
    const { loan, instalments } = await findLoanWithScheduleAndPayments(id);
    const position = derivePosition(instalments, todayInIst());

    return NextResponse.json({
      ...serializeLoanHeader(loan),
      schedule: instalments.map(serializeInstalment),
      position: serializePosition(position),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
