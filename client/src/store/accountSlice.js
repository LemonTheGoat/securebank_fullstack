import { createSlice } from '@reduxjs/toolkit';
import { mockUser, mockAccount, mockTransactions, mockLoan } from '../mockData';
import Decimal from 'decimal.js';

const initialState = {
  user: mockUser,
  account: mockAccount,
  loan: mockLoan,
  transactions: mockTransactions,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // This action deducts the transfer amount from the balance
    transferFunds: (state, action) => {
      const { amount, description, destination } = action.payload;
      
      // Use decimal.js to avoid Javascript floating point math errors
      const currentBalance = new Decimal(state.account.balance);
      const transferAmount = new Decimal(amount);
      
      state.account.balance = currentBalance.minus(transferAmount).toFixed(2);
      
      // Log the new transaction
      state.transactions.unshift({
        id: Date.now(),
        source_account_id: state.account.id,
        destination_account_id: destination,
        amount: `-${transferAmount.toFixed(2)}`,
        type: "transfer",
        status: "completed",
        description: description,
        created_at: new Date().toISOString()
      });
    }
  }
});

export const { transferFunds } = accountSlice.actions;
export default accountSlice.reducer;