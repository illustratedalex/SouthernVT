import type { ConciergeAINarrative } from "@/types/Concierge";

type FallbackParts = {
  whyThisTrip: string;
  localTips: string[];
};

function extractJsonObject(text: string): string {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced && fenced[1]) {
    return fenced[1].trim();
  }
  return text.trim();
}

function parseJsonNarrative(text: string): ConciergeAINarrative | null {
  try {
    const parsed = JSON.parse(extractJsonObject(text)) as Partial<ConciergeAINarrative>;
    if (
      typeof parsed.summary !== "string" ||
      typeof parsed.whyThisTrip !== "string" ||
      !Array.isArray(parsed.localTips) ||
      parsed.localTips.some((tip) => typeof tip !== "string")
    ) {
      return null;
    }

    const tips = parsed.localTips.slice(0, 3).map((tip) => tip.trim()).filter(Boolean);
    if (tips.length < 3) {
      return null;
    }

    return {
      summary: parsed.summary.trim(),
      whyThisTrip: parsed.whyThisTrip.trim(),
      localTips: tips,
      fallbackUsed: false,
    };
  } catch {
    return null;
  }
}

function normalizeLine(value: string): string {
  return value.replace(/^[\s\-*•\d.)]+/, "").trim();
}

function parseSectionNarrative(text: string): Omit<ConciergeAINarrative, "fallbackUsed"> | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const summaryLines: string[] = [];
  const whyLines: string[] = [];
  const tipLines: string[] = [];
  let active: "summary" | "why" | "tips" = "summary";

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (lower.includes("why this trip")) {
      active = "why";
      return;
    }
    if (lower.includes("local tips") || lower.includes("tips")) {
      active = "tips";
      return;
    }

    if (active === "summary") {
      summaryLines.push(line);
      return;
    }
    if (active === "why") {
      whyLines.push(line);
      return;
    }
    tipLines.push(normalizeLine(line));
  });

  const summary = summaryLines.join(" ").trim();
  const whyThisTrip = whyLines.join(" ").trim();
  const localTips = tipLines.filter(Boolean).slice(0, 3);

  if (!summary || !whyThisTrip || localTips.length < 3) {
    return null;
  }

  return { summary, whyThisTrip, localTips };
}

export function parseConciergeAIResponse(text: string, fallback: FallbackParts): ConciergeAINarrative {
  const trimmed = text.trim();
  const jsonNarrative = parseJsonNarrative(trimmed);
  if (jsonNarrative) {
    return jsonNarrative;
  }

  const sectionNarrative = parseSectionNarrative(trimmed);
  if (sectionNarrative) {
    return {
      ...sectionNarrative,
      fallbackUsed: false,
    };
  }

  return {
    summary: trimmed,
    whyThisTrip: fallback.whyThisTrip,
    localTips: fallback.localTips,
    fallbackUsed: true,
  };
}

