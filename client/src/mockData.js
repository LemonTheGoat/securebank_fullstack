export const mockUser = {
  id: 1,
  first_name: "Liam",
  last_name: "Salcedo",
  email: "liam@bank.local",
  phone_number: "+639123456789"
};

export const mockAccount = {
  id: 101,
  user_id: 1,
  account_number: "PH-8820-1092-44",
  account_type: "savings",
  balance: "24500.00",
  status: "active"
};

export const mockLoan = {
  id: 301,
  user_id: 1,
  account_id: 101,
  loan_amount: "50000.00",
  interest_rate: "5.50",
  term_months: 12,
  remaining_balance: "32450.00",
  status: "active"
};

export const mockTransactions = [
  {
    id: 1001,
    source_account_id: null,
    destination_account_id: 101,
    amount: "10000.00",
    type: "deposit",
    status: "completed",
    description: "Over-the-counter Cash Deposit",
    created_at: "2026-10-11T14:15:00Z"
  },
  {
    id: 1002,
    source_account_id: 101,
    destination_account_id: 999,
    amount: "-1500.00",
    type: "transfer",
    status: "completed",
    description: "Transfer to Juan Dela Cruz",
    created_at: "2026-10-12T08:30:00Z"
  },
  {
    id: 1003,
    source_account_id: 101,
    destination_account_id: null,
    amount: "-4500.00",
    type: "loan_repayment",
    status: "completed",
    description: "Monthly Loan Amortization Auto-Debit",
    created_at: "2026-10-13T09:00:00Z"
  }
];