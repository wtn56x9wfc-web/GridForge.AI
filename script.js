// script.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("composer");
  const output = document.getElementById("output");

  const generateBtn = document.getElementById("generateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const downloadTemplateBtn = document.getElementById("downloadTemplateBtn");
  const generateBulkBtn = document.getElementById("generateBulkBtn");
  const bulkStatus = document.getElementById("bulkStatus");

  generateBtn.onclick = () => {
    const business = businessName.value.trim();
    const sender = senderName.value.trim();
    const recipient = recipientName.value.trim();
    const industry = industry.value.trim();
    const goals = goals.value.trim();
    const extra = extra.value.trim();
    const type = messageType.value;

    let opener = "";
    if (industry) {
      opener = `Noticed you're working in ${industry}.`;
    }

    let body = extra || goals || "Thought this might be relevant.";

    let close =
      type === "linkedin"
        ? "Worth a quick chat?"
        : "Open to a short conversation?";

    output.style.display = "block";
    output.textContent = 
`${recipient},

${opener}

${body}

${close}

– ${sender}`;
  };

  clearBtn.onclick = () => {
    form.reset();
    output.style.display = "none";
  };

  downloadTemplateBtn.onclick = () => {
    const csv =
"name,company,title,email,notes,industry,goals,messageType\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gridforge_template.csv";
    a.click();
  };

  generateBulkBtn.onclick = () => {
    bulkStatus.textContent = "Bulk logic ready. API next.";
  };
});
