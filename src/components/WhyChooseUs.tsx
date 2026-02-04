import { Shield, Clock, Award, Heart, Sparkles, ThumbsUp } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Trusted & Reliable",
    description: "Years of experience serving Gujarat with dedication and trust",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest materials and decorations for your special day",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We value your time and ensure everything is perfect on schedule",
  },
  {
    icon: Heart,
    title: "Personalized Touch",
    description: "Every event is unique, and we customize decorations to your vision",
  },
  {
    icon: Sparkles,
    title: "Creative Excellence",
    description: "Fresh ideas and innovative designs that make your event stand out",
  },
  {
    icon: ThumbsUp,
    title: "Affordable Pricing",
    description: "Premium services at competitive prices, no hidden charges",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Your Event, Our{" "}
            <span className="gradient-text-gold">Passion</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We don't just decorate events - we create memories that last a lifetime.
            Here's why families across Gujarat trust Mahakali Event and Decoration.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="group text-center p-8 rounded-2xl hover:bg-card/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-festive flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <reason.icon className="w-8 h-8 text-cream" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
