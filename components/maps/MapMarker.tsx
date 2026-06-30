const iconByType: Record<string, string> = {
  Waterfall: "💧",
  Restaurant: "🍽️",
  Hotel: "🏨",
  Lodging: "🏨",
  Brewery: "🍺",
  Museum: "🏛️",
  Trail: "🥾",
  Shopping: "🛍️",
  Shop: "🛍️",
  "Scenic Overlook": "🌄",
  Campground: "⛺",
};

export function createMarkerElement(placeType: string) {
  const element = document.createElement("button");
  element.type = "button";
  element.className =
    "flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#f8f2e4] bg-[#1f3b2f] text-lg shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition hover:scale-105";
  element.setAttribute("aria-label", `Map marker for ${placeType}`);
  element.textContent = iconByType[placeType] ?? "📍";
  return element;
}

export function getTypeIcon(placeType: string) {
  return iconByType[placeType] ?? "📍";
}
