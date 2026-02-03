"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  predictFutureFinancialPerformance,
  type PredictFutureFinancialPerformanceOutput,
} from "@/ai/flows/predict-future-financial-performance";
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
import { Button } from "@/components/ui/button";
import { FileUploader } from "./file-uploader";
import { Loader2, TrendingUp, BarChart2, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

const formSchema = z.object({
  assumptions: z.string().optional(),
  predictionHorizonMonths: z.coerce.number().int().min(1).max(36).default(12),
});

function fileToString(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function FinancialForecasting() {
  const [historicalFile, setHistoricalFile] = useState<File | null>(null);
  const [marketFile, setMarketFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictFutureFinancialPerformanceOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      predictionHorizonMonths: 12,
      assumptions: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!historicalFile) {
      toast({
        title: "Error",
        description: "Please upload a historical financial data file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const historicalFinancialData = await fileToString(historicalFile);
      const marketTrendsData = marketFile ? await fileToString(marketFile) : undefined;
      
      const analysisResult = await predictFutureFinancialPerformance({
        ...values,
        historicalFinancialData,
        marketTrendsData,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error("Forecasting failed:", error);
      toast({
        title: "Forecasting Failed",
        description: "An error occurred while generating the forecast. Please try again.",
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
            <CardTitle className="font-headline">Generate Forecast</CardTitle>
            <CardDescription>
              Upload historical data to predict future financial performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormItem>
                  <FormLabel>Historical Financial Data</FormLabel>
                  <FileUploader
                    onFileSelect={setHistoricalFile}
                    acceptedFileTypes=".csv, .xlsx"
                    labelText="Upload CSV or XLSX"
                  />
                </FormItem>
                 <FormItem>
                  <FormLabel>Market Trends Data (Optional)</FormLabel>
                  <FileUploader
                    onFileSelect={setMarketFile}
                    acceptedFileTypes=".csv, .xlsx"
                    labelText="Upload CSV or XLSX"
                  />
                </FormItem>

                <FormField
                  control={form.control}
                  name="predictionHorizonMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prediction Horizon (Months)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assumptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assumptions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'New product launch in Q3'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Forecast
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle className="font-headline">Forecast Results</CardTitle>
            <CardDescription>
              Projections and insights based on your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <ForecastSkeleton />}
            {!isLoading && !result && (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Your forecast will appear here.
                </p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <ResultCard title="Projected Financial Statements" content={result.projectedFinancialStatements} icon={<BarChart2 className="h-5 w-5 text-primary" />} isTable />
                <ResultCard title="Key Performance Indicators" content={result.keyPerformanceIndicators} icon={<TrendingUp className="h-5 w-5 text-green-500" />} />
                <ResultCard title="Risk Assessment" content={result.riskAssessment} icon={<ShieldAlert className="h-5 w-5 text-red-500" />} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResultCard({ title, content, icon, isTable = false }: { title: string; content: string; icon: React.ReactNode; isTable?: boolean }) {
    // A simple CSV/Markdown table to HTML converter
    const renderContent = () => {
        if (isTable) {
            const rows = content.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
            if (rows.length < 2) return <p className="text-sm">{content}</p>;
            
            const header = rows[0];
            // Skip the separator line often found in markdown tables
            const body = rows[1].every(cell => /^-+$/.test(cell)) ? rows.slice(2) : rows.slice(1);

            return (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                {header.map((h, i) => <th key={i} className="p-2 text-left font-semibold">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {body.map((row, i) => (
                                <tr key={i} className="border-b">
                                    {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        return <p className="text-sm whitespace-pre-wrap">{content}</p>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-headline">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}

function ForecastSkeleton() {
  return (
    <div className="space-y-6">
       <Skeleton className="h-40 w-full" />
       <Skeleton className="h-24 w-full" />
       <Skeleton className="h-24 w-full" />
    </div>
  );
}
