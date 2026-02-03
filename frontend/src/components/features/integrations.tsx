"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Banknote, Building, Landmark, Link2 } from "lucide-react";

const integrations = [
  {
    name: "GST Portal",
    description: "Sync your GST filing data automatically.",
    icon: <Building className="h-8 w-8 text-primary" />,
    category: "Government",
  },
  {
    name: "HDFC Bank",
    description: "Connect your HDFC bank account for real-time transactions.",
    icon: <Landmark className="h-8 w-8 text-primary" />,
    category: "Banking",
  },
  {
    name: "ICICI Bank",
    description: "Sync transactions from your ICICI bank account.",
    icon: <Landmark className="h-8 w-8 text-primary" />,
    category: "Banking",
  },
  {
    name: "Razorpay",
    description: "Integrate your payment gateway for revenue tracking.",
    icon: <Banknote className="h-8 w-8 text-primary" />,
    category: "Payments",
  },
];

export function Integrations() {
  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle className="font-headline text-2xl">Integrations</CardTitle>
        <CardDescription>
          Connect your financial accounts to streamline data analysis and get a holistic view of your business.
        </CardDescription>
      </CardHeader>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name} className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4">
              {integration.icon}
              <div>
                <CardTitle className="font-headline text-lg">{integration.name}</CardTitle>
                <CardDescription>{integration.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button className="w-full">
                <Link2 className="mr-2 h-4 w-4" /> Connect
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
