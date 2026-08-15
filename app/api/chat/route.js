export const runtime = "nodejs";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "OPENAI_API_KEY is not set on the server. Add it in Vercel -> Project Settings -> Environment Variables, then redeploy.",
      },
      { status: 500 }
    );
  }

  const systemPrompt = `You are a helpful golf ball data assistant embedded in the "Ball Test Explorer" app, right below the ball-picker on the page the user is looking at.

Answer questions using ONLY the data provided below, which reflects exactly what's currently selected/shown on screen (the active tab, condition, and selected balls). Be concise and specific, citing real numbers from the data when relevant. If something the user asks about isn't in the data below, say clearly that you don't have that information rather than guessing or using outside knowledge about golf balls.

Current on-screen data:
${context || "(no balls are currently selected)"}`;

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { error: `OpenAI API error (${res.status}): ${errText.slice(0, 500)}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return Response.json({ text: text || "(no response)" });
  } catch (e) {
    return Response.json({ error: `Request failed: ${String(e)}` }, { status: 500 });
  }
}
