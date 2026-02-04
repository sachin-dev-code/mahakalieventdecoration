import { Link } from "react-router-dom";
import { ArrowRight, Flame, Sparkles, Heart, Cake, Crown, PartyPopper, TreePine, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "smoke-entry",
    title: "Smoke Entry",
    description: "Create a grand entrance with dramatic fog effects that leave lasting impressions",
    icon: Flame,
    popular: true,
  },
  {
    id: "paper-fire",
    title: "Paper Fire / Cold Fire",
    description: "Safe and spectacular fire effects for indoor celebrations without any hazards",
    icon: Sparkles,
    popular: true,
  },
  {
    id: "welcome-entry",
    title: "Welcome Entry",
    description: "Elegant welcome setups with flowers, lights, and premium decorations",
    icon: Star,
    popular: false,
  },
  {
    id: "birthday",
    title: "Birthday Decoration",
    description: "Themed birthday setups with balloons, backdrops, and magical ambiance",
    icon: Cake,
    popular: true,
  },
  {
    id: "wedding",
    title: "Wedding Decoration",
    description: "Luxurious wedding decor that transforms venues into fairytale settings",
    icon: Crown,
    popular: true,
  },
  {
    id: "anniversary",
    title: "Anniversary Decoration",
    description: "Romantic anniversary setups celebrating your years of togetherness",
    icon: Heart,
    popular: false,
  },
  {
    id: "festival",
    title: "Festival Decoration",
    description: "Traditional and modern festival decorations for Diwali, Navratri & more",
    icon: TreePine,
    popular: false,
  },
  {
    id: "all-events",
    title: "All Event Decoration",
    description: "Custom decoration solutions for corporate events, functions & gatherings",
    icon: PartyPopper,
    popular: false,
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Transform Your{" "}
            <span className="gradient-text-gold">Special Moments</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From intimate gatherings to grand celebrations, we offer comprehensive 
            event decoration services tailored to your unique vision.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="card-festive p-6 group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {service.popular && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Popular
                </span>
              )}
              <div className="w-14 h-14 rounded-xl bg-gradient-festive flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="w-7 h-7 text-cream" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
              <Link
                to={`/booking?service=${service.id}`}
                className="inline-flex items-center text-primary text-sm font-medium hover:gap-2 transition-all"
              >
                Book Now
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
