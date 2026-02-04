"use client";

import { useState } from "react";
import { getBankData, type GetBankDataOutput } from "@/ai/flows/get-bank-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Landmark, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Bank = "HDFC" | "ICICI";
type Account = GetBankDataOutput["accounts"][0];

export function Accounts() {
  const [isLoading, setIsLoading] = useState<Bank | null>(null);
  const [data, setData] = useState<GetBankDataOutput | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [bankToVerify, setBankToVerify] = useState<Bank | null>(null);
  const { toast } = useToast();

  async function handleFetchData(bank: Bank) {
    setIsLoading(bank);
    setData(null);
    setSelectedAccount(null);

    try {
      const result = await getBankData({ bank });
      setData(result);
      if (result.accounts.length > 0) {
        setSelectedAccount(result.accounts[0]);
      }
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${bank} Bank.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Fetch Failed",
        description: "Unable to fetch bank data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  }

  const transactions =
    selectedAccount && data
      ? data.transactions[selectedAccount.id] ?? []
      : [];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Connect Bank Accounts</CardTitle>
          <CardDescription>
            Securely fetch your account and transaction details.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={() => setBankToVerify("HDFC")}>
            {isLoading === "HDFC" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Connect HDFC
          </Button>
          <Button
            variant="secondary"
            onClick={() => setBankToVerify("ICICI")}
          >
            {isLoading === "ICICI" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Connect ICICI
          </Button>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!bankToVerify}
        onOpenChange={(open) => !open && setBankToVerify(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldCheck />
              Secure Bank Connection
            </AlertDialogTitle>
            <AlertDialogDescription>
              This is a demo integration with read-only access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (bankToVerify) handleFetchData(bankToVerify);
                setBankToVerify(null);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.accounts.map((account) => (
                  <Card
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className={cn(
                      "cursor-pointer",
                      selectedAccount?.id === account.id &&
                        "border-primary ring-2 ring-primary"
                    )}
                  >
                    <CardHeader>
                      <CardTitle className="flex gap-2 items-center">
                        <Landmark />
                        {account.bank}
                      </CardTitle>
                      <CardDescription>
                        {account.accountNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">
                        ₹{account.balance.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            {format(new Date(tx.date), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>{tx.description}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                tx.type === "debit"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              ₹{tx.amount.toLocaleString()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center">
                    No transactions found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
