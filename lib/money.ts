// Rupee <-> paise conversion. This is the only place money crosses between
// the API's rupee-denominated JSON and the paise (BigInt) used everywhere
// internally — see docs/SRS.md §4.1.

export function rupeesToPaise(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

export function paiseToRupees(paise: bigint): number {
  return Number(paise) / 100;
}
