-- Create financial_transactions table (idempotent)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates, then recreate
DROP POLICY IF EXISTS "Users can view own transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.financial_transactions;

CREATE POLICY "Users can view own transactions"
  ON public.financial_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.financial_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.financial_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.financial_transactions FOR DELETE
  USING (auth.uid() = user_id);