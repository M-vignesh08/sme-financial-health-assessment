"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  classifyTransaction,
  type ClassifyTransactionOutput,
} from "@/ai/flows/assisted-bookkeeping";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, BookCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  transactionDescription: z
    .string()
    .min(3, "Please enter a transaction description."),
  transactionHistory: z
    .string()
    .optional(),
});

export function BookkeepingAssistance() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassifyTransactionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDescription: "",
      transactionHistory: "Date,Description,Category,Amount\n2024-05-01,Office Rent,Rent,2000\n2024-05-03,AWS Services,Utilities,500\n2024-05-05,Staples Order,Supplies,150",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const classificationResult = await classifyTransaction(values);
      setResult(classificationResult);
    } catch (error) {
      console.error("Classification failed:", error);
      toast({
        title: "Classification Failed",
        description: "An error occurred while classifying the transaction. Please try again.",
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
            <CardTitle className="font-headline">Classify Transaction</CardTitle>
            <CardDescription>
              Enter a new transaction to let AI categorize it based on past data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="transactionDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Transaction Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Monthly Adobe Subscription'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="transactionHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction History (CSV format)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide some transaction history for context..."
                          className="h-48 font-mono text-xs"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        AI uses this history to make a better prediction.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Classify Transaction
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-headline">Classification Result</CardTitle>
            <CardDescription>
              The suggested category for your transaction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <ClassificationSkeleton />}
            {!isLoading && !result && (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Your classification will appear here.
                </p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-headline">
                      <BookCheck className="h-5 w-5 text-primary" />
                      Suggested Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-accent">{result.category}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-headline">Explanation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground">{result.explanation}</p>
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

function ClassificationSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[120px] w-full" />
      <Skeleton className="h-[150px] w-full" />
    </div>
  );
}
