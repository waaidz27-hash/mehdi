import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const defaultModels = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "qwen/qwen3-coder:free",
  "openai/gpt-oss-120b:free",
];

const parseModels = (raw: string | null) => {
  if (!raw) return defaultModels;
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseApiKeys = (raw: string | null) => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const primaryKey = Deno.env.get("OPENROUTER_API_KEY");
    const extraKeysRaw = Deno.env.get("OPENROUTER_API_KEYS_EXTRA");
    const extraKeys = parseApiKeys(extraKeysRaw);
    const allKeys = [primaryKey, ...extraKeys].filter((k): k is string => Boolean(k));
    const models = parseModels(Deno.env.get("OPENROUTER_MODELS"));

    if (allKeys.length === 0) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY must be configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing messages array in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let lastError: any = null;
    let keyExhaustedErrors = 0;

    outer:
    for (const apiKey of allKeys) {
      for (const model of models) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://localhost",
              "X-Title": "Iqraa Academy",
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.3,
              max_tokens: 512,
            }),
          });

          const responseText = await response.text();
          let data: any = null;
          try {
            data = responseText ? JSON.parse(responseText) : null;
          } catch {
            data = null;
          }

          if (!response.ok) {
            lastError = {
              model,
              status: response.status,
              error: data?.error?.message ?? data?.error ?? responseText,
            };

            if (response.status === 429 || response.status === 402) {
              keyExhaustedErrors++;
              continue outer;
            }
            continue;
          }

          const content = data?.choices?.[0]?.message?.content;
          if (!content) {
            lastError = {
              model,
              status: 502,
              error: "OpenRouter returned invalid JSON or empty response.",
              raw: responseText,
            };
            continue;
          }

          return new Response(
            JSON.stringify({
              choices: [{ message: { role: "assistant", content } }],
              raw: data,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        } catch (error) {
          lastError = {
            model,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }
    }

    const allKeysExhausted = keyExhaustedErrors >= allKeys.length;
    return new Response(
      JSON.stringify({
        error: allKeysExhausted
          ? "تم تجاوز الحد اليومي لجميع مفاتيح API. حاول مرة أخرى لاحقًا."
          : "All OpenRouter models failed.",
        details: lastError,
      }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
