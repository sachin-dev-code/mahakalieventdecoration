
-- Add event_category constraint
ALTER TABLE reviews ADD CONSTRAINT valid_event_category 
CHECK (event_category IN (
  'Wedding Decoration', 'Birthday Decoration', 'Anniversary Setup',
  'Smoke Entry', 'Festival Decoration', 'Welcome Entry', 
  'Corporate Event', 'Other'
));

-- Add length constraints
ALTER TABLE reviews ADD CONSTRAINT name_length 
CHECK (char_length(name) >= 2 AND char_length(name) <= 100);

ALTER TABLE reviews ADD CONSTRAINT review_length 
CHECK (char_length(review_text) >= 5 AND char_length(review_text) <= 500);

ALTER TABLE reviews ADD CONSTRAINT location_length 
CHECK (char_length(location) >= 2 AND char_length(location) <= 100);

-- Add validation trigger for trimming and content checks
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER validate_review_content_trigger
BEFORE INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION public.validate_review_content();
