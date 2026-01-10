// Default Data
// Depends on PLATE_DEFAULTS from plate_defaults.js
const DEFAULTS = {
  lang: "en",
  platesKG: typeof PLATE_DEFAULTS !== "undefined" ? JSON.parse(JSON.stringify(PLATE_DEFAULTS.kg)) : [],
  platesLB: typeof PLATE_DEFAULTS !== "undefined" ? JSON.parse(JSON.stringify(PLATE_DEFAULTS.lb)) : [],
  bars: [20, 25, 45, 55],
};

// State
let appSettings = JSON.parse(localStorage.getItem("bom_settings")) || DEFAULTS;

// Elements
const langSelect = document.getElementById("lang-select");
const containerKG = document.getElementById("container-kg");
const containerLB = document.getElementById("container-lb");

// Init
function initSettings() {
  if (langSelect) langSelect.value = appSettings.lang;
  if (containerKG) renderPlateInputs(appSettings.platesKG, containerKG);
  if (containerLB) renderPlateInputs(appSettings.platesLB, containerLB);
  applyTranslations();
}

function renderPlateInputs(plates, container) {
  container.innerHTML = "";
  plates.forEach((p, index) => {
    const row = document.createElement("div");
    row.className = "flex gap-2 mb-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100";
    // Default to 10 pairs if undefined for legacy data compatibility
    const countVal = p.count !== undefined ? p.count : 10;

    row.innerHTML = `
            <input type="number" class="input-field w-20 py-1 text-sm text-center" value="${p.w}" placeholder="Weight" onchange="updatePlateData('${container.id}', ${index}, 'w', this.value)">
            
            <div class="flex flex-col items-center mx-1">
                 <input type="color" class="h-8 w-8 cursor-pointer border-0 p-0 bg-transparent rounded shadow-sm" value="${p.color}" onchange="updatePlateData('${container.id}', ${index}, 'color', this.value)">
            </div>
            
            <input type="text" class="input-field flex-1 py-1 text-sm" value="${p.label}" placeholder="Label" onchange="updatePlateData('${container.id}', ${index}, 'label', this.value)">
            
            <div class="flex flex-col items-center w-16">
                <label class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter leading-none mb-1">Pairs</label>
                <input type="number" class="input-field w-full py-1 text-sm text-center" value="${countVal}" placeholder="#" onchange="updatePlateData('${container.id}', ${index}, 'count', this.value)">
            </div>

            <button onclick="removePlate('${container.id}', ${index})" class="text-rose-500 hover:bg-rose-100 p-2 rounded transition-colors ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;
    container.appendChild(row);
  });
}

function updatePlateData(containerId, index, field, value) {
  const arr = containerId === "container-kg" ? appSettings.platesKG : appSettings.platesLB;

  if (field === "w" || field === "count") {
    arr[index][field] = parseFloat(value);
  } else {
    arr[index][field] = value;
  }
}

function addPlate(type) {
  const arr = type === "kg" ? appSettings.platesKG : appSettings.platesLB;
  // Default new plates to 8 pairs
  arr.push({ w: 0, color: "#000000", label: "0", count: 8 });
  renderPlateInputs(type === "kg" ? appSettings.platesKG : appSettings.platesLB, type === "kg" ? containerKG : containerLB);
}

function removePlate(containerId, index) {
  const arr = containerId === "container-kg" ? appSettings.platesKG : appSettings.platesLB;
  arr.splice(index, 1);
  renderPlateInputs(arr, containerId === "container-kg" ? containerKG : containerLB);
}

// Notification System
function showNotification(msg, type = "success") {
  const toast = document.getElementById("notification-toast");
  const msgEl = document.getElementById("notification-message");
  const iconEl = document.getElementById("notification-icon");

  if (!toast) return;

  // Set content
  msgEl.innerText = msg;

  // Icon based on type
  if (type === "success") {
    iconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else {
    iconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }

  // Show
  toast.classList.remove("translate-y-24", "opacity-0", "translate-y-32"); // Handle both mobile/desktop classes

  // Hide after 3s
  setTimeout(() => {
    // Re-add classes based on screen size (simple approach: just add the hiding classes)
    toast.classList.add("translate-y-24", "opacity-0");
    // Note: Tailwind md: classes handle the positioning difference,
    // we just need to ensure the transform moves it off screen.
  }, 3000);
}

function saveSettings() {
  appSettings.lang = langSelect.value;
  // Save to LS
  localStorage.setItem("bom_settings", JSON.stringify(appSettings));

  // Trigger Updates
  applyTranslations();
  if (typeof updateGlobalData === "function") updateGlobalData();

  // Trigger Toast instead of alert
  showNotification(TRANSLATIONS[appSettings.lang].alert_saved, "success");
}

function resetSettings() {
  if (confirm("Reset all settings?")) {
    // Deep copy from PLATE_DEFAULTS again
    appSettings = {
      lang: "en",
      platesKG: JSON.parse(JSON.stringify(PLATE_DEFAULTS.kg)),
      platesLB: JSON.parse(JSON.stringify(PLATE_DEFAULTS.lb)),
      bars: [20, 25, 45, 55],
    };
    initSettings();
    saveSettings();
  }
}

// Translation Engine
function applyTranslations() {
  const t = TRANSLATIONS[appSettings.lang];
  if (!t) return;

  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (t[key]) {
      if (el.tagName === "INPUT" && el.type === "placeholder") {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });

  // Update Program Render
  if (typeof renderProgram === "function") renderProgram();
  // Update Tools
  if (typeof updatePlateLoader === "function") updatePlateLoader();
}

// Run on load
document.addEventListener("DOMContentLoaded", initSettings);
