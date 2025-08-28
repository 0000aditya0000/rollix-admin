import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface TransactionRecord {
  id: number;
  userId: number;
  type: "deposit" | "withdrawal" | string;
  amount: string;
  cryptoname: string;
  date: string;
  name: string;
  email: string;
  phone: string;
}

export interface TransactionReport {
  success: boolean;
  start_date: string;
  end_date: string;
  total_deposits: number;
  total_withdrawals: number;
  total_transactions: number;
  transactions: TransactionRecord[];
}

export interface Recharge {
  recharge_id: number;
  order_id: string;
  userId: number;
  amount: string;
  type: string;
  mode: string;
  status: string;
  date: string;
  time?: string;
}

export interface Withdrawal {
  withdrawalId: number;
  amountRequested: string;
  cryptoname: string;
  requestDate: string;
  walletBalance: {
    before: string;
    after: string;
  };
  withdrawalStatus: {
    code: string;
    status: string;
  };
  user: {
    userId: number;
    username: string;
    name: string;
    email: string;
    phone: string;
  };
  withdrawalDetails: {
    accountName: string | null;
    accountNumber: string | null;
    ifscCode: string | null;
    branch: string | null;
    bankAccountStatus: string | null;
  };
}

export const exportTransactionsToExcel = (report: TransactionReport) => {
  if (!report || !report.transactions?.length) return;

  const worksheetData = report.transactions.map((txn) => ({
    Type: txn.type,
    Amount: txn.amount,
    Crypto: txn.cryptoname.toUpperCase(),
    Name: txn.name,
    Email: txn.email,
    Phone: txn.phone,
    Date: new Date(txn.date).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(
    data,
    `Transaction_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

export const exportRechargesToExcel = (recharges: Recharge[]) => {
  if (!recharges || !recharges.length) return;

  const worksheetData = recharges.map((rec) => ({
    "Recharge ID": rec.recharge_id,
    "Order ID": rec.order_id,
    "User ID": rec.userId,
    Amount: rec.amount,
    Type: rec.type,
    Mode: rec.mode,
    Status: rec.status,
    Date: new Date(rec.date).toLocaleDateString(),
    Time: rec.time,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Recharges");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(data, `Recharge_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportWithdrawalsToExcel = (withdrawals: Withdrawal[]) => {
  if (!withdrawals || !withdrawals.length) return;

  const worksheetData = withdrawals.map((w) => ({
    "Withdrawal ID": w.withdrawalId,
    "User ID": w.user.userId,
    Username: w.user.username,
    Name: w.user.name,
    Email: w.user.email,
    Phone: w.user.phone,
    Amount: w.amountRequested,
    Crypto: w.cryptoname.toUpperCase(),
    "Wallet Before": w.walletBalance.before,
    "Wallet After": w.walletBalance.after,
    Status: w.withdrawalStatus.status,
    Date: new Date(w.requestDate).toLocaleDateString(),
    Time: new Date(w.requestDate).toLocaleTimeString(),
    "Account Name": w.withdrawalDetails.accountName || "",
    "Account Number": w.withdrawalDetails.accountNumber || "",
    IFSC: w.withdrawalDetails.ifscCode || "",
    Branch: w.withdrawalDetails.branch || "",
    "Bank Account Status": w.withdrawalDetails.bankAccountStatus || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Withdrawals");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(
    data,
    `Withdrawal_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
