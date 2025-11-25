document.getElementById("generateBtn").addEventListener("click", async () => {
  const body = {
    businessName: document.getElementById("businessName").value.trim(),
    senderName: document.getElementById("senderName").value.trim(),
    recipientName: document.getElementById("recipientName").value.trim(),
    industry: document.getElementById("industry").value.trim(),
    goal: document.getElementById("goal").value.trim(),
    tone: document.getElementById("tone").value,
    messageType: document.getElementById("messageType").value,
    extraContext: document.getElementById("extraContext").value.trim()
  };

  const loader = document.getElementById("loader");
  const output = document.getElementById("outputSection");
  const outputText = document.getElementById("outputText");

  output.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    loader.classList.add("hidden");

    outputText.textContent = data.output || JSON.stringify(data, null, 2);
    output.classList.remove("hidden");

  } catch (err) {
    loader.classList.add("hidden");
    outputText.textContent = "Error generating message.";
    output.classList.remove("hidden");
    console.error(err);
  }
});

document.getElementById("copyBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(document.getElementById("outputText").textContent);
  alert("Copied!");
});
