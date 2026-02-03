"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BarChart3,
  Banknote,
  Sparkles,
  BookMarked,
  TrendingUp,
  Link2,
  Settings,
  CircleHelp,
  CreditCard,
  Wallet,
} from "lucide-react";
import { FinSightLogo } from "@/components/icons";

const menuItems = [
  { href: "#dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "#analysis", label: "Financial Analysis", icon: BarChart3 },
  { href: "#cash-flow", label: "Cash Flow", icon: Banknote },
  { href: "#credit-score", label: "Credit Score", icon: CreditCard },
  { href: "#recommendations", label: "Recommendations", icon: Sparkles },
  { href: "#bookkeeping", label: "Bookkeeping", icon: BookMarked },
  { href: "#forecasting", label: "Forecasting", icon: TrendingUp },
  { href: "#accounts", label: "Bank Accounts", icon: Wallet },
  { href: "#integrations", label: "Integrations", icon: Link2 },
];

type AppSidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <FinSightLogo className="size-8 text-primary" />
          <h2 className="font-headline text-lg font-semibold text-sidebar-foreground">
            FinSight Advisor
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                onClick={() => setActiveTab(item.href.substring(1))}
                isActive={activeTab === item.href.substring(1)}
                tooltip={{ children: item.label }}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: "Help & Support" }}>
              <CircleHelp />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: "Settings" }}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
