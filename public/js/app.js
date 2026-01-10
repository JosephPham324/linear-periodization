// --- Shared Logic ---
const mround = (value, factor) => Math.round(value / factor) * factor;

// --- View Switching ---
function switchView(viewName) {
  // Hide all
  ["program", "calculator", "tools", "settings"].forEach((v) => {
    document.getElementById(`view-${v}`).classList.add("hidden");
    const nav = document.getElementById(`nav-${v}`);
    if (nav) nav.classList.remove("active");
  });

  // Show selected
  document.getElementById(`view-${viewName}`).classList.remove("hidden");
  const activeNav = document.getElementById(`nav-${viewName}`);
  if (activeNav) activeNav.classList.add("active");

  // Render updates
  if (viewName === "program") renderProgram();
  if (viewName === "calculator") calculate1RM();
  if (viewName === "tools") updatePlateLoader();
}

// --- Data Refresh from Settings ---
function updateGlobalData() {
  // Reload local variables from global settings if available
  if (typeof appSettings !== "undefined") {
    renderProgram();
    calculate1RM();
    updatePlateLoader();
  }
}

// --- Program View Logic ---
const oneRMInput = document.getElementById("oneRM");
const incrementInput = document.getElementById("increment");
const phase1Body = document.getElementById("phase1-body");
const phase2Body = document.getElementById("phase2-body");
let currentMode = "5rm";

// Helper to get translated notes
function getNotes() {
  const lang = typeof appSettings !== "undefined" ? appSettings.lang : "en";
  return PROGRAM_NOTES[lang] || PROGRAM_NOTES["en"];
}

function generateRows(rows, rm, inc, notesArray) {
  return rows
    .map((row) => {
      const mainWeight = mround(rm * row.top, inc);
      const backWeight = row.back ? mround(rm * row.back, inc) : null;

      let intensityColor = "bg-rose-100 text-rose-700";
      if (row.top < 0.7) intensityColor = "bg-emerald-100 text-emerald-700";
      else if (row.top < 0.85) intensityColor = "bg-amber-100 text-amber-700";

      // Resolve note text dynamically based on index in structure
      const noteText = notesArray[row.noteIndex];
      const backNoteText = row.backNoteIndex !== null ? notesArray[row.backNoteIndex] : null;

      // Localization helper for "Backdown" label
      const t = TRANSLATIONS[appSettings?.lang || "en"];

      return `
        <tr class="hover:bg-slate-50 transition-all group">
            <td class="px-4 py-6 font-black text-slate-800 text-xl text-center border-r border-slate-100">W${row.wk}</td>
            <td class="px-4 py-6 text-center border-r border-slate-100">
                <div class="weight-badge-top group-hover:scale-105 transition-transform font-black text-xl text-slate-900">${mainWeight}</div>
                <div class="mt-2 text-[10px] font-black uppercase tracking-widest ${intensityColor} rounded px-1 inline-block">
                    ${Math.round(row.top * 100)}%
                </div>
            </td>
            <td class="px-4 py-6 text-center border-r border-slate-100">
                ${
                  backWeight
                    ? `
                    <div class="weight-badge-back font-bold text-slate-500">${backWeight}</div>
                    <div class="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">${Math.round(row.back * 100)}%</div>
                `
                    : '<div class="w-8 h-1 bg-slate-100 mx-auto rounded-full"></div>'
                }
            </td>
            <td class="px-4 py-6 text-sm">
                <div class="max-w-full">
                    <p class="text-slate-700 font-semibold leading-relaxed mb-2">${noteText}</p>
                    ${
                      backNoteText
                        ? `
                        <div class="bg-indigo-50 border border-indigo-100 p-2 rounded-lg text-[11px] font-medium text-indigo-700">
                            <span class="font-black uppercase tracking-tighter mr-1 text-[9px]">${t.backdown_label}</span> ${backNoteText}
                        </div>
                    `
                        : ""
                    }
                </div>
            </td>
        </tr>`;
    })
    .join("");
}

