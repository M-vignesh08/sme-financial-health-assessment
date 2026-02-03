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

type Account = GetBankDataOutput["accounts"][0];
type Bank = "HDFC" | "ICICI";

export function Accounts() {
  const [isLoading, setIsLoading] = useState<Bank | false>(false);
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
        description: `Successfully connected to ${bank} and fetched account data.`,
      });
    } catch (error) {
      console.error("Failed to fetch bank data:", error);
      toast({
        title: "Fetch Failed",
        description: `An error occurred while fetching ${bank} data. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerificationContinue = () => {
    if (bankToVerify) {
      handleFetchData(bankToVerify);
    }
    setBankToVerify(null);
  };
  
  const transactions = selectedAccount ? data?.transactions[selectedAccount.id] ?? [] : [];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Connect Bank Accounts</CardTitle>
          <CardDescription>
            Fetch your bank account details and transactions from partner banks.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            onClick={() => setBankToVerify("HDFC")}
            disabled={isLoading === "HDFC"}
          >
            {isLoading === "HDFC" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Connect to HDFC Bank
          </Button>
          <Button
            onClick={() => setBankToVerify("ICICI")}
            disabled={isLoading === "ICICI"}
            variant="secondary"
          >
            {isLoading === "ICICI" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Connect to ICICI Bank
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={!!bankToVerify} onOpenChange={(open) => !open && setBankToVerify(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-headline">
              <ShieldCheck className="text-primary" />
              Secure Connection to {bankToVerify}
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are being connected to the bank's secure portal. FinSight Advisor will have read-only access and will not store your login credentials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerificationContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading && !data && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Connecting to the bank and fetching data...</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Your Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.accounts.length > 0 ? data.accounts.map((account) => (
                  <Card 
                    key={account.id} 
                    className={`cursor-pointer transition-all ${selectedAccount?.id === account.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
                    onClick={() => setSelectedAccount(account)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base font-headline">
                        <Landmark className="h-5 w-5 text-accent" />
                        {account.bank} Bank
                      </CardTitle>
                      <CardDescription>{account.accountNumber}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(account.balance)}
                      </p>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-muted-foreground text-sm">No accounts found for the selected bank.</p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Transactions</CardTitle>
                <CardDescription>
                  Recent transactions for {selectedAccount?.accountNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
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
                          <TableCell>{format(new Date(tx.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{tx.description}</TableCell>
                          <TableCell className="text-right">
                             <Badge
                                variant={tx.type === 'debit' ? 'destructive' : 'default'}
                                className={cn(
                                    tx.type === 'credit' && 'bg-green-600 hover:bg-green-700 text-primary-foreground border-transparent'
                                )}
                                >
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(tx.amount)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">
                      No transactions to display for this account.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
