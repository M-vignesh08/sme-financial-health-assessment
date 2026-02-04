"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUploader } from "./file-uploader";
import { Loader2, TrendingUp, TrendingDown, Scale } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

/* ------------------ TYPES ------------------ */
type BackendAnalysisResult = {
  status: string;
  basic_metrics: {
    total_revenue: number;
    total_expense: number;
    net_profit: number;
    profit_margin: number;
  };
  health_score: number;
  health_score_explanation: string;
  trends: any;
  risk_flags: string[];
  recommendations: string[];
  analysis: {
    summary: string;
  };
};

/* ------------------ FORM ------------------ */
const formSchema = z.object({
  businessType: z.string().min(1, "Please select a business type."),
});

const businessTypes = [
  "Manufacturing",
  "Retail",
  "Agriculture",
  "Services",
  "Logistics",
  "E-commerce",
  "Other",
];

export function FinancialStatementAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BackendAnalysisResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "",
    },
  });

  /* ------------------ SUBMIT ------------------ */
  async function onSubmit(_: z.infer<typeof formSchema>) {
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a financial statement file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/analyze-financials`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Analysis failed");
      }

      const data: BackendAnalysisResult = await res.json();
      setResult(data);
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Analyze Statement</CardTitle>
            <CardDescription>
              Upload your financial document and select your business type to get analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormItem>
                  <FormLabel>Financial Document</FormLabel>
                  <FileUploader onFileSelect={setFile} />
                </FormItem>

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-headline">Analysis Results</CardTitle>
            <CardDescription>
              Key metrics and insights from your financial statement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <AnalysisSkeleton />}

            {!isLoading && !result && (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Your analysis will appear here.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <MetricCard
                    title="Total Revenue"
                    value={result.basic_metrics.total_revenue}
                    icon={<TrendingUp className="text-green-500" />}
                  />
                  <MetricCard
                    title="Total Expenses"
                    value={result.basic_metrics.total_expense}
                    icon={<TrendingDown className="text-red-500" />}
                  />
                  <MetricCard
                    title="Profit Margin"
                    value={result.basic_metrics.profit_margin}
                    isPercentage
                    icon={<Scale className="text-blue-500" />}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-headline">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{result.analysis.summary}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ------------------ HELPERS ------------------ */
function MetricCard({
  title,
  value,
  icon,
  isPercentage = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  isPercentage?: boolean;
}) {
  const formattedValue = isPercentage
    ? `${value.toFixed(2)}%`
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
      </CardContent>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
      </div>
      <Skeleton className="h-[150px]" />
    </div>
  );
}
