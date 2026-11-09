import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sundial — Timesheets, approvals, utilization",
    template: "%s · Sundial",
  },
  description:
    "Sundial turns weekly timesheets into a calm, auditable record — entry, approval, and utilization in one place.",
  applicationName: "Sundial",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
