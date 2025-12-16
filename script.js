/* ===========================
   GridForge — script.js (FULL)
   - Access gate (code: forgealpha)
   - Excel-only template download (.xlsx)
   - Defensive event wiring (won’t crash if elements aren’t on the page)
   =========================== */

(() => {
  "use strict";

  /* =========
     ACCESS GATE
     ========= */
  const ACCESS_CODE = "forgealpha";
  const ACCESS_STORAGE_KEY = "gridforge_access_ok_v1";

  function isAccessGranted() {
    return localStorage.getItem(ACCESS_STORAGE_KEY) === "true";
  }

  function setAccessGranted() {
    localStorage.setItem(ACCESS_STORAGE_KEY, "true");
  }

  function clearAccessGranted() {
    localStorage.removeItem(ACCESS_STORAGE_KEY);
  }

  function buildGateOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "gf-access-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "999999";
    overlay.style.background = "rgba(0,0,0,0.75)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "16px";

    const card = document.createElement("div");
    card.style.width = "100%";
    card.style.maxWidth = "420px";
    card.style.background = "#0b1220";
    card.style.border = "1px solid rgba(255,255,255,0.08)";
    card.style.borderRadius = "14px";
    card.style.boxShadow = "0 20px 60px rgba(0,0,0,0.55)";
    card.style.padding = "18px";

    const title = document.createElement("div");
    title.textContent = "GridForge Access";
    title.style.fontSize = "18px";
    title.style.fontWeight = "700";
    title.style.color = "rgba(255,255,255,0.95)";
    title.style.marginBottom = "6px";

    const sub = document.createElement("div");
    sub.textContent = "Enter access code to continue.";
    sub.style.fontSize = "13px";
    sub.style.color = "rgba(255,255,255,0.75)";
    sub.style.marginBottom = "12px";

    const input = document.createElement("input");
    input.type = "password";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "Access code";
    input.style.width = "100%";
    input.style.padding = "12px 12px";
    input.style.borderRadius = "10px";
    input.style.border = "1px solid rgba(255,255,255,0.10)";
    input.style.background = "rgba(255,255,255,0.06)";
    input.style.color = "rgba(255,255,255,0.95)";
    input.style.outline = "none";

    const err = document.createElement("div");
    err.textContent = "";
    err.style.marginTop = "10px";
    err.style.fontSize = "12px";
    err.style.color = "rgba(255,90,90,0.95)";
    err.style.minHeight = "16px";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "10px";
    row.style.marginTop = "12px";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Unlock";
    btn.style.flex = "1";
    btn.style.padding = "12px";
    btn.style.borderRadius = "10px";
    btn.style.border = "1px solid rgba(255,255,255,0.12)";
    btn.style.background = "rgba(255,255,255,0.10)";
    btn.style.color = "rgba(255,255,255,0.95)";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "700";

    const reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "Reset";
    reset.style.width = "110px";
    reset.style.padding = "12px";
    reset.style.borderRadius = "10px";
    reset.style.border = "1px solid rgba(255,255,255,0.12)";
    reset.style.background = "transparent";
    reset.style.color = "rgba(255,255,255,0.75)";
    reset.style.cursor = "pointer";
    reset.title = "Clears saved access on this browser";

    row.appendChild(btn);
    row.appendChild(reset);

    card.appendChild(title);
    card.appendChild(sub);
    card.appendChild(input);
    card.appendChild(err);
    card.appendChild(row);

    overlay.appendChild(card);

    function attempt() {
      const val = (input.value || "").trim();
      if (val === ACCESS_CODE) {
        setAccessGranted();
        overlay.remove();
        document.documentElement.style.overflow = "";
        document.body.style.filter = "";
      } else {
        err.textContent = "Wrong code.";
        input.value = "";
        input.focus();
      }
    }

    btn.addEventListener("click", attempt);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") attempt();
    });

    reset.addEventListener("click", () => {
      clearAccessGranted();
      err.textContent = "Saved access cleared. Enter code.";
      input.focus();
    });

    // Slight blur so it’s obvious it’s blocked.
    document.documentElement.style.overflow = "hidden";
    document.body.style.filter = "blur(3px)";
    setTimeout(() => input.focus(), 50);

    return overlay;
  }

  function enforceAccessGate() {
    // Don’t gate local dev previews in file:// if you ever open directly
    // (remove this if you want it gated there too)
    // if (location.protocol === "file:") return;

    if (isAccessGranted()) return;
    document.body.appendChild(buildGateOverlay());
  }

  /* =========================
     XLSX LOADER + TEMPLATE DL
     ========================= */
  const XLSX_CDN = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";

  function loadXLSX() {
    return new Promise((resolve, reject) => {
      if (window.XLSX && typeof window.XLSX.writeFile === "function") return resolve(window.XLSX);

      const existing = document.querySelector(`script[src="${XLSX_CDN}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.XLSX));
        existing.addEventListener("error", () => reject(new Error("Failed to load XLSX library")));
        return;
      }

      const s = document.createElement("script");
      s.src = XLSX_CDN;
      s.async = true;
      s.onload = () => resolve(window.XLSX);
      s.onerror = () => reject(new Error("Failed to load XLSX library"));
      document.head.appendChild(s);
    });
  }

  function downloadExcelTemplate() {
    // Excel-only. No CSV fallback. If XLSX fails to load, we tell you why.
    const headers = [
      "firstName",
      "lastName",
      "company",
      "title",
      "email",
      "website",
      "linkedinUrl",
      "industry",
      "location",
      "notes"
    ];

    // One sample row (keeps it obvious how to fill; delete if you want blank)
    const sampleRow = [
      "Jane",
      "Doe",
      "Acme Co",
      "Owner",
      "jane@acme.com",
      "https://acme.com",
      "https://linkedin.com/in/janedoe",
      "Home Services",
      "Detroit, MI",
      "Add anything helpful here"
    ];

    loadXLSX()
      .then((XLSX) => {
        const data = [headers, sampleRow];
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Make columns reasonably wide (nice UX, no user rage)
        ws["!cols"] = headers.map((h) => {
          const w = Math.max(14, String(h).length + 2);
          return { wch: w };
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leads");

        // Force proper .xlsx download
        XLSX.writeFile(wb, "GridForge_Lead_Template.xlsx", { compression: true });
      })
      .catch((err) => {
        alert(
          "Template download failed (XLSX library couldn’t load). " +
            "If you’re blocking CDNs/adblock, allow jsdelivr.\n\n" +
            "Error: " +
            (err && err.message ? err.message : String(err))
        );
      });
  }

  function wireTemplateDownload() {
    // Supports multiple possible IDs/classes so we don’t break your markup
    const selectors = [
      "#downloadTemplate",
      "#download-template",
      "[data-download-template]",
      ".download-template",
      "button[name='downloadTemplate']",
      "a[name='downloadTemplate']"
    ];

    const el = selectors.map((s) => document.querySelector(s)).find(Boolean);
    if (!el) return;

    el.addEventListener("click", (e) => {
      e.preventDefault();
      downloadExcelTemplate();
    });
  }

  /* ======================
     API HELPERS (defensive)
     ====================== */
  async function postJSON(url, payload) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {})
    });

    let data;
    const txt = await res.text();
    try {
      data = txt ? JSON.parse(txt) : {};
    } catch {
      data = { raw: txt };
    }

    if (!res.ok) {
      const msg = data && (data.error || data.message) ? (data.error || data.message) : "Request failed";
      throw new Error(msg);
    }
    return data;
  }

  function getEl(idOrSelector) {
    return document.querySelector(idOrSelector) || document.getElementById(idOrSelector);
  }

  /* ==========================
     OPTIONAL: wire your buttons
     (won’t do anything if elements
      aren’t present; keeps site stable)
     ========================== */
  function wireIfExists(selector, handler) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.addEventListener("click", handler);
  }

  function init() {
    // Gate FIRST so nothing is “usable” before access
    enforceAccessGate();

    // Excel-only template download
    wireTemplateDownload();

    // If you have a “logout” or “lock” button anywhere, support it:
    wireIfExists("[data-lock-site]", (e) => {
      e.preventDefault();
      clearAccessGranted();
      location.reload();
    });

    /* 
      NOTE:
      I’m NOT touching your other generate/send wiring here because I don’t have your current script.js contents in this chat.
      This script is built to be safe and not nuke your UI.

      If you paste your existing script.js next, I’ll merge this access gate + Excel template into it and give you a true
      “same script + upgrades” version.
    */
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
