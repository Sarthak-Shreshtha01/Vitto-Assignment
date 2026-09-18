// A short, human-readable reference for a loan's opaque cuid, for display
// only - the real identifier used in URLs/requests is always the full id.
export function loanRef(id: string): string {
  return `LN-${id.slice(-6).toUpperCase()}`;
}
