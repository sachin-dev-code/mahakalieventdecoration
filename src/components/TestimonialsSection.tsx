import { useState, useEffect } from "react";
import { Star, Quote, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  name: string;
  event_category: string;
  location: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const EVENT_CATEGORIES = [
  "Wedding Decoration",
  "Birthday Decoration",
  "Anniversary Setup",
  "Smoke Entry",
  "Festival Decoration",
  "Welcome Entry",
  "Corporate Event",
  "Other",
];

const StarRating = ({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 transition-colors ${
            star <= (interactive ? hover || rating : rating)
              ? "text-primary fill-primary"
              : "text-muted-foreground/30"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  );
};

const TestimonialsSection = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    event_category: "",
    location: "",
    rating: 0,
    review_text: "",
  });

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (!error && data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      toast({ title: "Please select a star rating", variant: "destructive" });
      return;
    }
    if (form.name.trim().length < 2 || form.name.length > 100) {
      toast({ title: "Name must be 2-100 characters", variant: "destructive" });
      return;
    }
    if (form.review_text.trim().length < 5 || form.review_text.length > 500) {
      toast({ title: "Review must be 5-500 characters", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      name: form.name.trim(),
      event_category: form.event_category,
      location: form.location.trim(),
      rating: form.rating,
      review_text: form.review_text.trim(),
    });

    if (error) {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } else {
      toast({ title: "Thank you for your review! 🎉" });
      setForm({ name: "", event_category: "", location: "", rating: 0, review_text: "" });
      setShowForm(false);
      fetchReviews();
    }
    setIsSubmitting(false);
  };

  return (
    <section className="section-padding bg-card relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Reviews
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            What Our{" "}
            <span className="gradient-text-gold">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Real feedback from our happy customers. Share your experience too!
          </p>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="btn-gold"
          >
            {showForm ? "Close Form" : "Write a Review"}
          </Button>
        </div>

        {/* Feedback Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="card-festive p-8">
              <h3 className="font-display text-xl font-bold mb-6">Share Your Experience</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                      maxLength={100}
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Your city/village"
                      required
                      maxLength={100}
                      className="bg-muted border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Category</label>
                  <select
                    value={form.event_category}
                    onChange={(e) => setForm({ ...form, event_category: e.target.value })}
                    required
                    className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  >
                    <option value="">Select category</option>
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <StarRating rating={form.rating} onRate={(r) => setForm({ ...form, rating: r })} interactive />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <Textarea
                    value={form.review_text}
                    onChange={(e) => setForm({ ...form, review_text: e.target.value })}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    required
                    maxLength={500}
                    className="bg-muted border-border"
                  />
                </div>

                <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="glass-card p-8 relative group hover:border-primary/30 transition-all duration-300"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-colors" />

                <StarRating rating={review.rating} />

                <p className="text-foreground/90 leading-relaxed my-4">
                  "{review.review_text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.event_category} • {review.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
