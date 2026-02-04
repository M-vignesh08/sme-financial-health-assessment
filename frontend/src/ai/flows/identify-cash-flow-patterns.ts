'use server';

/**
 * @fileOverview Identifies patterns in cash flow data using AI to predict potential liquidity issues.
 *
 * - identifyCashFlowPatterns - A function that analyzes cash flow data.
 * - IdentifyCashFlowPatternsInput - The input type for the identifyCashFlowPatterns function.
 * - IdentifyCashFlowPatternsOutput - The return type for the identifyCashFlowPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyCashFlowPatternsInputSchema = z.object({
  cashFlowData: z
    .string()
    .describe(
      'Cash flow data in CSV or XLSX format.'
    ),
  businessDescription: z.string().describe('A brief description of the business.'),
});
export type IdentifyCashFlowPatternsInput = z.infer<typeof IdentifyCashFlowPatternsInputSchema>;

const IdentifyCashFlowPatternsOutputSchema = z.object({
  patterns: z.array(z.string()).describe('Identified patterns in cash flow data.'),
  potentialIssues: z.array(z.string()).describe('Potential liquidity issues based on the patterns.'),
  recommendations: z.array(z.string()).describe('Recommendations to mitigate potential liquidity issues.'),
});
export type IdentifyCashFlowPatternsOutput = z.infer<typeof IdentifyCashFlowPatternsOutputSchema>;

export async function identifyCashFlowPatterns(input: IdentifyCashFlowPatternsInput): Promise<IdentifyCashFlowPatternsOutput> {
  return identifyCashFlowPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyCashFlowPatternsPrompt',
  input: {schema: IdentifyCashFlowPatternsInputSchema},
  output: {schema: IdentifyCashFlowPatternsOutputSchema},
  prompt: `You are an expert financial analyst specializing in identifying cash flow patterns and potential liquidity issues for SMEs.

You will analyze the provided cash flow data and business description to identify patterns, predict potential issues, and provide recommendations.

Business Description: {{{businessDescription}}}
Cash Flow Data:
{{cashFlowData}}

Output the patterns, potentialIssues, and recommendations as described in the schema.
`,
});

const identifyCashFlowPatternsFlow = ai.defineFlow(
  {
    name: 'identifyCashFlowPatternsFlow',
    inputSchema: IdentifyCashFlowPatternsInputSchema,
    outputSchema: IdentifyCashFlowPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
