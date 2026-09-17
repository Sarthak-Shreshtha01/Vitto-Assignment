// SRS §2.4: a single global "today" (server clock, IST) drives overdue
// calculations - never a client-supplied date. Returned as a UTC-midnight
// Date so it compares directly against DATE columns (which carry no
// timezone) the same way schedule due dates already do.
export function todayInIst(): Date {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(Date.now() + IST_OFFSET_MS);
  return new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()));
}
