"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Skeleton } from "@/components/ui/skeleton";

/* Skeleton */
function DashboardOverviewSkeleton() {
  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[109px] rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Skeleton className="col-span-4 h-[382px] rounded-lg" />
        <Skeleton className="col-span-3 h-[382px] rounded-lg" />
      </div>
    </div>
  );
}

/* Dynamic imports */
const DashboardOverview = dynamic(
  () =>
    import("@/components/features/dashboard-overview").then(
      (m) => m.DashboardOverview
    ),
  { ssr: false, loading: () => <DashboardOverviewSkeleton /> }
);

const FinancialStatementAnalysis = dynamic(
  () =>
    import("@/components/features/financial-statement-analysis").then(
      (m) => m.FinancialStatementAnalysis
    ),
  { ssr: false }
);

const CashFlowPatterns = dynamic(
  () =>
    import("@/components/features/cash-flow-patterns").then(
      (m) => m.CashFlowPatterns
    ),
  { ssr: false }
);

const CreditworthinessEvaluation = dynamic(
  () =>
    import("@/components/features/creditworthiness-evaluation").then(
      (m) => m.CreditworthinessEvaluation
    ),
  { ssr: false }
);

const PersonalizedRecommendations = dynamic(
  () =>
    import("@/components/features/personalized-recommendations").then(
      (m) => m.PersonalizedRecommendations
    ),
  { ssr: false }
);

const BookkeepingAssistance = dynamic(
  () =>
    import("@/components/features/bookkeeping-assistance").then(
      (m) => m.BookkeepingAssistance
    ),
  { ssr: false }
);

const FinancialForecasting = dynamic(
  () =>
    import("@/components/features/financial-forecasting").then(
      (m) => m.FinancialForecasting
    ),
  { ssr: false }
);

const Accounts = dynamic(
  () => import("@/components/features/accounts").then((m) => m.Accounts),
  { ssr: false }
);

const Integrations = dynamic(
  () =>
    import("@/components/features/integrations").then(
      (m) => m.Integrations
    ),
  { ssr: false }
);

/* Config */
const tabComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardOverview,
  analysis: FinancialStatementAnalysis,
  "cash-flow": CashFlowPatterns,
  "credit-score": CreditworthinessEvaluation,
  recommendations: PersonalizedRecommendations,
  bookkeeping: BookkeepingAssistance,
  forecasting: FinancialForecasting,
  accounts: Accounts,
  integrations: Integrations,
};

const tabTitles: Record<string, string> = {
  dashboard: "Dashboard Overview",
  analysis: "Financial Statement Analysis",
  "cash-flow": "Cash Flow Patterns",
  "credit-score": "Creditworthiness Evaluation",
  recommendations: "Personalized Recommendations",
  bookkeeping: "Automated Bookkeeping Assistance",
  forecasting: "Financial Forecasting",
  accounts: "Bank Accounts",
  integrations: "Integrations",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const ActiveComponent = tabComponents[activeTab] ?? (() => null);

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <AppHeader title={tabTitles[activeTab] ?? ""} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <ActiveComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
