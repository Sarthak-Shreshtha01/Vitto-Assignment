import { Skeleton } from "@/app/components/Skeleton";

// Mirrors the real KPI-grid + schedule-table layout so the page doesn't
// jump once the actual loan data arrives.
export function LoanDetailSkeleton() {
  return (
    <>
      <div className="kpi-grid">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card kpi-card">
            <Skeleton style={{ width: "60%", height: "0.7rem" }} />
            <Skeleton style={{ width: "45%", height: "1.5rem" }} />
            <Skeleton style={{ width: "70%", height: "0.75rem" }} />
          </div>
        ))}
      </div>

      <div className="card schedule-card">
        <div className="schedule-header">
          <Skeleton style={{ width: "10rem", height: "1rem" }} />
          <Skeleton style={{ width: "12rem", height: "1.75rem", borderRadius: "8px" }} />
        </div>
        <div className="table-scroll">
          <table className="schedule-table">
            <tbody>
              {[0, 1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  {[0, 1, 2, 3, 4, 5, 6].map((col) => (
                    <td key={col}>
                      <Skeleton style={{ width: "100%", height: "0.85rem" }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
