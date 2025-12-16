// script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("composer");
  const output = document.getElementById("output");

  const generateBtn = document.getElementById("generateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const downloadTemplateBtn = document.getElementById("downloadTemplateBtn");
  const generateBulkBtn = document.getElementById("generateBulkBtn");
  const bulkStatus = document.getElementById("bulkStatus");

  generateBtn.addEventListener("click", () => {
    const data = {
      business: businessName.value,
      sender: senderName.value,
      recipient: recipientName.value,
      industry: industry.value,
      goals: goals.value,
      type: messageType.value,
      extra: extra.value
    };

    output.style.display = "block";
    output.textContent = `Hi ${data.recipient},

Quick note — I’m ${data.sender} from ${data.business}.

${data.extra || data.goals}

Worth a quick chat?

– ${data.sender}`;
  });

  clearBtn.addEventListener("click", () => {
    form.reset();
    output.style.display = "none";
  });

  downloadTemplateBtn.addEventListener("click", () => {
    const csv =
      "name,company,title,email,notes,industry,goals,messageType\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gridforge_template.csv";
    a.click();
  });

  generateBulkBtn.addEventListener("click", () => {
    bulkStatus.textContent = "Bulk generation ready. Backend/API next.";
  });

  const csvFile = document.getElementById("csvFile");
  csvFile.addEventListener("change", () => {
    if (csvFile.files.length > 0) {
      generateBulkBtn.disabled = false;
    }
  });
});
