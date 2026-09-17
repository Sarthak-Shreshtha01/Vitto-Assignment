import type { Position } from "@/app/apiTypes";

const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export function PositionCard({ position }: { position: Position }) {
  const isOverdue = position.overdueAmount > 0;

  return (
    <div className="position-card">
      <div>
        <span className="label">Outstanding principal</span>
        <span className="value">{rupees(position.outstandingPrincipal)}</span>
      </div>
      <div>
        <span className="label">Next due</span>
        <span className="value">
          {position.nextDueDate ? `${position.nextDueDate} — ${rupees(position.nextDueAmount ?? 0)}` : "Fully paid"}
        </span>
      </div>
      <div className={isOverdue ? "overdue" : undefined}>
        <span className="label">Overdue</span>
        <span className="value">{rupees(position.overdueAmount)}</span>
      </div>
    </div>
  );
}
