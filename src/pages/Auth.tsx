import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    village: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Welcome! 🎉",
      description: `Hello ${formData.fullName}, your info has been saved.`,
    });

    // Store customer info in localStorage for pre-filling forms
    localStorage.setItem("mahakali_user", JSON.stringify(formData));
    
    setIsSubmitting(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-maroon/40 via-background to-background" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-festive flex items-center justify-center mb-4 animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-cream" />
          </div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Mahakali Event
          </h1>
          <p className="text-muted-foreground">& Decoration</p>
        </div>

        {/* Login Form */}
        <div className="card-festive p-8">
          <h2 className="font-display text-2xl font-bold text-center mb-2">
            Get Started
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Enter your details to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                required
                className="bg-muted border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Mobile Number
              </label>
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
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Village (Gaam)
              </label>
              <Input
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder="Enter your village name"
                required
                className="bg-muted border-border"
              />
            </div>

            <Button
              type="submit"
              className="btn-gold w-full text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-xs mt-6">
            By continuing, you agree to our terms and conditions
          </p>
        </div>

        {/* Contact info */}
        <div className="text-center mt-8 text-muted-foreground text-sm">
          <p>Need help? Call us:</p>
          <p className="text-primary font-medium">6355881337 | 6353276266</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
