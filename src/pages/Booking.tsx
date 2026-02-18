import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, User, Phone, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  { id: "smoke-entry", name: "Smoke Entry" },
  { id: "paper-fire", name: "Paper Fire / Cold Fire" },
  { id: "welcome-entry", name: "Welcome Entry" },
  { id: "birthday", name: "Birthday Decoration" },
  { id: "wedding", name: "Wedding Decoration" },
  { id: "anniversary", name: "Anniversary Decoration" },
  { id: "festival", name: "Festival Decoration" },
  { id: "all-events", name: "All Event Decoration" },
];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    village: "",
    service: searchParams.get("service") || "",
    eventDate: "",
    eventTime: "",
    venue: "",
    additionalDetails: "",
  });

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("bookings").insert({
      full_name: formData.fullName.trim(),
      mobile: formData.mobile.trim(),
      village: formData.village.trim(),
      service: formData.service,
      event_date: formData.eventDate,
      event_time: formData.eventTime || null,
      venue: formData.venue.trim() || null,
      additional_details: formData.additionalDetails.trim() || null,
    });

    if (error) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Booking Submitted! 🎉",
      description: "We'll contact you within 2 hours to confirm your booking.",
    });

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20 px-4 min-h-[80vh] flex items-center">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-gold flex items-center justify-center mb-8 animate-pulse-glow">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Booking <span className="gradient-text-gold">Submitted!</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for choosing Mahakali Event and Decoration. 
              Our team will contact you within 2 hours to confirm your booking details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="btn-gold">
                  Back to Home
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
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/30 via-background to-background" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Book Your Event
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Quick{" "}
            <span className="gradient-text-gold">Booking</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fill in your details below and we'll get back to you within hours 
            to confirm your celebration.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding pt-8">
        <div className="container mx-auto max-w-3xl">
          <div className="card-festive p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                    <Input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="Enter your mobile number"
                      required
                      className="bg-muted border-border"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Village/City *</label>
                    <Input
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder="Enter your village or city name"
                      required
                      className="bg-muted border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Event Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Required *</label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Date *</label>
                    <Input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      required
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Event Time
                    </label>
                    <Input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Venue/Location
                    </label>
                    <Input
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Event venue or location"
                      className="bg-muted border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Additional Details
                </h3>
                <Textarea
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                  placeholder="Tell us more about your event, theme preferences, budget, or any special requirements..."
                  rows={4}
                  className="bg-muted border-border"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="btn-gold w-full text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-muted-foreground text-sm mt-4">
                  We'll contact you within 2 hours to confirm your booking
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
