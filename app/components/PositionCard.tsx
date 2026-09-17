import type { Position } from "@/app/apiTypes";

const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export function PositionCard({ position }: { position: Position }) {
  const isOverdue = position.overdueAmount > 0;

  return (
    <div className="kpi-grid">
      <div className="card kpi-card">
        <span className="kpi-label">Outstanding principal</span>
        <span className="kpi-value">{rupees(position.outstandingPrincipal)}</span>
      </div>

      <div className="card kpi-card">
        <span className="kpi-label">Next due</span>
        <span className="kpi-value">
          {position.nextDueDate ? rupees(position.nextDueAmount ?? 0) : "—"}
        </span>
        <span className="kpi-meta">{position.nextDueDate ?? "Fully paid"}</span>
      </div>

      <div className={`card kpi-card${isOverdue ? " overdue" : ""}`}>
        <span className="kpi-label">Overdue</span>
        <span className="kpi-value">{rupees(position.overdueAmount)}</span>
        <span className="kpi-meta">{isOverdue ? "Action required" : "Nothing overdue"}</span>
      </div>
    </div>
  );
}
