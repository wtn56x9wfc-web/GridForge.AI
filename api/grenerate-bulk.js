// api/generate-bulk.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { rows } = req.body || {};

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: "No rows provided" });
    }

    // Generate messages sequentially (safe for small/medium batches).
    const results = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] || {};

      // Accept flexible header names from the CSV
      const businessName = (r.businessName || r.business || "").trim();
      const senderName   = (r.senderName   || r.sender   || "").trim();
      const recipientName= (r.recipientName|| r.name     || "").trim();
      const industry     = (r.industry     || "").trim();
      const goals        = (r.goals        || "").trim();
      const extra        = (r.notes        || r.extra    || "").trim();
      const messageType  = (r.messageType  || "email").toString().trim().toLowerCase();

      const prompt = `
You are a world-class SDR, account executive, and sales copywriter.

Write a concise ${messageType} outreach message based on the details below. The tone must be:
- human, natural, conversational
- confident but not pushy
- professional and polished
- tailored to the industry
- zero fluff, zero corporate jargon

Use short paragraphs.

DETAILS:
Business: ${businessName}
Sender: ${senderName}
Recipient: ${recipientName}
Industry: ${industry}
Goals: ${goals}
Message Type: ${messageType}
Additional Info: ${extra}

Output ONLY the final message.
`.trim();

      try {
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }]
        });

        results.push({
          name: recipientName || "",
          company: r.company || "",
          title: r.title || "",
          email: r.email || "",
          message: completion.choices?.[0]?.message?.content || ""
        });
      } catch (err) {
        // Keep the row in the output with an error message so the CSV aligns
        results.push({
          name: recipientName || "",
          company: r.company || "",
          title: r.title || "",
          email: r.email || "",
          message: `ERROR: ${err?.message || "generation failed"}`
        });
      }
    }

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}

