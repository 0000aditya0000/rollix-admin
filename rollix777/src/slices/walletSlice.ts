import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Wallet {
  id: number;
  userId: number;
  balance: string;
  cryptoname: string;
}

interface WalletState {
  wallets: Wallet[];
}

const initialState: WalletState = {
  wallets: [],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    deposit: (
      state,
      action: PayloadAction<{ cryptoname: string; amount: number }>
    ) => {
      const { cryptoname, amount } = action.payload;
      const wallet = state.wallets.find((w) => w.cryptoname === cryptoname);
      if (wallet) {
        wallet.balance = (parseFloat(wallet.balance) + amount).toString();
      }
    },
    withdraw: (
      state,
      action: PayloadAction<{ cryptoname: string; amount: number }>
    ) => {
      const { cryptoname, amount } = action.payload;
      const wallet = state.wallets.find((w) => w.cryptoname === cryptoname);
      if (wallet) {
        const currentBalance = parseFloat(wallet.balance);
        if (currentBalance >= amount) {
          wallet.balance = (currentBalance - amount).toString();
        } else {
          console.warn("Insufficient balance");
        }
      }
    },
    setWallets: (state, action: PayloadAction<Wallet[]>) => {
      state.wallets = action.payload;
    },
  },
});

export const { deposit, withdraw, setWallets } = walletSlice.actions;
export default walletSlice.reducer;
