import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    businessName,
    senderName,
    recipientName,
    industry,
    goal,
    tone,
    messageType,
    extraContext
  } = req.body;

  const prompt = `
You are an elite outreach copywriter. Create a message that is:
- extremely friendly
- professional
- concise
- not salesy
- tailored to the user's business and goal
- written clearly in ${tone} tone
- optimized for ${industry}
- personalized for ${recipientName || "the recipient"}

Business: ${businessName}
Sender Name: ${senderName}
Recipient Name: ${recipientName || "Not Provided"}
Industry: ${industry}
Goal: ${goal}
Message Type: ${messageType}
Extra Context: ${extraContext || "None"}

Return ONLY clean JSON in this format:
{
  "output": "final outreach message here"
}
  `;

  try {
    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      response_format: { type: "json_object" }
    });

    const final = completion.output[0].content[0].text;
    return res.status(200).json(JSON.parse(final));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Generation failed" });
  }
}
