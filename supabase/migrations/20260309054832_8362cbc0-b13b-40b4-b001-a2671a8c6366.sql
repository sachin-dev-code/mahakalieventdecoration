
-- Fix bookings policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Admins can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "No public reads on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update booking status" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;
DROP POLICY IF EXISTS "No deletes on bookings" ON public.bookings;

CREATE POLICY "Anyone can submit a booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update booking status" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix contact_messages policies
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "No public reads on contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "No deletes on contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "No updates on contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix reviews policies
DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "No deletes allowed" ON public.reviews;
DROP POLICY IF EXISTS "No updates allowed" ON public.reviews;

CREATE POLICY "Reviews are publicly readable" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can submit a review" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles policies
DROP POLICY IF EXISTS "Admins can read user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "No public modifications" ON public.user_roles;

CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix admin_otps policies
DROP POLICY IF EXISTS "No public access to OTPs" ON public.admin_otps;
CREATE POLICY "Service role only" ON public.admin_otps FOR ALL USING (false);
