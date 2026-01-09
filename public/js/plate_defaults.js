// Official IPF / IWF Competition Color Standards
// Red: 25kg / 55lb
// Blue: 20kg / 45lb
// Yellow: 15kg / 35lb
// Green: 10kg / 25lb
// White: 5kg / 10lb
// Black: 2.5kg / 5lb
// Chrome/Silver: 1.25kg / 2.5lb

const BAR_DEFAULTS = {
  kg: [
    { w: 25, label: "Squat bar" },
    { w: 20, label: "Olympic Bar" },
    { w: 15, label: "Women's bar" },
    { w: 10, label: "Light bar" },
  ],
  lb: [
    { w: 55, label: "Squat Bar" },
    { w: 45, label: "Standard Bar" },
    { w: 35, label: "Women's bar" },
    { w: 25, label: "Light bar" },
  ],
};

const PLATE_DEFAULTS = {
  kg: [
    { w: 25, color: "#DC2626", label: "25" }, // Red (Tailwind Red-600)
    { w: 20, color: "#2563EB", label: "20" }, // Blue (Tailwind Blue-600)
    { w: 15, color: "#EAB308", label: "15" }, // Yellow (Tailwind Yellow-500)
    { w: 10, color: "#16A34A", label: "10" }, // Green (Tailwind Green-600)
    { w: 5, color: "#F8FAFC", label: "5" }, // White (Slate-50)
    { w: 2.5, color: "#1E293B", label: "2.5" }, // Black (Slate-800)
    { w: 1.25, color: "#CBD5E1", label: "1.25" }, // Chrome (Slate-300)
  ],
  lb: [
    { w: 55, color: "#DC2626", label: "55" }, // Red
    { w: 45, color: "#2563EB", label: "45" }, // Blue
    { w: 35, color: "#EAB308", label: "35" }, // Yellow
    { w: 25, color: "#16A34A", label: "25" }, // Green
    { w: 10, color: "#F8FAFC", label: "10" }, // White
    { w: 5, color: "#1E293B", label: "5" }, // Black
    { w: 2.5, color: "#CBD5E1", label: "2.5" }, // Chrome
  ],
};