function switchTab(mode) {
  currentMode = mode;
  document.getElementById("tab-5rm").className =
    mode === "5rm"
      ? "px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all duration-300 tab-active bg-indigo-600 text-white shadow-lg"
      : "px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ml-2 tab-inactive bg-slate-200 text-slate-500 hover:bg-slate-300";
  document.getElementById("tab-1rm").className =
    mode === "1rm"
      ? "px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ml-2 tab-active bg-indigo-600 text-white shadow-lg"
      : "px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ml-2 tab-inactive bg-slate-200 text-slate-500 hover:bg-slate-300";
  renderProgram();
}

// Program Structure (Note indices refer to the PROGRAM_NOTES array)
const programStructure = {
  "5rm": [
    { wk: 1, top: 0.63, back: null, noteIndex: 0, backNoteIndex: null },
    { wk: 2, top: 0.66, back: null, noteIndex: 0, backNoteIndex: null },
    { wk: 3, top: 0.69, back: null, noteIndex: 0, backNoteIndex: null },
    { wk: 4, top: 0.72, back: null, noteIndex: 0, backNoteIndex: null },
    { wk: 5, top: 0.75, back: null, noteIndex: 1, backNoteIndex: null },
    { wk: 6, top: 0.78, back: null, noteIndex: 1, backNoteIndex: null },
    { wk: 7, top: 0.81, back: null, noteIndex: 1, backNoteIndex: null },
    { wk: 8, top: 0.85, back: null, noteIndex: 2, backNoteIndex: null },
    { wk: 9, top: 0.9, back: null, noteIndex: 2, backNoteIndex: null },
    { wk: 10, top: 1.0, back: null, noteIndex: 2, backNoteIndex: null },
  ],
  "1rm": [
    { wk: 1, top: 0.63, back: null, noteIndex: 0, backNoteIndex: null },
    { wk: 2, top: 0.67, back: null, noteIndex: 0, backNoteIndex: null },
    { wk: 3, top: 0.71, back: null, noteIndex: 0, backNoteIndex: null },
    { wk: 4, top: 0.75, back: null, noteIndex: 0, backNoteIndex: null },
    { wk: 5, top: 0.83, back: 0.73, noteIndex: 1, backNoteIndex: 2 },
    { wk: 6, top: 0.86, back: 0.76, noteIndex: 1, backNoteIndex: 2 },
    { wk: 7, top: 0.89, back: 0.79, noteIndex: 1, backNoteIndex: 3 },
    { wk: 8, top: 0.93, back: 0.82, noteIndex: 5, backNoteIndex: 3 }, // Heavy Single
    { wk: 9, top: 0.95, back: 0.85, noteIndex: 5, backNoteIndex: 3 }, // Heavy Single
    { wk: 10, top: 1.0, back: 0.85, noteIndex: 6, backNoteIndex: 7 }, // Max Effort
  ],
};

function renderProgram() {
  const rm = parseFloat(oneRMInput.value) || 0;
  const inc = parseFloat(incrementInput.value) || 0.5;
  const data = programStructure[currentMode];
  const notes = getNotes()[currentMode === "5rm" ? "5RM" : "1RM"];

  phase1Body.innerHTML = generateRows(data.slice(0, 4), rm, inc, notes);
  phase2Body.innerHTML = generateRows(data.slice(4), rm, inc, notes);
}

// --- 1RM Calc Logic ---
const calcWeight = document.getElementById("calc-weight");
const calcReps = document.getElementById("calc-reps");
const resultDiv = document.getElementById("result-1rm");
const repMaxBody = document.getElementById("rep-max-body");
const percentages = [
  { reps: 1, pct: 1.0 },
  { reps: 2, pct: 0.97 },
  { reps: 3, pct: 0.94 },
  { reps: 4, pct: 0.92 },
  { reps: 5, pct: 0.89 },
  { reps: 6, pct: 0.86 },
  { reps: 8, pct: 0.81 },
  { reps: 10, pct: 0.75 },
  { reps: 12, pct: 0.71 },
];

