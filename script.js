async function generate() {
  const business = document.getElementById('business').value.trim();
  const goal = document.getElementById('goal').value.trim();

  if (!business || !goal) {
    document.getElementById('output').textContent = 'Fill out both fields.';
    return;
  }

  const prompt = `
You are a world-class copywriter and sales outreach specialist.

Based on the business and goal below, generate:
- 2 high-converting outreach emails
- 1 generic social media DM
- 1 Facebook DM
- 1 SMS (160 characters max)
- 1 20-second cold video script (CVT)

Business: ${business}
Goal: ${goal}

Make everything concise and persuasive.
  `;

  document.getElementById('output').textContent = 'Generating...';

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();
  document.getElementById("output").textContent = data.text;
}
