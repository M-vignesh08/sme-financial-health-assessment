'use server';

/**
 * @fileOverview Flow to evaluate SME creditworthiness based on financial data and business metrics, generating a credit score.
 *
 * - evaluateCreditworthiness - A function that handles the creditworthiness evaluation process.
 * - EvaluateCreditworthinessInput - The input type for the evaluateCreditworthiness function.
 * - EvaluateCreditworthinessOutput - The return type for the evaluateCreditworthiness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateCreditworthinessInputSchema = z.object({
  revenue: z.number().describe('Annual revenue of the SME.'),
  expenses: z.number().describe('Annual expenses of the SME.'),
  assets: z.number().describe('Total assets of the SME.'),
  liabilities: z.number().describe('Total liabilities of the SME.'),
  cashFlow: z.number().describe('Annual cash flow of the SME.'),
  industry: z.string().describe('Industry of the SME.'),
  businessAge: z.number().describe('Age of the business in years.'),
  loanAmountRequested: z.number().describe('The amount of loan requested by the SME.'),
});
export type EvaluateCreditworthinessInput = z.infer<typeof EvaluateCreditworthinessInputSchema>;

const EvaluateCreditworthinessOutputSchema = z.object({
  creditScore: z.number().describe('A credit score representing the creditworthiness of the SME (0-1000).'),
  creditRating: z.string().describe('A credit rating based on the credit score (e.g., AAA, AA, A, BBB, BB, B, CCC, CC, C, D).'),
  recommendations: z.string().describe('Recommendations for improving creditworthiness and suitable financial products.'),
});
export type EvaluateCreditworthinessOutput = z.infer<typeof EvaluateCreditworthinessOutputSchema>;

export async function evaluateCreditworthiness(input: EvaluateCreditworthinessInput): Promise<EvaluateCreditworthinessOutput> {
  return evaluateCreditworthinessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateCreditworthinessPrompt',
  input: {schema: EvaluateCreditworthinessInputSchema},
  output: {schema: EvaluateCreditworthinessOutputSchema},
  prompt: `You are a financial analyst specializing in evaluating the creditworthiness of SMEs.

  Based on the following financial data and business metrics, generate a credit score (0-1000), assign a credit rating, and provide recommendations for improving creditworthiness and suitable financial products.

  Revenue: {{{revenue}}}
  Expenses: {{{expenses}}}
  Assets: {{{assets}}}
  Liabilities: {{{liabilities}}}
  Cash Flow: {{{cashFlow}}}
  Industry: {{{industry}}}
  Business Age: {{{businessAge}}} years
  Loan Amount Requested: {{{loanAmountRequested}}}

  Consider industry-specific benchmarks and the loan amount requested when evaluating creditworthiness.

  Format your output as a JSON object with 'creditScore', 'creditRating', and 'recommendations' fields. The credit rating should be on a scale of AAA to D.
  `,
});

const evaluateCreditworthinessFlow = ai.defineFlow(
  {
    name: 'evaluateCreditworthinessFlow',
    inputSchema: EvaluateCreditworthinessInputSchema,
    outputSchema: EvaluateCreditworthinessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
