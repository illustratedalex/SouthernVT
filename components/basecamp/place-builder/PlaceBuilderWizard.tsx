"use client";

import { useMemo, useState } from "react";
import { Button, Input, useToasts } from "@/components/ui";
import type { PlaceType } from "@/types/Place";
import { PlaceBuilderActions } from "./PlaceBuilderActions";
import { PlaceBuilderFieldGroup } from "./PlaceBuilderFieldGroup";
import { PlaceBuilderPreview } from "./PlaceBuilderPreview";
import { PlaceBuilderProgress } from "./PlaceBuilderProgress";
import { PlaceBuilderStep } from "./PlaceBuilderStep";
import { calcLaunchReadiness, createInitialData } from "./types";
import type { PlaceBuilderData } from "./types";

const TOTAL_STEPS = 7;

const placeTypes: PlaceType[] = [
  "Restaurant",
  "Waterfall",
  "Brewery",
  "Hotel",
  "Trail",
  "Covered Bridge",
  "Maker Studio",
  "Farm Stand",
  "Scenic Overlook",
  "Shop",
];

const countyOptions = ["Windham County", "Bennington County", "Windsor County"];
const seasonOptions = ["Spring", "Summer", "Fall", "Winter", "Year-Round"];
const restroomOptions = ["Yes", "No", "Seasonal"];
const dogsOptions = ["Yes", "No", "On leash"];
const swimmingOptions = ["Yes", "No", "Seasonal"];
const difficultyOptions = ["Easy", "Moderate", "Challenging", "Relaxed"];
const visitLengthOptions = ["< 30 min", "30–60 min", "1–2 hours", "Half day", "Full day"];

function validateStep(step: number, data: PlaceBuilderData): Record<string, string> {
  if (step !== 1) return {};
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.town.trim()) errors.town = "Town is required.";
  if (!data.summary.trim()) errors.summary = "Short summary is required.";
  return errors;
}

// ─── Local form helpers ───────────────────────────────────────────────────────

function WizardSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function WizardTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
    />
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

