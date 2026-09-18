import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter, per docs/stitch.md's design system: pairs cleanly with dense
// tabular data (the schedule table) and is the closest reliable
// substitute for Vitto's actual brand typeface.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Loan Repayment Service",
    template: "%s · Loan Repayment Service",
  },
  description: "Internal ops tool for tracking loan repayment schedules, positions, and payments.",
  applicationName: "Loan Repayment Service",
  // Internal tool, not a public product - keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#E3195E", // --vitto-pink, docs/stitch.md §7
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
