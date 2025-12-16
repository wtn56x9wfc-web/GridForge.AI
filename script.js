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
    const business = document.getElementById("businessName").value;
    const sender = document.getElementById("senderName").value;
    const recipient = document.getElementById("recipientName").value;
    const goals = document.getElementById("goals").value;
    const extra = document.getElementById("extra").value;

    output.style.display = "block";
    output.textContent =
`Hi ${recipient},

Quick note — I’m ${sender} from ${business}.

${extra || goals}

Worth a quick chat?

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
    bulkStatus.textContent = "Bulk generation wired. Backend next.";
  };
});
