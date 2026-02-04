import { Link } from "react-router-dom";
import { ArrowRight, Flame, Sparkles, Heart, Cake, Crown, PartyPopper, TreePine, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    id: "smoke-entry",
    title: "Smoke Entry",
    description: "Create a grand entrance with dramatic fog effects that leave lasting impressions. Perfect for weddings, anniversaries, and special celebrations.",
    icon: Flame,
    features: ["Low-lying fog effects", "Multiple color options", "Safe & non-toxic", "Indoor & outdoor"],
    price: "Starting ₹2,999",
  },
  {
    id: "paper-fire",
    title: "Paper Fire / Cold Fire",
    description: "Safe and spectacular fire effects for indoor celebrations without any hazards. Creates magical ambiance.",
    icon: Sparkles,
    features: ["100% safe", "No heat emission", "Stunning visuals", "Perfect for photos"],
    price: "Starting ₹1,999",
  },
  {
    id: "welcome-entry",
    title: "Welcome Entry",
    description: "Elegant welcome setups with flowers, lights, and premium decorations for your guests.",
    icon: Star,
    features: ["Flower arrangements", "LED lighting", "Custom themes", "Balloon arches"],
    price: "Starting ₹3,499",
  },
  {
    id: "birthday",
    title: "Birthday Decoration",
    description: "Themed birthday setups with balloons, backdrops, and magical ambiance for all ages.",
    icon: Cake,
    features: ["Theme customization", "Balloon decorations", "Photo backdrops", "Party props"],
    price: "Starting ₹2,499",
  },
  {
    id: "wedding",
    title: "Wedding Decoration",
    description: "Luxurious wedding decor that transforms venues into fairytale settings for your special day.",
    icon: Crown,
    features: ["Mandap decoration", "Stage setup", "Floral arrangements", "Complete venue"],
    price: "Starting ₹15,000",
  },
  {
    id: "anniversary",
    title: "Anniversary Decoration",
    description: "Romantic anniversary setups celebrating your years of togetherness with elegance.",
    icon: Heart,
    features: ["Romantic themes", "Candle setups", "Rose decorations", "Surprise elements"],
    price: "Starting ₹4,999",
  },
  {
    id: "festival",
    title: "Festival Decoration",
    description: "Traditional and modern festival decorations for Diwali, Navratri, Ganesh Chaturthi & more.",
    icon: TreePine,
    features: ["Traditional themes", "Lighting setups", "Rangoli designs", "Cultural elements"],
    price: "Starting ₹3,999",
  },
  {
    id: "all-events",
    title: "All Event Decoration",
    description: "Custom decoration solutions for corporate events, functions, baby showers & gatherings.",
    icon: PartyPopper,
    features: ["Customized designs", "Corporate setups", "Baby shower themes", "All occasions"],
    price: "Custom Quote",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/30 via-background to-background" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Complete Event{" "}
            <span className="gradient-text-gold">Solutions</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we offer comprehensive 
            event decoration services tailored to your unique vision and budget.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="card-festive p-8 group"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-festive flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-cream" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold">{service.price}</span>
                      <Link to={`/booking?service=${service.id}`}>
                        <Button size="sm" className="btn-gold">
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We offer custom decoration solutions for any type of event. 
            Contact us to discuss your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="btn-gold">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:6355881337">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
