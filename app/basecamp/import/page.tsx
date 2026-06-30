"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ImportMapping } from "@/components/basecamp/ImportMapping";
import { ImportPreviewTable } from "@/components/basecamp/ImportPreviewTable";
import { ImportResults } from "@/components/basecamp/ImportResults";
import { ImportUploader } from "@/components/basecamp/ImportUploader";
import { parseCsv } from "@/lib/import/parseCsv";
import {
  REQUIRED_PLACE_IMPORT_FIELDS,
  normalizePlaceStatus,
  normalizePlaceType,
  slugFromName,
  validatePlaceImport,
  type PlaceImportField,
} from "@/lib/import/validatePlaceImport";
import { createPlace, getPlaces, type PlaceInput } from "@/repositories/PlaceRepository";

type ImportMappingValue = Record<PlaceImportField, string>;

type ImportSummary = {
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  duplicateWarnings: string[];
};

const stepLabels = ["Upload", "Map fields", "Preview", "Import Results"];

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import", active: true },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Reviews", href: "/basecamp/reviews" },
  { label: "Analytics", href: "/basecamp/analytics" },
  { label: "Passport", href: "/basecamp/passport" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
];

function createEmptyMapping(): ImportMappingValue {
  return {
    name: "",
    placeType: "",
    description: "",
    city: "",
    state: "",
    status: "",
  };
}

function suggestedMapping(headers: string[]): ImportMappingValue {
  const byNormalized = new Map(headers.map((header) => [header.trim().toLowerCase(), header]));

  const aliases: Record<PlaceImportField, string[]> = {
    name: ["name", "place_name", "title"],
    placeType: ["placetype", "place_type", "type", "category"],
    description: ["description", "summary", "details"],
    city: ["city", "town"],
    state: ["state", "province"],
    status: ["status", "publish_status"],
  };

  const mapping = createEmptyMapping();

  for (const field of REQUIRED_PLACE_IMPORT_FIELDS) {
    const match = aliases[field].find((alias) => byNormalized.has(alias));
    mapping[field] = match ? byNormalized.get(match) ?? "" : "";
  }

  return mapping;
}

function parseJson(text: string): Array<Record<string, string>> {
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error("JSON file must contain an array of objects");
  }

  return parsed.map((item) => {
    if (!item || typeof item !== "object") {
      return {};
    }

    const row: Record<string, string> = {};
    for (const [key, value] of Object.entries(item)) {
      row[key] = value == null ? "" : String(value).trim();
    }
    return row;
  });
}

function toPlaceInput(row: ReturnType<typeof validatePlaceImport>[number]): PlaceInput {
  const placeType = normalizePlaceType(row.values.placeType) ?? "Trail";
  const status = normalizePlaceStatus(row.values.status) ?? "draft";

  return {
    slug: row.slug || slugFromName(row.values.name),
    name: row.values.name,
    description: row.values.description,
    placeType,
    categories: [placeType],
    tags: ["bulk-import", "basecamp", row.values.city.toLowerCase().replace(/\s+/g, "-") || "southern-vt"],
    address: "",
    city: row.values.city,
    state: row.values.state,
    zip: "",
    latitude: 43,
    longitude: -72.5,
    phone: "",
    email: "",
    website: "",
    hours: "",
    featuredImage: "https://placehold.co/1200x800?text=Imported+Place",
    gallery: [],
    amenities: [],
    featured: false,
    status,
    metadata: {},
    relatedPlaces: [],
    seoTitle: row.values.name,
    seoDescription: row.values.description,
  };
}

