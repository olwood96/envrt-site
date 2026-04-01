-- Aggregates DPP view counts and cumulative CO2/water impact.
-- Used by the homepage live impact ticker via /api/impact-stats.
-- Replaces client-side row iteration that was capped at 1000 by Supabase default.

CREATE OR REPLACE FUNCTION get_impact_stats()
RETURNS TABLE(total_scans bigint, total_co2 double precision, total_water double precision)
LANGUAGE sql STABLE
AS $$
  SELECT
    COUNT(*)::bigint AS total_scans,
    COALESCE(SUM(d.total_emissions), 0) AS total_co2,
    COALESCE(SUM(d.total_water), 0) AS total_water
  FROM dpp_views v
  JOIN dpp_generated d ON d.id = v.dpp_generated_id
  WHERE d.deleted_at IS NULL;
$$;
