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

    // Build the prompt string
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

    // *** THIS IS THE CORRECT ENDPOINT + CORRECT BODY ***
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const json = await apiRes.json();

    // Extract output for Chat Completions
    const output =
      json.choices?.[0]?.message?.content ||
      JSON.stringify(json, null, 2);

    return res.status(200).json({ output });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
