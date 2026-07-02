import fs from "fs";
import path from "path";

export type VaultEntry = {
  slug: string;
  placeName: string;
  /** Number of top-level sections that contain at least one line of content. */
  sectionCount: number;
  /** Number of unchecked checklist items ( - [ ] ) across the file. */
  pendingChecks: number;
};

const VAULT_DIR = path.join(process.cwd(), "content", "private");

/** Derive a readable place name from the notes filename slug. */
function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseEntry(slug: string, raw: string): VaultEntry {
  const lines = raw.split("\n");

  // Count top-level sections (## H1 headings) that have at least one non-blank body line.
  let sectionCount = 0;
  let currentSectionHasContent = false;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      if (currentSectionHasContent) sectionCount++;
      currentSectionHasContent = false;
    } else if (line.trim().length > 0) {
      currentSectionHasContent = true;
    }
  }
  // flush last section
  if (currentSectionHasContent) sectionCount++;

  // Count unchecked checklist items.
  const pendingChecks = lines.filter((l) => l.trim().startsWith("- [ ]")).length;

  return {
    slug,
    placeName: slugToName(slug),
    sectionCount,
    pendingChecks,
  };
}

/**
 * Returns vault entries for every *.notes.md file in content/private/.
 * Safe to call only from server components or API routes — never from client code.
 */
export function getVaultEntries(): VaultEntry[] {
  if (!fs.existsSync(VAULT_DIR)) return [];

  return fs
    .readdirSync(VAULT_DIR)
    .filter((file) => file.endsWith(".notes.md"))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.notes\.md$/, "");
      const raw = fs.readFileSync(path.join(VAULT_DIR, file), "utf-8");
      return parseEntry(slug, raw);
    });
}

/**
 * Returns the vault entry for a single slug, or null if no notes file exists.
 * Safe to call only from server components or API routes.
 */
export function getVaultEntry(slug: string): VaultEntry | null {
  const filePath = path.join(VAULT_DIR, `${slug}.notes.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return parseEntry(slug, raw);
}
