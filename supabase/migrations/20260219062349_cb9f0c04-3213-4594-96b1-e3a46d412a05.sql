-- Add status column to bookings
ALTER TABLE public.bookings
ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- Allow admins to update booking status
CREATE POLICY "Admins can update booking status"
ON public.bookings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Drop the old restrictive update policy
DROP POLICY IF EXISTS "No updates on bookings" ON public.bookings;