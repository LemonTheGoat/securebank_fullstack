CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE user_role AS ENUM ('customer','teller','admin');
CREATE TYPE product_category AS ENUM ('deposit','credit','loan');
CREATE TYPE account_status AS ENUM ('active','frozen','closed');
CREATE TYPE txn_direction AS ENUM ('debit','credit');
CREATE TYPE txn_status AS ENUM ('pending','posted','failed','reversed');
CREATE TYPE card_type AS ENUM ('debit','credit');
CREATE TYPE card_status AS ENUM ('active','frozen','lost','stolen','expired','cancelled');
CREATE TYPE repayment_status AS ENUM ('scheduled','due','paid','partial','late','waived');
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY, email CITEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL, phone TEXT, role user_role NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE, failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_email ON users(email);
CREATE TABLE account_products (
  id BIGSERIAL PRIMARY KEY, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  category product_category NOT NULL, currency CHAR(3) NOT NULL DEFAULT 'PHP',
  interest_rate NUMERIC(6,4), minimum_balance NUMERIC(18,2) NOT NULL DEFAULT 0,
  monthly_fee NUMERIC(18,2) NOT NULL DEFAULT 0, credit_limit_max NUMERIC(18,2),
  term_months INT, is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  product_id BIGINT REFERENCES account_products(id), account_number VARCHAR(20) UNIQUE NOT NULL,
  account_category product_category NOT NULL DEFAULT 'deposit', account_type VARCHAR(30) NOT NULL DEFAULT 'checking',
  currency CHAR(3) NOT NULL DEFAULT 'PHP', balance NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  credit_limit NUMERIC(18,2), available_credit NUMERIC(18,2), status account_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_accounts_number ON accounts(account_number);
CREATE TABLE deposit_details (
  account_id BIGINT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  interest_rate NUMERIC(6,4), compounding TEXT NOT NULL DEFAULT 'monthly', last_accrual_date DATE,
  maturity_date DATE, monthly_withdrawal_limit INT, overdraft_limit NUMERIC(18,2) NOT NULL DEFAULT 0
);
CREATE TABLE credit_details (
  account_id BIGINT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  apr NUMERIC(6,4) NOT NULL, statement_day SMALLINT NOT NULL DEFAULT 1,
  grace_period_days INT NOT NULL DEFAULT 25, minimum_payment_pct NUMERIC(5,4) NOT NULL DEFAULT 0.05,
  cash_advance_limit NUMERIC(18,2), last_statement_date DATE
);
CREATE TABLE loan_details (
  account_id BIGINT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  principal NUMERIC(18,2) NOT NULL, interest_rate NUMERIC(6,4) NOT NULL, term_months INT NOT NULL,
  amortization TEXT NOT NULL DEFAULT 'annuity', disbursed_at TIMESTAMPTZ, maturity_date DATE,
  next_due_date DATE, days_past_due INT NOT NULL DEFAULT 0
);
CREATE TABLE cards (
  id BIGSERIAL PRIMARY KEY, account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  card_type card_type NOT NULL, network TEXT NOT NULL DEFAULT 'visa', last4 CHAR(4) NOT NULL,
  pan_hash TEXT NOT NULL, bin CHAR(6), expiry_month SMALLINT NOT NULL CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year SMALLINT NOT NULL, pin_hash TEXT, status card_status NOT NULL DEFAULT 'active',
  daily_limit NUMERIC(18,2), contactless BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cards_account ON cards(account_id);
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY, reference UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  txn_type TEXT NOT NULL DEFAULT 'transfer_internal', txn_status txn_status NOT NULL DEFAULT 'pending',
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0), currency CHAR(3) NOT NULL,
  from_account_id BIGINT REFERENCES accounts(id), to_account_id BIGINT REFERENCES accounts(id),
  card_id BIGINT REFERENCES cards(id), loan_repayment_id BIGINT, idempotency_key TEXT,
  description TEXT, merchant TEXT, created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), posted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX uq_transactions_idem ON transactions(idempotency_key, created_by) WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_transactions_from ON transactions(from_account_id, created_at DESC);
CREATE INDEX idx_transactions_to ON transactions(to_account_id, created_at DESC);
CREATE TABLE ledger_entries (
  id BIGSERIAL PRIMARY KEY, transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE RESTRICT,
  account_id BIGINT NOT NULL REFERENCES accounts(id), direction txn_direction NOT NULL,
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0), balance_after NUMERIC(18,2) NOT NULL,
  description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ledger_account_time ON ledger_entries(account_id, created_at DESC);
CREATE INDEX idx_ledger_txn ON ledger_entries(transaction_id);
CREATE TABLE loan_repayments (
  id BIGSERIAL PRIMARY KEY, loan_account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  installment_no INT NOT NULL, due_date DATE NOT NULL, principal_due NUMERIC(18,2) NOT NULL,
  interest_due NUMERIC(18,2) NOT NULL, fees_due NUMERIC(18,2) NOT NULL DEFAULT 0,
  total_due NUMERIC(18,2) GENERATED ALWAYS AS (principal_due + interest_due + fees_due) STORED,
  amount_paid NUMERIC(18,2) NOT NULL DEFAULT 0, status repayment_status NOT NULL DEFAULT 'scheduled',
  transaction_id BIGINT REFERENCES transactions(id), paid_at TIMESTAMPTZ, UNIQUE (loan_account_id, installment_no)
);
ALTER TABLE transactions ADD CONSTRAINT fk_txn_repayment FOREIGN KEY (loan_repayment_id) REFERENCES loan_repayments(id);
CREATE TABLE beneficiaries (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL, account_number VARCHAR(20) NOT NULL, bank_name TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_beneficiaries_user ON beneficiaries(user_id);
CREATE TABLE refresh_tokens (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL, expires_at TIMESTAMPTZ NOT NULL, revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT REFERENCES users(id), action TEXT NOT NULL,
  ip INET, user_agent TEXT, meta JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_user_time ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs(action);