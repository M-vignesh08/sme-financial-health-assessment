import "./globals.css";
import type { Metadata } from "next";

import Providers from "./providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
