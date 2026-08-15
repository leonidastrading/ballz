export const runtime = "nodejs";

const MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages, context } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "GEMINI_API_KEY is not set on the server. Add it in Vercel -> Project Settings -> Environment Variables, then redeploy.",
      },
      { status: 500 }
    );
  }

  const systemPrompt = `You are a helpful golf ball data assistant embedded in the "Ball Test Explorer" app, right below the ball-picker on the page the user is looking at.

Answer questions using ONLY the data provided below, which reflects exactly what's currently selected/shown on screen (the active tab, condition, and selected balls). Be concise and specific, citing real numbers from the data when relevant. If something the user asks about isn't in the data below, say clearly that you don't have that information rather than guessing or using outside knowledge about golf balls.

Current on-screen data:
${context || "(no balls are currently selected)"}`;

  // Gemini uses "user" / "model" roles (not "assistant"), and takes the system
  // prompt as a separate field rather than a message in the array.
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        // gemini-2.5-flash spends part of maxOutputTokens on internal "thinking" by
        // default, which was eating the whole budget and truncating the visible
        // answer. Disable thinking (this is a quick data-lookup assistant, not a
        // reasoning task) and give plenty of headroom for the real answer.
        generationConfig: {
          maxOutputTokens: 1536,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { error: `Gemini API error (${res.status}): ${errText.slice(0, 500)}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const text = parts.map((p) => p.text || "").join("").trim();
    if (!text) {
      const reason = candidate?.finishReason || "unknown";
      return Response.json(
        { error: `Gemini returned no text (finishReason: ${reason}). Try asking again.` },
        { status: 502 }
      );
    }
    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: `Request failed: ${String(e)}` }, { status: 500 });
  }
}
