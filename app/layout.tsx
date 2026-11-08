import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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
  themeColor: "#fbf8f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
