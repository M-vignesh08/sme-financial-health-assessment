"use client";

import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  );
}
