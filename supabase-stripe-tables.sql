-- =============================================================================
-- Stripe Payments — Supabase Tables
-- Run this in the Supabase SQL Editor
-- =============================================================================

-- 1. Subscriptions table
-- Tracks Stripe subscriptions created via checkout on envrt.com
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL CHECK (plan IN ('starter', 'growth', 'pro')),
  interval text NOT NULL CHECK (interval IN ('monthly', 'annual')),
  currency text NOT NULL DEFAULT 'gbp' CHECK (currency IN ('gbp', 'eur')),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'past_due', 'cancelled', 'incomplete', 'unpaid')),
  term_months int NOT NULL DEFAULT 12,
  minimum_term_months int NOT NULL DEFAULT 6,
  term_start timestamptz NOT NULL DEFAULT now(),
  term_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for lookups by email and Stripe IDs
CREATE INDEX idx_subscriptions_email ON subscriptions (email);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions (stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions (stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions (status);

-- RLS: service role only (no direct client access)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role can access (anon/authenticated blocked)


-- 2. Onboarding requests table
-- Self-serve brands submit their brand details for admin review
CREATE TABLE onboarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id),
  brand_name text NOT NULL,
  collection_name text NOT NULL,
  logo_path text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for admin lookups
CREATE INDEX idx_onboarding_requests_status ON onboarding_requests (status);
CREATE INDEX idx_onboarding_requests_user ON onboarding_requests (user_id);

-- RLS: service role only
ALTER TABLE onboarding_requests ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role can access


-- 3. Updated_at trigger for subscriptions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