function calculate1RM() {
  const w = parseFloat(calcWeight.value);
  const r = parseFloat(calcReps.value);
  const inc = parseFloat(incrementInput.value) || 0.5;

  // Use translation for empty state
  const t = TRANSLATIONS[appSettings?.lang || "en"];

  if (!w || !r) {
    resultDiv.innerText = "-";
    repMaxBody.innerHTML = `<tr><td colspan="3" class="text-center p-4 text-slate-400">${t?.msg_enter_weight || "Enter weight..."}</td></tr>`;
    return;
  }

  const max = w * (1 + r / 30);
  const roundedMax = mround(max, inc);
  resultDiv.innerText = roundedMax;

  const html = percentages
    .map((p) => {
      const load = mround(max * p.pct, inc);
      const highlight = p.reps === r ? "bg-indigo-50" : "hover:bg-slate-50";
      const bold = p.reps === 1 ? "font-black text-indigo-900" : "text-slate-700";
      return `
        <tr class="border-b border-slate-100 ${highlight} transition-colors">
            <td class="px-6 py-4 text-sm font-bold text-slate-500">${Math.round(p.pct * 100)}%</td>
            <td class="px-6 py-4 text-sm font-bold ${bold}">${p.reps} Reps</td>
            <td class="px-6 py-4 text-right">
                <span class="bg-slate-900 text-white px-3 py-1 rounded-md font-bold text-sm shadow-sm">${load}</span>
            </td>
        </tr>`;
    })
    .join("");
  repMaxBody.innerHTML = html;
}

// --- GYM TOOLS Logic ---
let plateSystem = "kg";
const plateTarget = document.getElementById("plate-target");
const barWeightSelect = document.getElementById("bar-weight");
const plateVisuals = document.getElementById("plate-visuals");
const weightPerSideDisplay = document.getElementById("weight-per-side");
const plateTextList = document.getElementById("plate-text-list");
const warmupBody = document.getElementById("warmup-body");

function setPlateSystem(sys) {
  plateSystem = sys;
  document.getElementById("btn-kg").className =
    sys === "kg"
      ? "px-3 py-1 bg-indigo-500 rounded text-xs font-bold text-white transition-all shadow-md"
      : "px-3 py-1 bg-slate-200 rounded text-xs font-bold text-slate-400 hover:bg-slate-300";
  document.getElementById("btn-lb").className =
    sys === "lb"
      ? "px-3 py-1 bg-indigo-500 rounded text-xs font-bold text-white transition-all shadow-md"
      : "px-3 py-1 bg-slate-200 rounded text-xs font-bold text-slate-400 hover:bg-slate-300";

  // Update Bar Options from Settings if available, else defaults
  const barOpts = appSettings?.bars || [20, 25, 45, 55];
  barWeightSelect.innerHTML = barOpts.map((w) => `<option value="${w}">${w} ${sys}</option>`).join("");

  updatePlateLoader();
}

function calculatePlatesNeeded(weight, bar) {
  let remainder = (weight - bar) / 2;
  if (remainder <= 0) return { plates: [], remainder: 0 };

  // Use a copy of the plates array to avoid sorting the actual settings in place repeatedly
  const inventory = [...(plateSystem === "kg" ? appSettings.platesKG : appSettings.platesLB)].sort((a, b) => b.w - a.w);

  let result = [];

  inventory.forEach((p) => {
    // Check available pairs (default to 999 if undefined for legacy compatibility)
    let availablePairs = p.count !== undefined ? p.count : 999;

    while (remainder >= p.w && p.w > 0 && availablePairs > 0) {
      result.push(p);
      remainder -= p.w;
      availablePairs--;
    }
  });

  // Floating point fix for remainder
  remainder = Math.round(remainder * 100) / 100;

  return { plates: result, remainder: remainder };
}

// Helper for dynamic plate height based on weight/unit
function getPlateHeight(w, unit) {
  const inventory = unit === "kg" ? appSettings.platesKG : appSettings.platesLB;
  // Get max weight to normalize size
  const maxW = inventory.length > 0 ? Math.max(...inventory.map((p) => p.w)) : w;

  // Settings for visual scaling
  const minH = 20;
  const maxH = 100;

  if (maxW === 0) return minH;

  // Use square root for more realistic scaling (Mass ~ Area ~ Radius^2)
  const ratio = Math.sqrt(w / maxW);
  return minH + (maxH - minH) * ratio;
}

