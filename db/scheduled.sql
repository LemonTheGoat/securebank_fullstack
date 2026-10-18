CREATE TABLE scheduled_transfers (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_account_id BIGINT NOT NULL REFERENCES accounts(id), to_account_number VARCHAR(20) NOT NULL,
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0), description TEXT, frequency TEXT NOT NULL DEFAULT 'once',
  next_run_at TIMESTAMPTZ NOT NULL, last_run_at TIMESTAMPTZ, is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_scheduled_next_run ON scheduled_transfers(next_run_at) WHERE is_active;