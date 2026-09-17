// The 4-petal pinwheel mark from docs/stitch.md §4/§7.
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="brand-mark" aria-hidden>
      <rect x="2" y="2" width="13" height="13" rx="4" fill="var(--vitto-pink)" />
      <rect x="17" y="2" width="13" height="13" rx="4" fill="var(--vitto-pink)" opacity="0.85" />
      <rect x="2" y="17" width="13" height="13" rx="4" fill="var(--vitto-pink)" opacity="0.85" />
      <rect x="17" y="17" width="13" height="13" rx="4" fill="var(--vitto-pink)" />
    </svg>
  );
}
