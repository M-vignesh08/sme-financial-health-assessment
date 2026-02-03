'use server';

/**
 * @fileOverview Predicts future financial performance based on historical data and market trends.
 *
 * - predictFutureFinancialPerformance - A function that handles the prediction process.
 * - PredictFutureFinancialPerformanceInput - The input type for the predictFutureFinancialPerformance function.
 * - PredictFutureFinancialPerformanceOutput - The return type for the predictFutureFinancialPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureFinancialPerformanceInputSchema = z.object({
  historicalFinancialData: z
    .string()
    .describe(
      'Historical financial data in CSV or XLSX format. Columns are dates, and rows are named financial metrics such as revenue, expenses, net income, etc.'
    ),
  marketTrendsData: z
    .string()
    .optional()
    .describe(
      'Market trends data in CSV or XLSX format, if available. This can include industry growth rates, competitor performance, etc.'
    ),
  assumptions: z
    .string()
    .optional()
    .describe(
      'Any specific assumptions to consider (e.g., planned marketing campaigns, anticipated cost increases).'
    ),
  predictionHorizonMonths: z
    .number()
    .default(12)
    .describe('The number of months into the future to predict.'),
});

export type PredictFutureFinancialPerformanceInput = z.infer<
  typeof PredictFutureFinancialPerformanceInputSchema
>;

const PredictFutureFinancialPerformanceOutputSchema = z.object({
  projectedFinancialStatements:
    z.string().describe('Projected financial statements (income statement, balance sheet, cash flow statement) in tabular format (e.g., CSV, Markdown table).'),
  keyPerformanceIndicators: z
    .string()
    .describe(
      'Key performance indicators (KPIs) such as revenue growth, profit margins, ROI, etc., with explanations of trends.'
    ),
  riskAssessment: z
    .string()
    .describe(
      'An assessment of potential financial risks and opportunities, along with recommendations for mitigation or exploitation.'
    ),
});

export type PredictFutureFinancialPerformanceOutput = z.infer<
  typeof PredictFutureFinancialPerformanceOutputSchema
>;

export async function predictFutureFinancialPerformance(
  input: PredictFutureFinancialPerformanceInput
): Promise<PredictFutureFinancialPerformanceOutput> {
  return predictFutureFinancialPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFutureFinancialPerformancePrompt',
  input: {schema: PredictFutureFinancialPerformanceInputSchema},
  output: {schema: PredictFutureFinancialPerformanceOutputSchema},
  prompt: `You are a financial forecasting expert.

  Based on the historical financial data and market trends, project the company's financial performance over the next {{predictionHorizonMonths}} months.

  Consider any assumptions provided.

  Historical Financial Data:
  {{historicalFinancialData}}

  Market Trends Data (if available):
  {{#if marketTrendsData}}
  {{marketTrendsData}}
  {{else}}
  No market trends data provided.
  {{/if}}

  Assumptions (if any):
  {{#if assumptions}}
  {{assumptions}}
  {{else}}
  No specific assumptions provided.
  {{/if}}

  Provide the following outputs:

  1.  Projected Financial Statements: {{projectedFinancialStatements}}
  2.  Key Performance Indicators: {{keyPerformanceIndicators}}
  3.  Risk Assessment: {{riskAssessment}}`,
});

const predictFutureFinancialPerformanceFlow = ai.defineFlow(
  {
    name: 'predictFutureFinancialPerformanceFlow',
    inputSchema: PredictFutureFinancialPerformanceInputSchema,
    outputSchema: PredictFutureFinancialPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
