import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_FAILED_ATTEMPTS = 5;
const GENERIC_INVALID = "Invalid or expired OTP";

function generateOTP(): string {
  // Cryptographically secure 6-digit OTP
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const n = buf[0] % 1_000_000;
  return n.toString().padStart(6, "0");
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
      const { data: userData, error: userError } =
        await supabaseAdmin.auth.admin.listUsers();
      if (userError) throw userError;

      const user = userData.users.find((u) => u.email === email);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: roleData } = await supabaseAdmin
        .from("user_roles").select("role")
        .eq("user_id", user.id).eq("role", "admin").maybeSingle();

      if (!roleData) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      await supabaseAdmin.from("admin_otps").update({ used: true })
        .eq("user_id", user.id).eq("used", false);

      await supabaseAdmin.from("admin_otps").insert({
        user_id: user.id, otp_code: otpCode, expires_at: expiresAt,
      });

      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (!RESEND_API_KEY) {
        return new Response(JSON.stringify({ error: "Email service not configured" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Mahakali Admin <onboarding@resend.dev>",
          to: [email],
          subject: "Your Admin OTP Code",
          html: `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #1a1a2e; border-radius: 12px; color: #fff;">
              <h2 style="text-align: center; color: #d4a853;">🔐 Admin Verification</h2>
              <div style="text-align: center; background: #2a2a3e; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #d4a853;">${otpCode}</span>
              </div>
              <p style="text-align: center; color: #999; font-size: 13px;">Expires in 5 minutes. Do not share.</p>
            </div>`,
        }),
      });

      if (!emailRes.ok) {
        console.error(`Resend email failed [${emailRes.status}]: ${await emailRes.text()}`);
        return new Response(JSON.stringify({ error: "Failed to send OTP email" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, message: "OTP sent to your email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verify") {
      const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
      const user = userData?.users.find((u) => u.email === email);
      if (!user) {
        return new Response(JSON.stringify({ error: GENERIC_INVALID }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get latest non-used, non-locked OTP for this user
      const { data: latestOtp } = await supabaseAdmin
        .from("admin_otps").select("*")
        .eq("user_id", user.id).eq("used", false).eq("locked", false)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false }).limit(1).maybeSingle();

      if (!latestOtp) {
        return new Response(JSON.stringify({ error: GENERIC_INVALID }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (latestOtp.otp_code !== otp) {
        const newAttempts = (latestOtp.failed_attempts ?? 0) + 1;
        const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;
        await supabaseAdmin.from("admin_otps")
          .update({ failed_attempts: newAttempts, locked: shouldLock })
          .eq("id", latestOtp.id);
        return new Response(JSON.stringify({ error: GENERIC_INVALID }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Success
      await supabaseAdmin.from("admin_otps").update({ used: true }).eq("id", latestOtp.id);

      // Clean up old sessions for this user, then create new
      await supabaseAdmin.from("admin_sessions").delete().eq("user_id", user.id);
      const { data: sessionRow } = await supabaseAdmin
        .from("admin_sessions")
        .insert({ user_id: user.id })
        .select("id")
        .maybeSingle();

      return new Response(
        JSON.stringify({ success: true, verified: true, session_id: sessionRow?.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "check_session") {
      // Verify caller via JWT and check active admin session
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ verified: false }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: claims } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
      if (!claims?.claims?.sub) {
        return new Response(JSON.stringify({ verified: false }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const userId = claims.claims.sub as string;

      const { data: session } = await supabaseAdmin
        .from("admin_sessions").select("id")
        .eq("user_id", userId)
        .gte("expires_at", new Date().toISOString())
        .maybeSingle();

      return new Response(JSON.stringify({ verified: !!session }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "logout") {
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const userClient = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: claims } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
        if (claims?.claims?.sub) {
          await supabaseAdmin.from("admin_sessions").delete().eq("user_id", claims.claims.sub);
        }
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin OTP error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
