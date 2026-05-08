
-- 1) Lock down user_roles: only service role can modify
CREATE POLICY "Block role inserts from clients"
ON public.user_roles FOR INSERT TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block role updates from clients"
ON public.user_roles FOR UPDATE TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Block role deletes from clients"
ON public.user_roles FOR DELETE TO anon, authenticated
USING (false);

-- 2) Restrict realtime exposure of bookings (admin dashboard will rely on the refresh button)
ALTER PUBLICATION supabase_realtime DROP TABLE public.bookings;

-- 3) Revoke public EXECUTE on SECURITY DEFINER helper (still callable inside RLS policies)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
