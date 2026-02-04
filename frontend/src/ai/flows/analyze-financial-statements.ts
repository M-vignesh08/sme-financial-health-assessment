'use server';

/**
 * @fileOverview Financial statement analysis flow using AI to extract key financial metrics.
 *
 * - analyzeFinancialStatements - A function that analyzes financial statements and extracts key metrics.
 * - AnalyzeFinancialStatementsInput - The input type for the analyzeFinancialStatements function.
 * - AnalyzeFinancialStatementsOutput - The return type for the analyzeFinancialStatements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFinancialStatementsInputSchema = z.object({
  financialStatementDataUri: z
    .string()
    .describe(
      "A financial statement document (CSV, XLSX, or PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  businessType: z
    .string()
    .describe("The type of business (e.g., Manufacturing, Retail, Agriculture, Services, Logistics, E-commerce)."),
});
export type AnalyzeFinancialStatementsInput = z.infer<typeof AnalyzeFinancialStatementsInputSchema>;

const AnalyzeFinancialStatementsOutputSchema = z.object({
  revenue: z.number().describe('Total revenue generated.'),
  expenses: z.number().describe('Total expenses incurred.'),
  profitMargin: z.number().describe('Profit margin percentage.'),
  keyMetrics: z
    .array(
      z.object({
        name: z.string().describe('Name of the metric'),
        value: z.string().describe('Value of the metric'),
      })
    )
    .describe('A list of key financial metrics and their values.'),
  summary: z.string().describe('A summary of the financial statement analysis.'),
});

export type AnalyzeFinancialStatementsOutput = z.infer<typeof AnalyzeFinancialStatementsOutputSchema>;

export async function analyzeFinancialStatements(
  input: AnalyzeFinancialStatementsInput
): Promise<AnalyzeFinancialStatementsOutput> {
  return analyzeFinancialStatementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFinancialStatementsPrompt',
  input: {schema: AnalyzeFinancialStatementsInputSchema},
  output: {schema: AnalyzeFinancialStatementsOutputSchema},
  prompt: `You are a financial analyst specializing in analyzing financial statements for SMEs.

You will analyze the provided financial statement data to extract key financial metrics such as revenue, expenses, and profit margins.

Based on the business type, provide a summary of the company's financial performance and highlight any areas of concern or opportunities for improvement.

Financial Statement Data: {{media url=financialStatementDataUri}}
Business Type: {{{businessType}}}

Output the results in JSON format, including revenue, expenses, profitMargin, keyMetrics (as an array of objects with name and value), and a summary.
`,
});

const analyzeFinancialStatementsFlow = ai.defineFlow(
  {
    name: 'analyzeFinancialStatementsFlow',
    inputSchema: AnalyzeFinancialStatementsInputSchema,
    outputSchema: AnalyzeFinancialStatementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
