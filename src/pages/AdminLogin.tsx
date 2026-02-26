import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, KeyRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Step = "credentials" | "otp";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("credentials");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Authenticate with email/password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast({ title: "Invalid credentials", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Step 2: Request OTP via edge function
      const { data, error } = await supabase.functions.invoke("admin-otp", {
        body: { action: "send", email },
      });

      if (error || !data?.success) {
        toast({
          title: "Access denied",
          description: "You don't have admin access.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      toast({
        title: "OTP Sent! 📧",
        description: "Check your email for the 6-digit verification code.",
      });
      setStep("otp");
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("admin-otp", {
        body: { action: "verify", email, otp },
      });

      if (error || !data?.verified) {
        toast({
          title: "Invalid or expired OTP",
          description: "Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store admin verification in session
      sessionStorage.setItem("admin_2fa_verified", "true");

      toast({ title: "Welcome, Admin! 🔐" });
      navigate("/admin/dashboard");
    } catch {
      toast({ title: "Verification failed", variant: "destructive" });
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Failed to send reset email", variant: "destructive" });
    } else {
      toast({ title: "Reset link sent! 📧", description: "Check your email for the password reset link." });
      setForgotMode(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-maroon/40 via-background to-background" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-festive flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-cream" />
          </div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Admin Login
          </h1>
          <p className="text-muted-foreground">
            {forgotMode ? "Reset your password" : "Two-factor authentication required"}
          </p>
        </div>

        <div className="card-festive p-8">
          {forgotMode ? (
            <>
              <h2 className="font-display text-xl font-bold text-center mb-6">
                Forgot Password
              </h2>
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <Button type="submit" className="btn-gold w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to login
                </button>
              </form>
            </>
          ) : step === "credentials" ? (
            <>
              <h2 className="font-display text-xl font-bold text-center mb-6">
                Step 1: Sign In
              </h2>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <Button type="submit" className="btn-gold w-full" disabled={loading}>
                  {loading ? "Authenticating..." : "Continue"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot Password?
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-center mb-2">
                Step 2: Verify OTP
              </h2>
              <p className="text-muted-foreground text-center text-sm mb-6">
                Enter the 6-digit code sent to {email}
              </p>
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary" />
                    OTP Code
                  </label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    required
                    maxLength={6}
                    className="bg-muted border-border text-center text-2xl tracking-[0.5em] font-mono"
                  />
                </div>
                <Button
                  type="submit"
                  className="btn-gold w-full"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                  <Shield className="w-4 h-4 ml-2" />
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
