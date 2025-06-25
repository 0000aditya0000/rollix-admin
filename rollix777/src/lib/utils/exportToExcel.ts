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
