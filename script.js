const generateBtn = document.getElementById("generateBtn");
const loader = document.getElementById("loader");
const outputSection = document.getElementById("outputSection");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");

function show(el) {
  el.classList.remove("hidden");
  el.style.opacity = 0;
  setTimeout(() => (el.style.opacity = 1), 30);
}

function hide(el) {
  el.style.opacity = 0;
  setTimeout(() => el.classList.add("hidden"), 150);
}

generateBtn.addEventListener("click", async () => {
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

  hide(outputSection);
  show(loader);

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    hide(loader);
    outputText.textContent = data.output || "No response.";
    show(outputSection);
  } catch (err) {
    hide(loader);
    outputText.textContent = "Error generating message.";
    show(outputSection);
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputText.textContent);

  copyBtn.textContent = "Copied ✓";
  copyBtn.style.background = "#3d815f";

  setTimeout(() => {
    copyBtn.textContent = "Copy to Clipboard";
    copyBtn.style.background = "#2d3352";
  }, 1200);
});
