"use client";

import { useMemo, useState } from "react";
import type { ScheduleRow } from "@/app/apiTypes";

const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

type Filter = "all" | "overdue" | "pending" | "partially_paid" | "paid";

// A row is overdue purely for display/filtering here - the authoritative
// overdue amount is position.overdueAmount from the backend (SRS §7.3).
// This just mirrors that same rule (today > due date, not fully paid) at
// the row level so the table can highlight and filter by it.
function isRowOverdue(row: ScheduleRow): boolean {
  if (row.status === "PAID") return false;
  return new Date(row.dueDate).getTime() < Date.now();
}

interface ScheduleTableProps {
  schedule: ScheduleRow[];
  actions?: React.ReactNode;
}

export function ScheduleTable({ schedule, actions }: ScheduleTableProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      all: schedule.length,
      overdue: schedule.filter(isRowOverdue).length,
      pending: schedule.filter((r) => r.status === "PENDING" && !isRowOverdue(r)).length,
      partially_paid: schedule.filter((r) => r.status === "PARTIALLY_PAID" && !isRowOverdue(r)).length,
      paid: schedule.filter((r) => r.status === "PAID").length,
    }),
    [schedule],
  );

  const visibleRows = schedule.filter((row) => {
    if (filter === "all") return true;
    if (filter === "overdue") return isRowOverdue(row);
    return row.status === filter.toUpperCase() && !isRowOverdue(row);
  });

  return (
    <div className="card schedule-card">
      <div className="schedule-header">
        <div>
          <h2>
            Repayment schedule
            <span className="schedule-count">{schedule.length} instalments</span>
          </h2>
        </div>
        <div className="status-filter">
          {(["all", "overdue", "partially_paid", "pending", "paid"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={filter === f ? "active" : undefined}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.replace("_", " ")} ({counts[f]})
            </button>
          ))}
        </div>
        {actions}
      </div>

      <div className="table-scroll">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Due date</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Total due</th>
              <th>Amount paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const overdue = isRowOverdue(row);
              return (
                <tr key={row.sequenceNumber} className={overdue ? "row-overdue" : undefined}>
                  <td className="seq-number">{row.sequenceNumber}</td>
                  <td>{row.dueDate}</td>
                  <td>{rupees(row.principalComponent)}</td>
                  <td>{rupees(row.interestComponent)}</td>
                  <td>{rupees(row.totalDue)}</td>
                  <td>{rupees(row.amountPaid)}</td>
                  <td>
                    <span className={`status-pill status-pill--${overdue ? "overdue" : row.status.toLowerCase()}`}>
                      {overdue ? "Overdue" : row.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
