"use server";

/**
 * @fileOverview A flow for fetching bank account data.
 *
 * - getBankData - Fetches bank accounts and transactions
 * - GetBankDataInput - Input type
 * - GetBankDataOutput - Output type
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

/* -------------------- SCHEMAS -------------------- */

const AccountSchema = z.object({
  id: z.string(),
  accountNumber: z.string(),
  balance: z.number(),
  bank: z.enum(["HDFC", "ICICI"]),
});

const TransactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(["debit", "credit"]),
});

const GetBankDataInputSchema = z.object({
  bank: z.enum(["HDFC", "ICICI"]),
});

export type GetBankDataInput = z.infer<typeof GetBankDataInputSchema>;

const GetBankDataOutputSchema = z.object({
  accounts: z.array(AccountSchema),
  transactions: z.record(z.string(), z.array(TransactionSchema)),
});

export type GetBankDataOutput = z.infer<typeof GetBankDataOutputSchema>;

/* -------------------- TOOLS -------------------- */

const getHdfcBankAccounts = ai.defineTool(
  {
    name: "getHdfcBankAccounts",
    description: "Fetch HDFC bank accounts",
    outputSchema: z.array(AccountSchema),
  },
  async () => [
    {
      id: "hdfc-1",
      accountNumber: "**** **** **** 1234",
      balance: 50000,
      bank: "HDFC",
    },
    {
      id: "hdfc-2",
      accountNumber: "**** **** **** 5678",
      balance: 120000,
      bank: "HDFC",
    },
  ]
);

const getIciciBankAccounts = ai.defineTool(
  {
    name: "getIciciBankAccounts",
    description: "Fetch ICICI bank accounts",
    outputSchema: z.array(AccountSchema),
  },
  async () => [
    {
      id: "icici-1",
      accountNumber: "**** **** **** 4321",
      balance: 75000,
      bank: "ICICI",
    },
  ]
);

const getHdfcAccountTransactions = ai.defineTool(
  {
    name: "getHdfcAccountTransactions",
    description: "Fetch HDFC account transactions",
    inputSchema: z.object({ accountId: z.string() }),
    outputSchema: z.array(TransactionSchema),
  },
  async ({ accountId }) => {
    if (accountId === "hdfc-1") {
      return [
        {
          id: "t1",
          date: "2024-05-25",
          description: "Salary Credit",
          amount: 30000,
          type: "credit",
        },
        {
          id: "t2",
          date: "2024-05-26",
          description: "Rent Payment",
          amount: 15000,
          type: "debit",
        },
      ];
    }

    if (accountId === "hdfc-2") {
      return [
        {
          id: "t3",
          date: "2024-05-27",
          description: "Client Payment",
          amount: 50000,
          type: "credit",
        },
        {
          id: "t4",
          date: "2024-05-28",
          description: "Office Supplies",
          amount: 10000,
          type: "debit",
        },
      ];
    }

    return [];
  }
);

const getIciciAccountTransactions = ai.defineTool(
  {
    name: "getIciciAccountTransactions",
    description: "Fetch ICICI account transactions",
    inputSchema: z.object({ accountId: z.string() }),
    outputSchema: z.array(TransactionSchema),
  },
  async ({ accountId }) => {
    if (accountId === "icici-1") {
      return [
        {
          id: "t5",
          date: "2024-05-24",
          description: "Initial Deposit",
          amount: 75000,
          type: "credit",
        },
        {
          id: "t6",
          date: "2024-05-29",
          description: "Online Purchase",
          amount: 5000,
          type: "debit",
        },
      ];
    }

    return [];
  }
);

/* -------------------- FLOW -------------------- */

const getBankDataFlow = ai.defineFlow(
  {
    name: "getBankDataFlow",
    inputSchema: GetBankDataInputSchema,
    outputSchema: GetBankDataOutputSchema,
  },
  async ({ bank }) => {
    const accounts =
      bank === "HDFC"
        ? await getHdfcBankAccounts()
        : await getIciciBankAccounts();

    const transactions: Record<string, z.infer<typeof TransactionSchema>[]> = {};

    for (const account of accounts) {
      transactions[account.id] =
        bank === "HDFC"
          ? await getHdfcAccountTransactions({ accountId: account.id })
          : await getIciciAccountTransactions({ accountId: account.id });
    }

    return {
      accounts,
      transactions,
    };
  }
);

/* -------------------- EXPORT -------------------- */

export async function getBankData(
  input: GetBankDataInput
): Promise<GetBankDataOutput> {
  return getBankDataFlow(input);
}
