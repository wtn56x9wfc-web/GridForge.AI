const output = document.getElementById("output");

document.getElementById("generateBtn").addEventListener("click", async () => {
  output.classList.remove("hidden");
  output.textContent = "Generating...";

  const payload = {
    businessName: businessName.value.trim(),
    senderName: senderName.value.trim(),
    recipientName: recipientName.value.trim(),
    industry: industry.value.trim(),
    goals: goals.value.trim(),
    extra: extra.value.trim(),      // NEW FIELD HERE
    messageType: messageType.value
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
