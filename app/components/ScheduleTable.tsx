import type { ScheduleRow } from "@/app/apiTypes";

const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export function ScheduleTable({ schedule }: { schedule: ScheduleRow[] }) {
  return (
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
        {schedule.map((row) => (
          <tr key={row.sequenceNumber} className={`status-${row.status.toLowerCase()}`}>
            <td>{row.sequenceNumber}</td>
            <td>{row.dueDate}</td>
            <td>{rupees(row.principalComponent)}</td>
            <td>{rupees(row.interestComponent)}</td>
            <td>{rupees(row.totalDue)}</td>
            <td>{rupees(row.amountPaid)}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
