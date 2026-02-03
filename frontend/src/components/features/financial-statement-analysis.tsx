"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  analyzeFinancialStatements,
  type AnalyzeFinancialStatementsOutput,
} from "@/ai/flows/analyze-financial-statements";
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

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function FinancialStatementAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeFinancialStatementsOutput | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
      const financialStatementDataUri = await fileToDataUri(file);
      const analysisResult = await analyzeFinancialStatements({
        ...values,
        financialStatementDataUri,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing the statement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Analyze Statement</CardTitle>
            <CardDescription>
              Upload your financial document and select your business type to get an AI-powered analysis.
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
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
                <p className="text-sm text-muted-foreground">
                  Upload a document and click "Analyze" to begin.
                </p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <MetricCard
                    title="Total Revenue"
                    value={result.revenue}
                    icon={<TrendingUp className="text-green-500" />}
                  />
                  <MetricCard
                    title="Total Expenses"
                    value={result.expenses}
                    icon={<TrendingDown className="text-red-500" />}
                  />
                  <MetricCard
                    title="Profit Margin"
                    value={result.profitMargin}
                    isPercentage
                    icon={<Scale className="text-blue-500" />}
                  />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-headline">AI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground">{result.summary}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-headline">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.keyMetrics.map((metric) => (
                        <li
                          key={metric.name}
                          className="flex justify-between border-b pb-2"
                        >
                          <span className="text-sm font-medium capitalize text-muted-foreground">
                            {metric.name.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {metric.value}
                          </span>
                        </li>
                      ))}
                    </ul>
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

function MetricCard({ title, value, icon, isPercentage = false }: { title: string; value: number; icon: React.ReactNode; isPercentage?: boolean }) {
  const formattedValue = isPercentage
    ? `${value.toFixed(2)}%`
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{formattedValue}</div>
      </CardContent>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
      <Skeleton className="h-[150px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}
