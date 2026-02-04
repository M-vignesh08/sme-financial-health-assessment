'use server';

/**
 * @fileOverview This file defines a Genkit flow for assisting with bookkeeping tasks.
 *
 * - classifyTransaction - An exported function that classifies a transaction and categorizes expenses.
 * - ClassifyTransactionInput - The input type for the classifyTransaction function.
 * - ClassifyTransactionOutput - The output type for the classifyTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyTransactionInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction to classify.'),
  transactionHistory: z
    .string()
    .describe('A history of previous transactions and their classifications.'),
});
export type ClassifyTransactionInput = z.infer<typeof ClassifyTransactionInputSchema>;

const ClassifyTransactionOutputSchema = z.object({
  category: z
    .string()
    .describe('The predicted category for the transaction (e.g., Utilities, Rent, Supplies).'),
  explanation: z
    .string()
    .describe('Explanation of why the transaction was classified this way.'),
});
export type ClassifyTransactionOutput = z.infer<typeof ClassifyTransactionOutputSchema>;

export async function classifyTransaction(
  input: ClassifyTransactionInput
): Promise<ClassifyTransactionOutput> {
  return classifyTransactionFlow(input);
}

const classifyTransactionPrompt = ai.definePrompt({
  name: 'classifyTransactionPrompt',
  input: {schema: ClassifyTransactionInputSchema},
  output: {schema: ClassifyTransactionOutputSchema},
  prompt: `You are an AI assistant helping with bookkeeping.  Based on the transaction description and history, determine the most likely category for the transaction.

Transaction Description: {{{transactionDescription}}}
Transaction History: {{{transactionHistory}}}

Respond with the category and an explanation.`,
});

const classifyTransactionFlow = ai.defineFlow(
  {
    name: 'classifyTransactionFlow',
    inputSchema: ClassifyTransactionInputSchema,
    outputSchema: ClassifyTransactionOutputSchema,
  },
  async input => {
    const {output} = await classifyTransactionPrompt(input);
    return output!;
  }
);
