"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  evaluateCreditworthiness,
  type EvaluateCreditworthinessOutput,
} from "@/ai/flows/evaluate-creditworthiness";
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
import { Loader2, ShieldCheck, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  revenue: z.coerce.number().positive("Revenue must be a positive number."),
  expenses: z.coerce.number().positive("Expenses must be a positive number."),
  assets: z.coerce.number().positive("Assets must be a positive number."),
  liabilities: z.coerce.number().positive("Liabilities must be a positive number."),
  cashFlow: z.coerce.number().positive("Cash flow must be a positive number."),
  industry: z.string().min(2, "Industry is required."),
  businessAge: z.coerce.number().int().min(0, "Business age cannot be negative."),
  loanAmountRequested: z.coerce.number().positive("Loan amount must be a positive number."),
});

export function CreditworthinessEvaluation() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluateCreditworthinessOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      revenue: 0,
      expenses: 0,
      assets: 0,
      liabilities: 0,
      cashFlow: 0,
      industry: "",
      businessAge: 0,
      loanAmountRequested: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const evaluationResult = await evaluateCreditworthiness(values);
      setResult(evaluationResult);
    } catch (error) {
      console.error("Evaluation failed:", error);
      toast({
        title: "Evaluation Failed",
        description: "An error occurred during creditworthiness evaluation. Please try again.",
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
            <CardTitle className="font-headline">Evaluate Creditworthiness</CardTitle>
            <CardDescription>
              Fill in your financial details to get a credit score and rating.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="revenue" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Annual Revenue</FormLabel>
                        <FormControl><Input type="number" placeholder="500000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="expenses" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Annual Expenses</FormLabel>
                        <FormControl><Input type="number" placeholder="300000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="assets" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Assets</FormLabel>
                        <FormControl><Input type="number" placeholder="250000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="liabilities" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Liabilities</FormLabel>
                        <FormControl><Input type="number" placeholder="50000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="cashFlow" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Annual Cash Flow</FormLabel>
                        <FormControl><Input type="number" placeholder="150000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="industry" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl><Input placeholder="e.g., Retail" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="businessAge" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Business Age (years)</FormLabel>
                        <FormControl><Input type="number" placeholder="5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="loanAmountRequested" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Loan Amount Requested</FormLabel>
                        <FormControl><Input type="number" placeholder="100000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Evaluate
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle className="font-headline">Credit Score & Rating</CardTitle>
            <CardDescription>
              Your AI-generated creditworthiness assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <EvaluationSkeleton />}
            {!isLoading && !result && (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Your credit score will appear here.
                </p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <Card className="flex flex-col items-center justify-center p-6 text-center">
                  <CardTitle className="text-base font-medium text-muted-foreground">Credit Score</CardTitle>
                  <div className="my-4 text-7xl font-bold font-headline text-primary">{result.creditScore}</div>
                  <Progress value={(result.creditScore / 1000) * 100} className="w-full" />
                   <div className="mt-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg font-semibold">{result.creditRating} Rating</span>
                   </div>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-headline">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{result.recommendations}</p>
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

function EvaluationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-20 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-24" />
      </div>
       <Skeleton className="h-32 w-full" />
    </div>
  );
}
