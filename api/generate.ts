import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { businessName, senderName, recipientName, industry, goals } = req.body;

    const prompt = `
Generate a short outreach message for:

Business: ${businessName}
Sender: ${senderName}
Recipient: ${recipientName}
Industry: ${industry}
Goals: ${goals}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({ message: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
