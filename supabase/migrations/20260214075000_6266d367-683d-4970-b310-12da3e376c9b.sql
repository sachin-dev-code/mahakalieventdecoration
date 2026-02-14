
-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  event_category VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  rating SMALLINT NOT NULL,
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add validation trigger for rating 1-5
CREATE OR REPLACE FUNCTION public.validate_review_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_review_rating_trigger
BEFORE INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.validate_review_rating();

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Reviews are publicly readable"
ON public.reviews FOR SELECT
USING (true);

-- Anyone can insert reviews
CREATE POLICY "Anyone can submit a review"
ON public.reviews FOR INSERT
WITH CHECK (true);

-- No updates allowed
CREATE POLICY "No updates allowed"
ON public.reviews FOR UPDATE
USING (false);

-- No deletes allowed
CREATE POLICY "No deletes allowed"
ON public.reviews FOR DELETE
USING (false);
