-- Collective email alert subscribers
CREATE TABLE collective_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Only one active subscription per email
CREATE UNIQUE INDEX idx_collective_subs_active_email
  ON collective_subscribers (email)
  WHERE unsubscribed_at IS NULL;

-- Fast lookup for confirmed active subscribers (used by digest function)
CREATE INDEX idx_collective_subs_confirmed
  ON collective_subscribers (confirmed_at)
  WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL;

-- Collective config (key/value, managed from dashboard admin)
CREATE TABLE collective_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO collective_config (key, value)
VALUES ('digest_enabled', 'true');
