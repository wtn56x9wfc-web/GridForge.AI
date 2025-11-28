document.getElementById("generateBtn").addEventListener("click", async () => {

  // Create output box if it doesn't exist
  let output = document.getElementById("output");
  if (!output) {
    output = document.createElement("div");
    output.id = "output";
    output.style.marginTop = "22px";
    output.style.background = "#101010";
    output.style.border = "1px solid #333";
    output.style.padding = "18px";
    output.style.borderRadius = "12px";
    output.style.whiteSpace = "pre-wrap";
    output.style.fontSize = "15px";
    output.style.lineHeight = "1.55";
    document.querySelector(".card").appendChild(output);
  }

  output.style.display = "block";
  output.textContent = "Generating...";

  const payload = {
    businessName: document.getElementById("businessName").value.trim(),
    senderName: document.getElementById("senderName").value.trim(),
    recipientName: document.getElementById("recipientName").value.trim(),
    industry: document.getElementById("industry").value.trim(),
    goals: document.getElementById("goals").value.trim(),
    extra: document.getElementById("extraInfo").value.trim(),   // FIXED
    messageType: document.getElementById("messageType").value
  };

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    output.textContent = data.message || "Error generating message.";
  } catch (err) {
    output.textContent = "Network error.";
  }
});
