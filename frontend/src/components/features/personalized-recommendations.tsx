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
import { Button } from "@/components/ui/button";
import { Loader2, Lightbulb, CircleDollarSign, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

/* ---------------------------------------------
   MOCK AI OUTPUT TYPE
--------------------------------------------- */
type ProvidePersonalizedRecommendationsOutput = {
  insights: string;
  costOptimizationStrategies: string;
  financialProducts: string;
};

/* ---------------------------------------------
   MOCK AI FUNCTION (REPLACES @/ai/flows)
--------------------------------------------- */
async function providePersonalizedRecommendations(): Promise<ProvidePersonalizedRecommendationsOutput> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        insights:
          "Your business shows strong revenue diversification, but delayed receivables may impact short-term liquidity. Improving payment cycles can strengthen cash flow stability.",
        costOptimizationStrategies:
          "Consider renegotiating supplier contracts, optimizing inventory turnover, and reallocating marketing spend toward higher ROI channels.",
        financialProducts:
          "Short-term working capital loans, invoice discounting, and business credit cards with cashback benefits are suitable for your current profile.",
      });
    }, 1300);
  });
}

/* ---------------------------------------------
   FORM SCHEMA
--------------------------------------------- */
const formSchema = z.object({
  revenueStreams: z.string().min(10, "This field is required."),
  costStructures: z.string().min(10, "This field is required."),
  expenseCategories: z.string().min(10, "This field is required."),
  accountsReceivable: z.string().min(10, "This field is required."),
  accountsPayable: z.string().min(10, "This field is required."),
  inventoryLevels: z.string().optional(),
  loanCreditObligations: z.string().min(10, "This field is required."),
  taxDeductionsCompliance: z.string().min(10, "This field is required."),
  industrySegmentation: z.string().min(2, "This field is required."),
});

export function PersonalizedRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] =
    useState<ProvidePersonalizedRecommendationsOutput | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      revenueStreams: "",
      costStructures: "",
      expenseCategories: "",
      accountsReceivable: "",
      accountsPayable: "",
      inventoryLevels: "",
      loanCreditObligations: "",
      taxDeductionsCompliance: "",
      industrySegmentation: "",
    },
  });

  async function onSubmit(_: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const recommendationsResult =
        await providePersonalizedRecommendations();
      setResult(recommendationsResult);
    } catch (error) {
      console.error("Recommendation generation failed:", error);
      toast({
        title: "Generation Failed",
        description:
          "An error occurred while generating recommendations. Please try again.",
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
            <CardTitle className="font-headline">
              Get Recommendations
            </CardTitle>
            <CardDescription>
              Provide detailed business metrics to receive personalized AI-driven advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="industrySegmentation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., E-commerce, Retail"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="revenueStreams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenue Streams</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Online sales, subscription fees"
                          {...field}
                          className="h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costStructures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Structures</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Cost of goods sold, marketing expenses"
                          {...field}
                          className="h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expenseCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expense Categories</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Salaries, rent, utilities"
                          {...field}
                          className="h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountsReceivable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accounts Receivable</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Average collection period, outstanding invoices"
                          {...field}
                          className="h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountsPayable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accounts Payable</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Payment terms with suppliers"
                          {...field}
                          className="h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Get Recommendations
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle className="font-headline">
              Your Personalized Recommendations
            </CardTitle>
            <CardDescription>
              Actionable advice to improve your business's financial health.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <RecommendationsSkeleton />}

            {!isLoading && !result && (
              <div className="flex h-[300px] items-center justify-center text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Your recommendations will appear here.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <ResultCard
                  title="Actionable Insights"
                  content={result.insights}
                  icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
                />
                <ResultCard
                  title="Cost Optimization Strategies"
                  content={result.costOptimizationStrategies}
                  icon={
                    <CircleDollarSign className="h-5 w-5 text-green-500" />
                  }
                />
                <ResultCard
                  title="Suitable Financial Products"
                  content={result.financialProducts}
                  icon={<Package className="h-5 w-5 text-blue-500" />}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */
function ResultCard({
  title,
  content,
  icon,
}: {
  title: string;
  content: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
}

function RecommendationsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
