// A shimmering placeholder block. Compose with inline width/height (via
// style or a wrapping class) to match whatever it's standing in for.
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className ?? ""}`} style={style} aria-hidden />;
}
