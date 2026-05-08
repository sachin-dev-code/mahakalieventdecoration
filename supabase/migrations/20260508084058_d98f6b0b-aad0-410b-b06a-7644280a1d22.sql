
CREATE TABLE public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '8 hours')
);

CREATE INDEX idx_admin_sessions_user ON public.admin_sessions(user_id, expires_at);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON public.admin_sessions
FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- Track failed OTP attempts for brute force protection
ALTER TABLE public.admin_otps
  ADD COLUMN IF NOT EXISTS failed_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked boolean NOT NULL DEFAULT false;
