"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  identifyCashFlowPatterns,
  type IdentifyCashFlowPatternsOutput,
} from "@/ai/flows/identify-cash-flow-patterns";
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
import { Loader2, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  businessDescription: z
    .string()
    .min(10, "Please provide a brief business description."),
});

// Mock function to read CSV/XLSX. In a real app, this would use a library.
// For this AI flow, we can just pass the content as a string.
function fileToString(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function CashFlowPatterns() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyCashFlowPatternsOutput | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a cash flow data file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const cashFlowData = await fileToString(file);
      const analysisResult = await identifyCashFlowPatterns({
        ...values,
        cashFlowData,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing cash flow. Please try again.",
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
            <CardTitle className="font-headline">Analyze Cash Flow</CardTitle>
            <CardDescription>
              Upload your cash flow data (CSV/XLSX) to identify patterns and predict liquidity issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormItem>
                  <FormLabel>Cash Flow Data</FormLabel>
                  <FileUploader
                    onFileSelect={setFile}
                    acceptedFileTypes=".csv, .xlsx"
                    labelText="Upload a CSV or XLSX file"
                  />
                </FormItem>

                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A small e-commerce business selling handmade crafts..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Identify Patterns
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-headline">Cash Flow Insights</CardTitle>
            <CardDescription>
              Identified patterns, potential risks, and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <AnalysisSkeleton />}
            {!isLoading && !result && (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Your cash flow insights will appear here.
                </p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <ResultCard
                  title="Identified Patterns"
                  items={result.patterns}
                  icon={<Lightbulb className="h-5 w-5 text-blue-500" />}
                />
                <ResultCard
                  title="Potential Liquidity Issues"
                  items={result.potentialIssues}
                  icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />}
                />
                <ResultCard
                  title="Recommendations"
                  items={result.recommendations}
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResultCard({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No items to display.</p>
        )}
      </CardContent>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
