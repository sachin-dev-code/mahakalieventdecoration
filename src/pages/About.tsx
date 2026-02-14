import { Users, Award, Heart, Target, Phone, Instagram, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/30 via-background to-background" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About Us
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Our{" "}
            <span className="gradient-text-gold">Story</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Inspired by the power and grace of Maa Mahakali, we bring the same 
            strength and dedication to making your celebrations extraordinary.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-secondary/30 via-card to-primary/30 border border-border/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-festive mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
                    <span className="font-display text-4xl text-cream font-bold">M</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-primary mb-2">
                    Mahakali Event
                  </h3>
                  <p className="text-muted-foreground">& Decoration</p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Crafting{" "}
                <span className="gradient-text-gold">Magical Moments</span>
                {" "}Since Day One
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Mahakali Event and Decoration was born from a passion for creating 
                beautiful celebrations. Our name, inspired by Maa Mahakali, reflects 
                our commitment to bringing power, grace, and perfection to every event.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded by brothers Sachin Bothiya and Chirag Bothiya, we have 
                established ourselves as Gujarat's trusted event decorators. Our 
                journey started with a simple belief - every celebration deserves 
                to be extraordinary.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From intimate birthday parties to grand wedding celebrations, we 
                bring creativity, dedication, and attention to detail to every 
                project. Our team works tirelessly to transform your vision into reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text-gold">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The principles that guide us in creating exceptional experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Passion",
                description: "We love what we do and it shows in every decoration"
              },
              {
                icon: Award,
                title: "Excellence",
                description: "Committed to delivering the highest quality work"
              },
              {
                icon: Users,
                title: "Customer First",
                description: "Your satisfaction is our ultimate goal"
              },
              {
                icon: Target,
                title: "Precision",
                description: "Every detail matters in creating perfection"
              }
            ].map((value, index) => (
              <div key={value.title} className="text-center p-6 rounded-2xl hover:bg-muted/30 transition-colors">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-festive flex items-center justify-center mb-4">
                  <value.icon className="w-8 h-8 text-cream" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Meet The <span className="gradient-text-gold">Owners</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The visionaries behind Mahakali Event and Decoration
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-12 max-w-3xl mx-auto mb-16">
            {[
              { name: "Sachin Bothiya", role: "Co-Founder", phone: "6355881337" },
              { name: "Chirag Bothiya", role: "Co-Founder", phone: "6353276266" }
            ].map((member) => (
              <div key={member.name} className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-full bg-gradient-festive mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="font-display text-5xl text-cream font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <a 
                  href={`tel:${member.phone}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {member.phone}
                </a>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-center mb-8">
              Get In <span className="gradient-text-gold">Touch</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="tel:6355881337"
                className="card-festive p-6 flex flex-col items-center gap-3 group text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-festive flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-cream" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Call Us</p>
                  <p className="font-semibold">6355881337</p>
                  <p className="font-semibold">6353276266</p>
                </div>
              </a>

              <a
                href="https://instagram.com/mahakali_.event_and_decoration"
                target="_blank"
                rel="noopener noreferrer"
                className="card-festive p-6 flex flex-col items-center gap-3 group text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-festive flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6 text-cream" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instagram</p>
                  <p className="font-semibold text-sm">@mahakali_.event_and_decoration</p>
                </div>
              </a>

              <div className="card-festive p-6 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-festive flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cream" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">Gujarat, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