function updatePlateLoader() {
  const target = parseFloat(plateTarget.value);
  const bar = parseFloat(barWeightSelect.value);
  const t = TRANSLATIONS[appSettings?.lang || "en"];

  if (!target || target < bar) {
    plateVisuals.innerHTML = `<div class="bar-end"></div><div class="z-10 text-slate-400 text-sm font-bold ml-4">${t.msg_enter_weight}</div>`;
    weightPerSideDisplay.innerText = "0";
    plateTextList.innerHTML = "";
    warmupBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-400 text-sm">${t.msg_enter_target}</td></tr>`;
    return;
  }

  // 1. Calculate Plates
  const { plates, remainder } = calculatePlatesNeeded(target, bar);

  // 2. Render Visuals
  weightPerSideDisplay.innerText = ((target - bar) / 2).toFixed(2);
  let html = '<div class="bar-end"></div>';
  plates.forEach((p) => {
    const height = getPlateHeight(p.w, plateSystem);
    // Render plate using dynamic color and height
    html += `<div class="plate" style="background-color: ${p.color}; height: ${height}px; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">${p.label}</div>`;
  });
  if (remainder > 0) {
    html += `<div class="text-xs font-bold text-red-400 ml-2">+${remainder}</div>`;
  }
  plateVisuals.innerHTML = html;

  // 3. Render Text List
  const counts = {};
  plates.forEach((p) => {
    counts[p.label] = (counts[p.label] || 0) + 1;
  });
  let textHtml = "";
  for (const [label, count] of Object.entries(counts)) {
    textHtml += `<span class="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-700">${count}x ${label}</span>`;
  }
  plateTextList.innerHTML = textHtml;

  // 4. Generate Warm-ups
  generateWarmups(target, bar);
}

function generateWarmups(target, bar) {
  const inc = parseFloat(incrementInput.value) || 2.5;
  const t = TRANSLATIONS[appSettings?.lang || "en"];

  let sets = [
    { pct: 0, load: bar, reps: 10, label: t.warmup_bar },
    {
      pct: 0.4,
      load: mround(target * 0.4, inc),
      reps: 5,
      label: t.warmup_warm,
    },
    {
      pct: 0.6,
      load: mround(target * 0.6, inc),
      reps: 3,
      label: t.warmup_warm,
    },
    {
      pct: 0.8,
      load: mround(target * 0.8, inc),
      reps: 2,
      label: t.warmup_warm,
    },
    {
      pct: 0.9,
      load: mround(target * 0.9, inc),
      reps: 1,
      label: t.warmup_pot,
    },
    { pct: 1.0, load: target, reps: "Work", label: t.warmup_work },
  ];

  let uniqueSets = [];
  let lastLoad = 0;
  sets.forEach((s) => {
    if (s.load >= bar && s.load > lastLoad) {
      uniqueSets.push(s);
      lastLoad = s.load;
    }
  });

  if (uniqueSets.length < 2) {
    uniqueSets = [
      { pct: 0, load: bar, reps: 10, label: t.warmup_bar },
      { pct: 1.0, load: target, reps: "Work", label: t.warmup_work },
    ];
  }

  let html = uniqueSets
    .map((s) => {
      const sideWeight = (s.load - bar) / 2;
      return `
            <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50">
            <td class="px-4 py-3 text-xs font-bold text-slate-500">${s.label}</td>
            <td class="px-4 py-3 text-sm font-black text-slate-800">${s.load}</td>
            <td class="px-4 py-3 text-xs font-bold text-indigo-600">${s.reps}</td>
            <td class="px-4 py-3 text-xs font-mono text-slate-400 text-right">${sideWeight > 0 ? sideWeight.toFixed(1) : "-"}</td>
            </tr>
            `;
    })
    .join("");

  warmupBody.innerHTML = html;
}

// --- Init ---
[oneRMInput, incrementInput].forEach((el) => el.addEventListener("input", renderProgram));
[calcWeight, calcReps].forEach((el) => el.addEventListener("input", calculate1RM));
[plateTarget, barWeightSelect].forEach((el) => el.addEventListener("input", updatePlateLoader));

// Initial Render handled by settings.js on DOMContentLoaded which calls applyTranslations which calls these
