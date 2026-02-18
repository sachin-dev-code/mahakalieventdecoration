
-- Fix 1: Change validate_review_content to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.validate_review_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name = TRIM(NEW.name);
  NEW.location = TRIM(NEW.location);
  NEW.review_text = TRIM(NEW.review_text);
  NEW.event_category = TRIM(NEW.event_category);
  
  IF LENGTH(NEW.name) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters';
  END IF;
  
  IF LENGTH(NEW.location) < 2 THEN
    RAISE EXCEPTION 'Location must be at least 2 characters';
  END IF;
  
  IF LENGTH(NEW.review_text) < 5 THEN
    RAISE EXCEPTION 'Review must be at least 5 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix 2: Rate limiting - prevent same name+location submitting more than 3 reviews per day
CREATE OR REPLACE FUNCTION public.check_review_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.reviews
  WHERE name = NEW.name
    AND location = NEW.location
    AND created_at > NOW() - INTERVAL '1 day';
  
  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 3 reviews per day.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

CREATE TRIGGER check_review_rate_limit_trigger
BEFORE INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.check_review_rate_limit();

-- Fix 3: Create bookings and contact_messages tables
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  village VARCHAR(100) NOT NULL,
  service VARCHAR(50) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  venue VARCHAR(200),
  additional_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking"
ON public.bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "No public reads on bookings"
ON public.bookings FOR SELECT
USING (false);

CREATE POLICY "No updates on bookings"
ON public.bookings FOR UPDATE
USING (false);

CREATE POLICY "No deletes on bookings"
ON public.bookings FOR DELETE
USING (false);

-- Validate booking input
CREATE OR REPLACE FUNCTION public.validate_booking_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.full_name = TRIM(NEW.full_name);
  NEW.village = TRIM(NEW.village);
  NEW.mobile = TRIM(NEW.mobile);
  
  IF LENGTH(NEW.full_name) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters';
  END IF;
  
  IF LENGTH(NEW.mobile) < 10 THEN
    RAISE EXCEPTION 'Mobile number must be at least 10 digits';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

CREATE TRIGGER validate_booking_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_booking_content();

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  village VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "No public reads on contact messages"
ON public.contact_messages FOR SELECT
USING (false);

CREATE POLICY "No updates on contact messages"
ON public.contact_messages FOR UPDATE
USING (false);

CREATE POLICY "No deletes on contact messages"
ON public.contact_messages FOR DELETE
USING (false);

-- Validate contact message input
CREATE OR REPLACE FUNCTION public.validate_contact_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name = TRIM(NEW.name);
  NEW.village = TRIM(NEW.village);
  NEW.mobile = TRIM(NEW.mobile);
  NEW.message = TRIM(NEW.message);
  
  IF LENGTH(NEW.name) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters';
  END IF;
  
  IF LENGTH(NEW.mobile) < 10 THEN
    RAISE EXCEPTION 'Mobile number must be at least 10 digits';
  END IF;
  
  IF LENGTH(NEW.message) < 5 THEN
    RAISE EXCEPTION 'Message must be at least 5 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

CREATE TRIGGER validate_contact_trigger
BEFORE INSERT ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_contact_content();
