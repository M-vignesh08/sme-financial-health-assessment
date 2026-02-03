"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load feature components for better initial load performance
import dynamic from 'next/dynamic';

function DashboardOverviewSkeleton() {
  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[109px] rounded-lg" />
        <Skeleton className="h-[109px] rounded-lg" />
        <Skeleton className="h-[109px] rounded-lg" />
        <Skeleton className="h-[109px] rounded-lg" />
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Skeleton className="col-span-4 h-[382px] rounded-lg" />
        <Skeleton className="col-span-3 h-[382px] rounded-lg" />
      </div>
    </div>
  )
}

const DashboardOverview = dynamic(() => import('@/components/features/dashboard-overview').then(mod => mod.DashboardOverview),{
  ssr: false,
  loading: () => <DashboardOverviewSkeleton />,
});
const FinancialStatementAnalysis = dynamic(() => import('@/components/features/financial-statement-analysis').then(mod => mod.FinancialStatementAnalysis));
const CashFlowPatterns = dynamic(() => import('@/components/features/cash-flow-patterns').then(mod => mod.CashFlowPatterns));
const CreditworthinessEvaluation = dynamic(() => import('@/components/features/creditworthiness-evaluation').then(mod => mod.CreditworthinessEvaluation));
const PersonalizedRecommendations = dynamic(() => import('@/components/features/personalized-recommendations').then(mod => mod.PersonalizedRecommendations));
const BookkeepingAssistance = dynamic(() => import('@/components/features/bookkeeping-assistance').then(mod => mod.BookkeepingAssistance));
const FinancialForecasting = dynamic(() => import('@/components/features/financial-forecasting').then(mod => mod.FinancialForecasting));
const Accounts = dynamic(() => import('@/components/features/accounts').then(mod => mod.Accounts));
const Integrations = dynamic(() => import('@/components/features/integrations').then(mod => mod.Integrations));


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

  const ActiveComponent = tabComponents[activeTab];

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <AppHeader title={tabTitles[activeTab]} />
        <main className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} className="h-full">
            {Object.keys(tabComponents).map((tab) => (
              <TabsContent key={tab} value={tab} className="h-full p-4 md:p-6 mt-0">
                {activeTab === tab && <ActiveComponent />}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
