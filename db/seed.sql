INSERT INTO account_products (code, name, category, interest_rate, minimum_balance, monthly_fee, credit_limit_max, term_months) VALUES
  ('SAV_BASIC', 'Basic Savings', 'deposit', 0.0025, 0, 0, NULL, NULL),
  ('SAV_PREMIUM', 'Premium Savings', 'deposit', 0.0250, 10000, 0, NULL, NULL),
  ('CHK_STANDARD', 'Standard Checking', 'deposit', 0.0000, 0, 0, NULL, NULL),
  ('CC_CLASSIC', 'Classic Credit Card', 'credit', 0.2400, 0, 0, 50000, NULL),
  ('CC_PLATINUM', 'Platinum Credit Card', 'credit', 0.1800, 0, 0, 500000, NULL),
  ('LOAN_PERSONAL', 'Personal Loan', 'loan', 0.1200, 0, 0, NULL, 24);
INSERT INTO accounts (user_id, account_number, account_category, account_type, balance) VALUES
  (NULL, 'SYS_CASH', 'deposit', 'system', 0),
  (NULL, 'SYS_FEE_INCOME', 'deposit', 'system', 0),
  (NULL, 'SYS_INTEREST_EXPENSE', 'deposit', 'system', 0),
  (NULL, 'SYS_MERCHANT_SETTLE', 'deposit', 'system', 0);
INSERT INTO users (email, password_hash, full_name, role) VALUES
  ('admin@bank.com', 'PASTE_HASH_HERE', 'Admin User', 'admin'),
  ('customer@bank.com', 'PASTE_HASH_HERE', 'Test Customer', 'customer');
INSERT INTO accounts (user_id, product_id, account_number, account_category, account_type, balance) VALUES
  (2, 3, '00100000001', 'deposit', 'checking', 50000.00),
  (2, 1, '00100000002', 'deposit', 'savings', 100000.00);
INSERT INTO deposit_details (account_id, interest_rate) VALUES (2, 0.0025);