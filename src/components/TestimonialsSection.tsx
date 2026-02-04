import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    event: "Wedding Decoration",
    rating: 5,
    text: "Mahakali team transformed our wedding venue into a magical paradise! Every detail was perfect. Highly recommend!",
    location: "Ahmedabad",
  },
  {
    id: 2,
    name: "Rajesh Patel",
    event: "Birthday Party",
    rating: 5,
    text: "My daughter's birthday was absolutely stunning! The balloon decorations and theme setup exceeded our expectations.",
    location: "Surat",
  },
  {
    id: 3,
    name: "Meera & Vikram",
    event: "Anniversary Setup",
    rating: 5,
    text: "The smoke entry for our anniversary was breathtaking! Sachin and Chirag are true professionals.",
    location: "Vadodara",
  },
  {
    id: 4,
    name: "Kiran Modi",
    event: "Corporate Event",
    rating: 5,
    text: "Best event decorators in Gujarat! They handled our company function with utmost professionalism.",
    location: "Rajkot",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            What Our{" "}
            <span className="gradient-text-gold">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it - hear from our happy clients who trusted us
            with their most precious celebrations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="glass-card p-8 relative group hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-colors" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/90 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.event} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