export default function BasecampImportPage() {
  const [step, setStep] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  const [rawRows, setRawRows] = useState<Array<Record<string, string>>>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ImportMappingValue>(createEmptyMapping);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [summary, setSummary] = useState<ImportSummary>({ importedCount: 0, skippedCount: 0, errorCount: 0, duplicateWarnings: [] });

  useEffect(() => {
    async function loadExistingPlaces() {
      const places = await getPlaces();
      setExistingSlugs(places.map((place) => place.slug));
    }

    void loadExistingPlaces();
  }, []);

  const mappedRows = useMemo(() => {
    return rawRows.map((rawRow) => {
      const result: Partial<Record<PlaceImportField, string>> = {};
      for (const field of REQUIRED_PLACE_IMPORT_FIELDS) {
        const sourceColumn = mapping[field];
        result[field] = sourceColumn ? (rawRow[sourceColumn] ?? "") : "";
      }
      return result;
    });
  }, [mapping, rawRows]);

  const validatedRows = useMemo(() => validatePlaceImport(mappedRows, existingSlugs), [mappedRows, existingSlugs]);

  const mappingComplete = REQUIRED_PLACE_IMPORT_FIELDS.every((field) => Boolean(mapping[field]));

  const handleFileSelection = async (file: File) => {
    setParseError(null);
    setSummary({ importedCount: 0, skippedCount: 0, errorCount: 0, duplicateWarnings: [] });

    const lowerName = file.name.toLowerCase();
    const fileType = lowerName.endsWith(".csv") ? "CSV" : lowerName.endsWith(".json") ? "JSON" : "";

    if (!fileType) {
      setParseError("Unsupported file type. Please upload .csv or .json.");
      return;
    }

    try {
      const text = await file.text();
      const parsedRows = fileType === "CSV" ? parseCsv(text) : parseJson(text);

      if (parsedRows.length === 0) {
        setParseError("The uploaded file has no rows to import.");
      }

      const nextHeaders = Array.from(
        parsedRows.reduce((set, row) => {
          Object.keys(row).forEach((key) => set.add(key));
          return set;
        }, new Set<string>()),
      );

      setSelectedFileName(file.name);
      setSelectedFileType(fileType);
      setRawRows(parsedRows);
      setHeaders(nextHeaders);
      setMapping(suggestedMapping(nextHeaders));
      setStep(0);
    } catch {
      setParseError("Unable to parse file. Check format and try again.");
      setRawRows([]);
      setHeaders([]);
      setMapping(createEmptyMapping());
    }
  };

  const runImport = async () => {
    setIsImporting(true);

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const duplicateWarnings: string[] = [];

    for (const row of validatedRows) {
      const duplicateWarning = row.warnings.find((warning) => warning.toLowerCase().startsWith("duplicate slug"));
      if (duplicateWarning) {
        duplicateWarnings.push(`Row ${row.rowNumber}: ${duplicateWarning}`);
      }

      if (!row.canImport) {
        skippedCount += 1;
        continue;
      }

      try {
        await createPlace(toPlaceInput(row));
        importedCount += 1;
      } catch {
        errorCount += 1;
        skippedCount += 1;
      }
    }

    setSummary({ importedCount, skippedCount, errorCount, duplicateWarnings });
    setIsImporting(false);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <aside className="w-full rounded-[30px] border border-white/10 bg-[#12261d] p-5 text-[#f7efe0] shadow-[0_24px_90px_rgba(10,18,15,0.28)] lg:sticky lg:top-6 lg:w-72 lg:shrink-0 lg:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8b15d]">Basecamp</p>
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  item.active ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="rounded-3xl border border-[#d7cbb3] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Basecamp</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Places Import Tool</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">Upload CSV or JSON, map fields, preview rows, and import to the mock Places repository.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/samples/places-import-template.csv"
                download
                className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Download template
              </a>
              <Link href="/basecamp/places" className="rounded-full bg-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#f8f2e4]">
                Open places list
              </Link>
            </div>
          </header>

          <section className="rounded-3xl border border-[#d7cbb3] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {stepLabels.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(index)}
                  disabled={index > step && !(index === 3 && summary.importedCount + summary.skippedCount > 0)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    step === index ? "bg-[#1f3b2f] text-[#f8f2e4]" : "border border-[#d7cbb3] bg-[#fcfaf6] text-slate-700"
                  } disabled:opacity-50`}
                >
                  {index + 1}. {label}
                </button>
              ))}
            </div>
          </section>

          {parseError ? (
            <div className="rounded-2xl border border-[#f0d7d2] bg-[#fff2f0] p-4 text-sm text-[#8b2e1f]">{parseError}</div>
          ) : null}

          {step === 0 ? (
            <ImportUploader selectedFileName={selectedFileName} selectedFileType={selectedFileType} onSelectFile={handleFileSelection} />
          ) : null}

          {step === 1 ? <ImportMapping headers={headers} mapping={mapping} onChange={setMapping} /> : null}

          {step === 2 ? <ImportPreviewTable rows={validatedRows} /> : null}

          {step === 3 ? (
            <ImportResults
              importedCount={summary.importedCount}
              skippedCount={summary.skippedCount}
              errorCount={summary.errorCount}
              duplicateWarnings={summary.duplicateWarnings}
            />
          ) : null}

          <section className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="rounded-full border border-[#d7cbb3] bg-white px-5 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Back
            </button>

            <div className="flex items-center gap-3">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => void runImport()}
                  disabled={isImporting || validatedRows.length === 0}
                  className="rounded-full bg-[#1f3b2f] px-5 py-2 text-sm font-semibold text-[#f8f2e4] disabled:opacity-50"
                >
                  {isImporting ? "Importing..." : "Run import"}
                </button>
              ) : null}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.min(2, current + 1))}
                  disabled={(step === 0 && rawRows.length === 0) || (step === 1 && !mappingComplete)}
                  className="rounded-full bg-[#1f3b2f] px-5 py-2 text-sm font-semibold text-[#f8f2e4] disabled:opacity-50"
                >
                  Next
                </button>
              ) : null}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
