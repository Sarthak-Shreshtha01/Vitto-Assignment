import { handleRoute } from "@/lib/http";
import * as loanController from "@/lib/controllers/loanController";

// Create a loan and persist its full generated schedule.
export function POST(request: Request) {
  return handleRoute(() => loanController.createLoan(request));
}

// List loans (extension, backs the UI's loan picker).
export function GET(request: Request) {
  return handleRoute(() => loanController.listLoans(request));
}
