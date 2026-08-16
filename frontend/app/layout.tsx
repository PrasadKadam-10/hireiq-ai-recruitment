import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HireIQ — AI Recruitment Intelligence",
    template: "%s | HireIQ",
  },
  description:
    "HireIQ is an AI-powered recruitment platform that analyzes resumes, evaluates candidates, and delivers instant hiring intelligence powered by LangGraph + ASI1.",
  keywords: ["recruitment", "AI", "resume screening", "candidate evaluation", "HR automation"],
  authors: [{ name: "HireIQ" }],
  creator: "HireIQ",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    title: "HireIQ — AI Recruitment Intelligence",
    description: "AI-powered resume screening and candidate evaluation.",
    siteName: "HireIQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
