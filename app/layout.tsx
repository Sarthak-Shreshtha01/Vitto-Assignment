import type { Metadata } from "next";
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
  title: "Loan Repayment Service",
  description: "Loan schedule, position, and payment tracking",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
