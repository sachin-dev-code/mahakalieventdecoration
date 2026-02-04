import { Link } from "react-router-dom";
import { Phone, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-crimson-dark to-maroon" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-saffron/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 border border-cream/20">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-cream font-medium">
              Quick Booking Available
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-6xl font-bold text-cream leading-tight">
            Ready to Create
            <br />
            <span className="text-primary text-shadow-gold">Magic Together?</span>
          </h2>

          {/* Description */}
          <p className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto">
            Don't wait! Book your event now and let us transform your celebration 
            into an unforgettable experience. Limited slots available!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/booking">
              <Button className="btn-gold text-lg px-10 py-6 group">
                Book Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:6355881337">
              <Button 
                variant="outline" 
                className="text-lg px-10 py-6 border-cream/50 text-cream hover:bg-cream/10 hover:border-cream"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call: 6355881337
              </Button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-cream/70 text-sm">
            <span>✓ No Advance Payment</span>
            <span>✓ Free Consultation</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
