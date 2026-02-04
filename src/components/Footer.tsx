import { Link } from "react-router-dom";
import { Phone, Instagram, MapPin, Sparkles, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-festive flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cream" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-primary">
                  Mahakali
                </h3>
                <p className="text-xs text-muted-foreground">Event & Decoration</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Creating magical moments and unforgettable celebrations. 
              Your trusted partner for all events and decorations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-primary">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "Home", path: "/" },
                { name: "Our Services", path: "/services" },
                { name: "Gallery", path: "/gallery" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-primary">Services</h4>
            <div className="flex flex-col gap-3">
              {[
                "Wedding Decoration",
                "Birthday Decoration",
                "Anniversary Setup",
                "Smoke Entry",
                "Festival Decoration",
              ].map((service) => (
                <span key={service} className="text-muted-foreground text-sm">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-primary">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-foreground font-medium">6355881337</p>
                  <p className="text-foreground font-medium">6353276266</p>
                </div>
              </div>
              <a
                href="https://instagram.com/mahakali_.event_and_decoration"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary" />
                <span className="text-sm">@mahakali_.event_and_decoration</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-muted-foreground text-sm">
                  Gujarat, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Owners Section */}
      <div className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Owners:</span>
              <span className="text-primary font-medium">Sachin Bothiya</span>
              <span>&</span>
              <span className="text-primary font-medium">Chirag Bothiya</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-secondary fill-secondary" />
              <span>for your special moments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border/30 py-4 bg-background/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Mahakali Event and Decoration. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
