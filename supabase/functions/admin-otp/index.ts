import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generateOTP(): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, otp } = await req.json();
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "send") {
      // Verify user exists and is admin
      const { data: userData, error: userError } =
        await supabaseAdmin.auth.admin.listUsers();
      if (userError) throw userError;

      const user = userData.users.find((u) => u.email === email);
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user has admin role
      const { data: roleData } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate and store OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      // Invalidate previous OTPs
      await supabaseAdmin
        .from("admin_otps")
        .update({ used: true })
        .eq("user_id", user.id)
        .eq("used", false);

      await supabaseAdmin.from("admin_otps").insert({
        user_id: user.id,
        otp_code: otpCode,
        expires_at: expiresAt,
      });

      // Send OTP via Resend email
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (!RESEND_API_KEY) {
        console.error("RESEND_API_KEY not configured");
        return new Response(
          JSON.stringify({ error: "Email service not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Mahakali Admin <onboarding@resend.dev>",
          to: [email],
          subject: "Your Admin OTP Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #1a1a2e; border-radius: 12px; color: #fff;">
              <h2 style="text-align: center; color: #d4a853; margin-bottom: 8px;">🔐 Admin Verification</h2>
              <p style="text-align: center; color: #ccc; margin-bottom: 24px;">Use the code below to complete your login:</p>
              <div style="text-align: center; background: #2a2a3e; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #d4a853;">${otpCode}</span>
              </div>
              <p style="text-align: center; color: #999; font-size: 13px;">This code expires in 5 minutes. Do not share it with anyone.</p>
            </div>
          `,
        }),
      });

      if (!emailRes.ok) {
        const errBody = await emailRes.text();
        console.error(`Resend email failed [${emailRes.status}]: ${errBody}`);
        return new Response(
          JSON.stringify({ error: "Failed to send OTP email" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Admin OTP sent to ${email}`);

      return new Response(
        JSON.stringify({ success: true, message: "OTP sent to your email" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      // Get user by email
      const { data: userData } =
        await supabaseAdmin.auth.admin.listUsers();
      const user = userData?.users.find((u) => u.email === email);
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify OTP
      const { data: otpData } = await supabaseAdmin
        .from("admin_otps")
        .select("*")
        .eq("user_id", user.id)
        .eq("otp_code", otp)
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!otpData) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired OTP" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark OTP as used
      await supabaseAdmin
        .from("admin_otps")
        .update({ used: true })
        .eq("id", otpData.id);

      return new Response(
        JSON.stringify({ success: true, verified: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin OTP error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
