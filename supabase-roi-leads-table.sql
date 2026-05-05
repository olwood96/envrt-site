-- =============================================================================
-- ROI Calculator Leads — Supabase Table
-- Run this in the Supabase SQL Editor
-- =============================================================================

CREATE TABLE roi_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  brand_name text NOT NULL,
  email text NOT NULL,
  marketing_consent boolean NOT NULL DEFAULT false,
  sku_count int NOT NULL,
  data_maturity text NOT NULL,
  hours_per_product int,
  market text NOT NULL,
  approach text NOT NULL,
  envrt_cost int NOT NULL,
  envrt_plan text NOT NULL,
  consultant_cost int NOT NULL,
  inhouse_cost int NOT NULL,
  max_saving int NOT NULL,
  hours_saved int,
  days_saved int,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_roi_leads_email ON roi_leads (email);
CREATE INDEX idx_roi_leads_created ON roi_leads (created_at);

-- RLS: service role only (no direct client access)
ALTER TABLE roi_leads ENABLE ROW LEVEL SECURITY;
