import { useState } from "react";
import { Phone, Instagram, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    village: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", mobile: "", village: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/30 via-background to-background" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Contact{" "}
            <span className="gradient-text-gold">Us</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our services? Ready to book your event? 
            We're here to help make your celebration perfect.
          </p>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="card-festive p-8">
              <h2 className="font-display text-2xl font-bold mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
                  <Input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Enter your mobile number"
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Village/City</label>
                  <Input
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="Enter your village or city"
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your event..."
                    rows={4}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">
                  Contact Information
                </h2>
                <p className="text-muted-foreground mb-8">
                  Reach out to us directly through phone or social media. 
                  We're always happy to discuss your event requirements.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <a
                  href="tel:6355881337"
                  className="card-festive p-6 flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-festive flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-cream" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Call Sachin</p>
                    <p className="font-semibold text-lg">6355881337</p>
                  </div>
                </a>

                <a
                  href="tel:6353276266"
                  className="card-festive p-6 flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-festive flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-cream" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Call Chirag</p>
                    <p className="font-semibold text-lg">6353276266</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/mahakali_.event_and_decoration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-festive p-6 flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-festive flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6 text-cream" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                    <p className="font-semibold">@mahakali_.event_and_decoration</p>
                  </div>
                </a>

                <div className="card-festive p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-festive flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-cream" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">Gujarat, India</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="glass-card p-6 border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-lg font-semibold">Quick Response</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  For immediate assistance, call us directly. We typically respond 
                  to all inquiries within 2-4 hours during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
