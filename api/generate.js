const fetch = require("node-fetch");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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
Generate a ${tone} ${messageType} outreach message.

Business Name: ${businessName}
Sender: ${senderName}
Recipient: ${recipientName}
Industry: ${industry}
Goal: ${goal}
Extra Context: ${extraContext}

Write a clean, natural outreach message they would realistically send.
`;

    const apiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: prompt
      })
    });

    const json = await apiRes.json();

    const output =
      json.output_text ||
      json.output?.[0]?.content ||
      JSON.stringify(json, null, 2);

    return res.status(200).json({ output });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
