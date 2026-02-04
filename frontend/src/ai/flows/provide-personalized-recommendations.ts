'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized financial recommendations to SMEs.
 *
 * The flow analyzes business metrics to suggest actionable insights, cost optimization strategies, and
 * suitable financial products. It exports a function `providePersonalizedRecommendations` that takes
 * `ProvidePersonalizedRecommendationsInput` as input and returns `ProvidePersonalizedRecommendationsOutput`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const ProvidePersonalizedRecommendationsInputSchema = z.object({
  revenueStreams: z
    .string()
    .describe('Description of the company\'s revenue streams.'),
  costStructures: z
    .string()
    .describe('Description of the company\'s cost structures.'),
  expenseCategories: z
    .string()
    .describe('Overview of the company\'s expense categories.'),
  accountsReceivable: z
    .string()
    .describe('Information about accounts receivable.'),
  accountsPayable: z.string().describe('Information about accounts payable.'),
  inventoryLevels: z
    .string()
    .optional()
    .describe('Information about inventory levels, if applicable.'),
  loanCreditObligations: z
    .string()
    .describe('Details about the company\'s loan and credit obligations.'),
  taxDeductionsCompliance: z
    .string()
    .describe('Information on tax deductions and compliance.'),
  industrySegmentation: z
    .string()
    .describe('The industry segment of the business (e.g., Manufacturing, Retail).'),
});
export type ProvidePersonalizedRecommendationsInput = z.infer<
  typeof ProvidePersonalizedRecommendationsInputSchema
>;

// Define the output schema for the flow
const ProvidePersonalizedRecommendationsOutputSchema = z.object({
  insights: z.string().describe('Actionable insights for the business.'),
  costOptimizationStrategies: z
    .string()
    .describe('Recommended cost optimization strategies.'),
  financialProducts: z
    .string()
    .describe('Suitable financial products from banks and NBFCs.'),
});
export type ProvidePersonalizedRecommendationsOutput = z.infer<
  typeof ProvidePersonalizedRecommendationsOutputSchema
>;

// Exported function to provide personalized recommendations
export async function providePersonalizedRecommendations(
  input: ProvidePersonalizedRecommendationsInput
): Promise<ProvidePersonalizedRecommendationsOutput> {
  return providePersonalizedRecommendationsFlow(input);
}

// Define the prompt for generating personalized recommendations
const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: ProvidePersonalizedRecommendationsInputSchema},
  output: {schema: ProvidePersonalizedRecommendationsOutputSchema},
  prompt: `You are an AI-powered financial advisor for SMEs. Analyze the following business metrics and provide actionable insights, cost optimization strategies, and suitable financial product recommendations.

Business Metrics:
Revenue Streams: {{{revenueStreams}}}
Cost Structures: {{{costStructures}}}
Expense Categories: {{{expenseCategories}}}
Accounts Receivable: {{{accountsReceivable}}}
Accounts Payable: {{{accountsPayable}}}
{{#if inventoryLevels}}Inventory Levels: {{{inventoryLevels}}}{{/if}}
Loan/Credit Obligations: {{{loanCreditObligations}}}
Tax Deductions & Compliance: {{{taxDeductionsCompliance}}}
Industry: {{{industrySegmentation}}}

Provide your analysis, insights, and recommendations in a clear and concise manner.
`,
});

// Define the Genkit flow for providing personalized recommendations
const providePersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'providePersonalizedRecommendationsFlow',
    inputSchema: ProvidePersonalizedRecommendationsInputSchema,
    outputSchema: ProvidePersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
