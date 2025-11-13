-- Create payments table for DCM payment integration
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  partner_code TEXT NOT NULL,
  dest_bank TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  narration TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  response JSONB,
  verification_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON public.payments(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON public.payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT r.user_id FROM public.registrations r WHERE r.id = payments.registration_id
    )
  );

-- Policy: Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users WHERE is_active = true
    )
  );

-- Policy: Service role can manage all payments (for Edge Functions)
CREATE POLICY "Service role can manage payments" ON public.payments
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();

-- Add payment_status and payment_id columns to registrations table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'payment_id') THEN
        ALTER TABLE public.registrations ADD COLUMN payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'payment_status') THEN
        ALTER TABLE public.registrations ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed'));
    END IF;
END $$;

-- Create a view for payment statistics
CREATE OR REPLACE VIEW public.payment_statistics AS
SELECT
    e.id AS event_id,
    e.title AS event_title,
    COUNT(p.id) AS total_payments,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END) AS completed_payments,
    COUNT(CASE WHEN p.status = 'pending' THEN 1 END) AS pending_payments,
    COUNT(CASE WHEN p.status = 'failed' THEN 1 END) AS failed_payments,
    COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) AS total_revenue,
    COALESCE(AVG(CASE WHEN p.status = 'completed' THEN p.amount END), 0) AS average_payment
FROM
    public.events e
LEFT JOIN
    public.payments p ON e.id = p.event_id
GROUP BY
    e.id, e.title;