export function PlaceBuilderWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PlaceBuilderData>(createInitialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { pushToast } = useToasts();

  function update<K extends keyof PlaceBuilderData>(key: K, value: PlaceBuilderData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  const slug = useMemo(
    () =>
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "untitled-place",
    [data.name],
  );

  const readiness = useMemo(() => calcLaunchReadiness(data), [data]);

  function handleNext() {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSaveDraft() {
    setIsSaving(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    pushToast({
      tone: "success",
      title: "Draft prepared",
      description: "Real save will connect to the repository layer.",
    });
  }

  async function handlePublish() {
    setIsSaving(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    pushToast({
      tone: "success",
      title: "Place ready to publish",
      description: "Real save will connect to the repository layer.",
    });
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-forest-green)]">
          Basecamp
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Place Builder
        </h1>
        <p className="mt-2 max-w-3xl text-base leading-8 text-slate-600">
          Create consistent, launch-ready SouthernVT destination pages step by step.
        </p>
      </header>

      <PlaceBuilderProgress currentStep={step} readiness={readiness} />

      {/* ── Step 1: Basic Information ── */}
      {step === 1 ? (
        <PlaceBuilderStep
          stepNumber={1}
          title="Basic Information"
          description="Start with the fundamentals. Name, type, and location are used across every page."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <PlaceBuilderFieldGroup label="Name" required error={errors.name}>
              <Input
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Hamilton Falls"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="Place Type" required>
              <WizardSelect
                value={data.placeType}
                onChange={(v) => update("placeType", v as PlaceType)}
                options={placeTypes}
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="Town" required error={errors.town}>
              <Input
                value={data.town}
                onChange={(e) => update("town", e.target.value)}
                placeholder="e.g. Jamaica"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="County">
              <WizardSelect
                value={data.county}
                onChange={(v) => update("county", v)}
                options={countyOptions}
              />
            </PlaceBuilderFieldGroup>
          </div>

          <PlaceBuilderFieldGroup
            label="Short Summary"
            required
            error={errors.summary}
            hint="1–2 sentences shown on search results and cards. Keep it punchy."
          >
            <WizardTextarea
              value={data.summary}
              onChange={(v) => update("summary", v)}
              placeholder="A concise reason to visit — written for the public."
              rows={3}
            />
          </PlaceBuilderFieldGroup>

          {/* Slug preview */}
          <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">URL preview</p>
            <p className="mt-1 text-sm font-medium text-[#1a6b44]">
              https://southernvt.com/places/{slug}
            </p>
          </div>
        </PlaceBuilderStep>
      ) : null}

      {/* ── Step 2: Story ── */}
      {step === 2 ? (
        <PlaceBuilderStep
          stepNumber={2}
          title="Story"
          description="Good editorial copy is what makes Southern Vermont pages stand out. Be specific and personal."
        >
          <PlaceBuilderFieldGroup
            label="Why visit?"
            hint="What will someone feel or experience here?"
          >
            <WizardTextarea
              value={data.whyVisit}
              onChange={(v) => update("whyVisit", v)}
              placeholder="Describe the experience of being there."
              rows={4}
            />
          </PlaceBuilderFieldGroup>

          <PlaceBuilderFieldGroup
            label="What makes it unique?"
            hint="What sets this apart from anywhere else in Vermont?"
          >
            <WizardTextarea
              value={data.whatMakesUnique}
              onChange={(v) => update("whatMakesUnique", v)}
              placeholder="The one thing visitors always remember."
              rows={3}
            />
          </PlaceBuilderFieldGroup>

          <div className="grid gap-5 md:grid-cols-2">
            <PlaceBuilderFieldGroup label="Best season">
              <WizardSelect
                value={data.bestSeason}
                onChange={(v) => update("bestSeason", v)}
                options={seasonOptions}
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup
              label="Insider tip"
              hint="Something only a local would know."
            >
              <Input
                value={data.insiderTip}
                onChange={(e) => update("insiderTip", e.target.value)}
                placeholder="e.g. Arrive early on summer weekends"
              />
            </PlaceBuilderFieldGroup>
          </div>
        </PlaceBuilderStep>
      ) : null}

      {/* ── Step 3: Visitor Information ── */}
      {step === 3 ? (
        <PlaceBuilderStep
          stepNumber={3}
          title="Visitor Information"
          description="Practical details help visitors plan confidently. Fill in what you know."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <PlaceBuilderFieldGroup
              label="Parking"
              hint="e.g. Free roadside, small lot, 20 cars"
            >
              <Input
                value={data.parking}
                onChange={(e) => update("parking", e.target.value)}
                placeholder="Describe parking availability"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="Restrooms">
              <WizardSelect
                value={data.restrooms}
                onChange={(v) => update("restrooms", v)}
                options={restroomOptions}
                placeholder="Select…"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup
              label="Accessibility"
              hint="e.g. Paved path to viewpoint, steep trail"
            >
              <Input
                value={data.accessibility}
                onChange={(e) => update("accessibility", e.target.value)}
                placeholder="Describe accessibility"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="Dogs">
              <WizardSelect
                value={data.dogs}
                onChange={(v) => update("dogs", v)}
                options={dogsOptions}
                placeholder="Select…"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="Swimming">
              <WizardSelect
                value={data.swimming}
                onChange={(v) => update("swimming", v)}
                options={swimmingOptions}
                placeholder="Select…"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="Difficulty">
              <WizardSelect
                value={data.difficulty}
                onChange={(v) => update("difficulty", v)}
                options={difficultyOptions}
                placeholder="Select…"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="Visit length">
              <WizardSelect
                value={data.visitLength}
                onChange={(v) => update("visitLength", v)}
                options={visitLengthOptions}
                placeholder="Select…"
              />
            </PlaceBuilderFieldGroup>
          </div>
        </PlaceBuilderStep>
      ) : null}

      {/* ── Step 4: Photography ── */}
      {step === 4 ? (
        <PlaceBuilderStep
          stepNumber={4}
          title="Photography"
          description="Visuals are the first thing visitors see. Paste URLs or describe what's needed."
        >
          <PlaceBuilderFieldGroup
            label="Hero image"
            hint="Recommended: 1920×1080px or wider. Paste a URL or leave a placeholder note."
          >
            <Input
              value={data.heroImage}
              onChange={(e) => update("heroImage", e.target.value)}
              placeholder="https://… or describe: needs golden-hour shot of falls"
            />
            {data.heroImage && data.heroImage.startsWith("https://") ? (
              <div className="mt-3 overflow-hidden rounded-2xl border border-[#e8dfc8] bg-white shadow-sm">
                <img
                  src={data.heroImage}
                  alt="Hero preview"
                  className="h-52 w-full object-cover"
                />
              </div>
            ) : null}
          </PlaceBuilderFieldGroup>

          <PlaceBuilderFieldGroup
            label="Gallery"
            hint="Comma-separated URLs or a description of what photos are needed."
          >
            <WizardTextarea
              value={data.gallery}
              onChange={(v) => update("gallery", v)}
              placeholder="https://…, https://… or: 3–5 images showing trail, pool, signage"
              rows={3}
            />
          </PlaceBuilderFieldGroup>

          <div className="grid gap-5 md:grid-cols-2">
            <PlaceBuilderFieldGroup label="Drone footage (optional)">
              <Input
                value={data.droneFootage}
                onChange={(e) => update("droneFootage", e.target.value)}
                placeholder="https://… or note: needed"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup label="Vertical reel (optional)">
              <Input
                value={data.verticalReel}
                onChange={(e) => update("verticalReel", e.target.value)}
                placeholder="https://… or note: needed"
              />
            </PlaceBuilderFieldGroup>
          </div>

          <PlaceBuilderFieldGroup
            label="Photo notes"
            hint="Anything the photographer should know — angle, season, access."
          >
            <WizardTextarea
              value={data.photoNotes}
              onChange={(v) => update("photoNotes", v)}
              placeholder="e.g. Best light is late afternoon. Bring polarizer for waterfall shots."
              rows={3}
            />
          </PlaceBuilderFieldGroup>
        </PlaceBuilderStep>
      ) : null}

      {/* ── Step 5: Relationships ── */}
      {step === 5 ? (
        <PlaceBuilderStep
          stepNumber={5}
          title="Relationships"
          description="Connect this place to nearby context. These feed the recommendation engine and public page."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <PlaceBuilderFieldGroup
              label="Nearby food"
              hint="Restaurant names, slugs, or notes"
            >
              <Input
                value={data.nearbyFood}
                onChange={(e) => update("nearbyFood", e.target.value)}
                placeholder="e.g. Jamaica House, Naulakha Café"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup
              label="Nearby lodging"
              hint="Inn names, B&Bs, or slugs"
            >
              <Input
                value={data.nearbyLodging}
                onChange={(e) => update("nearbyLodging", e.target.value)}
                placeholder="e.g. Three Mountain Inn, Grafton Inn"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup
              label="Nearby attractions"
              hint="Other places within reasonable distance"
            >
              <Input
                value={data.nearbyAttractions}
                onChange={(e) => update("nearbyAttractions", e.target.value)}
                placeholder="e.g. Jamaica State Park, Pikes Falls"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup
              label="Collections"
              hint="Which collections should include this place?"
            >
              <Input
                value={data.collections}
                onChange={(e) => update("collections", e.target.value)}
                placeholder="e.g. Summer Swimming Holes, Hidden Gems"
              />
            </PlaceBuilderFieldGroup>

            <PlaceBuilderFieldGroup
              label="Guides"
              hint="Existing guides this place should appear in"
            >
              <Input
                value={data.guides}
                onChange={(e) => update("guides", e.target.value)}
                placeholder="e.g. Best of Windham County, Weekend in Brattleboro"
              />
            </PlaceBuilderFieldGroup>
          </div>

          <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">
              Relationship wiring in the Knowledge Graph will be completed when the Place is saved to the repository.
            </p>
          </div>
        </PlaceBuilderStep>
      ) : null}

      {/* ── Step 6: SEO ── */}
      {step === 6 ? (
        <PlaceBuilderStep
          stepNumber={6}
          title="SEO"
          description="Control how this place appears in search engines. These fields carry real ranking weight."
        >
          <PlaceBuilderFieldGroup
            label="SEO title"
            hint={`${(data.seoTitle || data.name).length} / 60 characters recommended`}
          >
            <Input
              value={data.seoTitle || data.name}
              onChange={(e) => update("seoTitle", e.target.value)}
              placeholder="e.g. Hamilton Falls – Jamaica, Vermont"
            />
          </PlaceBuilderFieldGroup>

          <PlaceBuilderFieldGroup
            label="SEO description"
            hint={`${(data.seoDescription || data.summary).length} / 160 characters recommended`}
          >
            <WizardTextarea
              value={data.seoDescription || data.summary}
              onChange={(v) => update("seoDescription", v)}
              placeholder="Concise description for search result snippets…"
              rows={3}
            />
          </PlaceBuilderFieldGroup>

          {/* Live Google snippet preview */}
          <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
              Slug preview
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-[#1a6b44]">
                https://southernvt.com/places/{slug}
              </p>
              <p className="text-sm font-semibold text-[#1a0dab]">
                {data.seoTitle || data.name || "Place title"}
              </p>
              <p className="text-sm leading-6 text-slate-700">
                {data.seoDescription || data.summary || "Add a description above to preview."}
              </p>
            </div>
          </div>

          {/* Warnings for recommended fields */}
          {(!data.seoTitle && !data.name) || (!data.seoDescription && !data.summary) ? (
            <div className="rounded-2xl border border-[#efe0b8] bg-[#fff8e8] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a5c17]">
                Recommended
              </p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-slate-600">
                {!data.seoTitle && !data.name ? <li>SEO title is empty</li> : null}
                {!data.seoDescription && !data.summary ? <li>SEO description is empty</li> : null}
              </ul>
            </div>
          ) : null}
        </PlaceBuilderStep>
      ) : null}

      {/* ── Step 7: Preview ── */}
      {step === 7 ? (
        <div className="space-y-5">
          <div className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">
              Step 7 of 7
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Preview</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              This is how the place page will look on the public site. Review everything before publishing.
            </p>
            {readiness < 80 ? (
              <div className="mt-4 rounded-2xl border border-[#efe0b8] bg-[#fff8e8] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a5c17]">
                  Launch readiness: {readiness}%
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Go back and fill in story, hero image, and SEO fields to reach the 80% launch threshold.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-[#cde8d6] bg-[#ecf8f0] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1f5a3d]">
                  Launch readiness: {readiness}% — ready!
                </p>
              </div>
            )}
          </div>

          <PlaceBuilderPreview data={data} />
        </div>
      ) : null}

      <PlaceBuilderActions
        currentStep={step}
        isSaving={isSaving}
        onBack={handleBack}
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      {/* Quick-jump for power users */}
      {step === TOTAL_STEPS ? (
        <div className="flex flex-wrap justify-center gap-3 pb-4">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <Button
              key={s}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setErrors({});
                setStep(s);
              }}
            >
              Edit step {s}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
