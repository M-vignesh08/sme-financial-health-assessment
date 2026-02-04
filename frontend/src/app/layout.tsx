"use client";

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";

export const metadata: Metadata = {
  title: "FinSight Advisor",
  description: "AI-powered financial health assessment for SMEs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
