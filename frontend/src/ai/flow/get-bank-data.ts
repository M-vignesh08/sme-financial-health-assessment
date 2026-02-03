'use server';

/**
 * @fileOverview A flow for fetching bank account data.
 *
 * - getBankData - A function that fetches bank account and transaction data.
 * - GetBankDataInput - The input type for the getBankData function.
 * - GetBankDataOutput - The return type for the getBankData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccountSchema = z.object({
  id: z.string().describe('The account ID'),
  accountNumber: z.string().describe('The bank account number'),
  balance: z.number().describe('The account balance'),
  bank: z.string().describe('The bank name (HDFC or ICICI)'),
});

const TransactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(['debit', 'credit']),
});

const GetBankDataInputSchema = z.object({
  bank: z.enum(['HDFC', 'ICICI']),
});
export type GetBankDataInput = z.infer<typeof GetBankDataInputSchema>;

const GetBankDataOutputSchema = z.object({
  accounts: z.array(AccountSchema),
  transactions: z.record(z.string(), z.array(TransactionSchema)),
});
export type GetBankDataOutput = z.infer<typeof GetBankDataOutputSchema>;

const getHdfcBankAccounts = ai.defineTool(
  {
    name: 'getHdfcBankAccounts',
    description: 'Get HDFC bank accounts.',
    outputSchema: z.array(AccountSchema),
  },
  async () => {
    return [
      { id: 'hdfc-1', accountNumber: '**** **** **** 1234', balance: 50000, bank: 'HDFC' },
      { id: 'hdfc-2', accountNumber: '**** **** **** 5678', balance: 120000, bank: 'HDFC' },
    ];
  }
);

const getIciciBankAccounts = ai.defineTool(
  {
    name: 'getIciciBankAccounts',
    description: 'Get ICICI bank accounts.',
    outputSchema: z.array(AccountSchema),
  },
  async () => {
    return [
      { id: 'icici-1', accountNumber: '**** **** **** 4321', balance: 75000, bank: 'ICICI' },
    ];
  }
);

const getHdfcAccountTransactions = ai.defineTool(
    {
      name: 'getHdfcAccountTransactions',
      description: 'Get transactions for a given HDFC account ID.',
      inputSchema: z.object({ accountId: z.string() }),
      outputSchema: z.array(TransactionSchema),
    },
    async ({ accountId }) => {
        if (accountId === 'hdfc-1') {
            return [
                { id: 't1', date: '2024-05-25', description: 'Salary Credit', amount: 30000, type: 'credit' },
                { id: 't2', date: '2024-05-26', description: 'Rent Payment', amount: 15000, type: 'debit' },
                { id: 't3', date: '2024-05-27', description: 'Grocery Shopping', amount: 2500, type: 'debit' },
            ];
        }
        if (accountId === 'hdfc-2') {
            return [
                { id: 't4', date: '2024-05-25', description: 'Client Payment', amount: 50000, type: 'credit' },
                { id: 't5', date: '2024-05-28', description: 'Office Supplies', amount: 10000, type: 'debit' },
            ];
        }
        return [];
    }
  );

  const getIciciAccountTransactions = ai.defineTool(
    {
      name: 'getIciciAccountTransactions',
      description: 'Get transactions for a given ICICI account ID.',
      inputSchema: z.object({ accountId: z.string() }),
      outputSchema: z.array(TransactionSchema),
    },
    async ({ accountId }) => {
        if (accountId === 'icici-1') {
            return [
                { id: 't6', date: '2024-05-24', description: 'Initial Deposit', amount: 75000, type: 'credit' },
                { id: 't7', date: '2024-05-29', description: 'Online Purchase', amount: 5000, type: 'debit' },
            ];
        }
        return [];
    }
  );

export async function getBankData(input: GetBankDataInput): Promise<GetBankDataOutput> {
  return getBankDataFlow(input);
}

const getBankDataFlow = ai.defineFlow(
  {
    name: 'getBankDataFlow',
    inputSchema: GetBankDataInputSchema,
    outputSchema: GetBankDataOutputSchema,
  },
  async ({ bank }) => {
    let accounts = [];
    if (bank === 'HDFC') {
      accounts = await getHdfcBankAccounts();
    } else if (bank === 'ICICI') {
      accounts = await getIciciBankAccounts();
    }

    const transactions: Record<string, z.infer<typeof TransactionSchema>[]> = {};
    for (const account of accounts) {
        if (bank === 'HDFC') {
            transactions[account.id] = await getHdfcAccountTransactions({ accountId: account.id });
        } else if (bank === 'ICICI') {
            transactions[account.id] = await getIciciAccountTransactions({ accountId: account.id });
        }
    }

    return {
      accounts,
      transactions,
    };
  }
);
