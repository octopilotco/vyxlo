import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check subscription & AI generation limit
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const plan = sub?.plan ?? "free";
    const generationsUsed = sub?.ai_generations_used ?? 0;

    if (plan === "free" && generationsUsed >= 10) {
      return new Response(
        JSON.stringify({ error: "limit_reached", message: "You've used all 10 free AI generations this month. Upgrade to PRO for unlimited access." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const { mode, content, tone, topic } = await req.json();
    // mode: "generate" | "rewrite"

    // Load user contexts
    const { data: contexts } = await supabase
      .from("user_contexts")
      .select("label, value")
      .eq("user_id", user.id);

    const contextBlock = contexts && contexts.length > 0
      ? contexts.map((c: { label: string; value: string }) => `${c.label}: ${c.value}`).join("\n")
      : "No specific context provided.";

    // Build prompt
    let systemPrompt = `You are an elite 𝕏 (Twitter) ghostwriter. Your job is to write high-performing tweets and threads.

RULES:
- Write in a conversational, human voice. No corporate jargon.
- Be punchy, clear, and engaging. Every word must earn its place.
- Max 280 characters for single tweets. For threads, number each tweet (1/, 2/, etc.).
- Never start with "I". Hook the reader in the first 5 words.
- Use line breaks strategically for readability.
- Tone must be: ${tone}

USER CONTEXT:
${contextBlock}`;

    let userPrompt = "";
    if (mode === "generate") {
      userPrompt = `Write a single high-performing tweet about: "${topic || "the topic based on my context"}"
      
Return ONLY the tweet text. No explanation, no quotes around it.`;
    } else if (mode === "rewrite") {
      userPrompt = `Rewrite this tweet to be better, more engaging, and match the ${tone} tone:

"${content}"

Return ONLY the rewritten tweet. No explanation, no quotes.`;
    } else {
      throw new Error("Invalid mode. Use 'generate' or 'rewrite'");
    }

    // Call Lovable AI (streaming)
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Increment AI generation counter
    if (sub) {
      await supabase
        .from("subscriptions")
        .update({ ai_generations_used: generationsUsed + 1 })
        .eq("user_id", user.id);
    } else {
      // create subscription row if missing
      await supabase
        .from("subscriptions")
        .insert({ user_id: user.id, plan: "free", ai_generations_used: 1 });
    }

    // Stream back to client
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
