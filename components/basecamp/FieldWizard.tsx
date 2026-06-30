"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createPlace, type PlaceInput } from "@/repositories/PlaceRepository";
import type { PlaceType } from "@/types/Place";
import { FieldNotesCard } from "./FieldNotesCard";
import { GPSCaptureCard } from "./GPSCaptureCard";
import { PhotoCaptureCard } from "./PhotoCaptureCard";
import { QuickDetailsCard, type QuickDetailsState } from "./QuickDetailsCard";
import { SaveDraftCard } from "./SaveDraftCard";

const stepLabels = ["Location", "Photos", "Quick Details", "Notes", "Save Draft"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createInitialDetails(): QuickDetailsState {
  return {
    name: "",
    placeType: "Trail",
    description: "",
    dogFriendly: false,
    kidFriendly: false,
    swimming: false,
    parking: true,
    restroom: false,
    accessibility: false,
    bestSeason: "",
    difficulty: "",
  };
}

function buildMetadata(details: QuickDetailsState, placeType: PlaceType) {
  if (placeType === "Waterfall") {
    return {
      waterfall: {
        height: "",
        swimming: details.swimming,
        trailDistance: "",
        difficulty: details.difficulty,
      },
    };
  }

  if (placeType === "Trail") {
    return {
      trail: {
        distance: "",
        elevationGain: "",
        loop: false,
        dogsAllowed: details.dogFriendly,
      },
    };
  }

  return {};
}

export function FieldWizard() {
  const [step, setStep] = useState(0);
  const [gpsStatus, setGpsStatus] = useState<"requesting" | "ready" | "error">("requesting");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [details, setDetails] = useState<QuickDetailsState>(createInitialDetails);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const townLabel = useMemo(() => {
    if (latitude === null || longitude === null) {
      return "Town lookup placeholder";
    }
    return "Town lookup coming soon";
  }, [latitude, longitude]);

  const coordinatesLabel = latitude !== null && longitude !== null
    ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    : "Unavailable";

  const requestGps = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsStatus("error");
      return;
    }

    setGpsStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsStatus("ready");
      },
      () => {
        setGpsStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  useEffect(() => {
    requestGps();
  }, []);

  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoPreviews]);

  const onPickFiles = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    setPhotoPreviews((current) => {
      const next = [...current];
      Array.from(files).forEach((file) => {
        next.push(URL.createObjectURL(file));
      });
      return next;
    });
  };

  const handleCapturePhoto = () => {
    fileInputRef.current?.setAttribute("capture", "environment");
    fileInputRef.current?.click();
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.removeAttribute("capture");
    fileInputRef.current?.click();
  };

  const createDraft = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const name = details.name.trim() || `Field Draft ${new Date().toLocaleDateString()}`;
    const slug = slugify(name) || `field-draft-${Date.now().toString(36)}`;

    const amenities = [
      details.parking ? "Parking" : null,
      details.restroom ? "Restroom" : null,
      details.accessibility ? "Accessibility" : null,
      details.swimming ? "Swimming" : null,
      details.dogFriendly ? "Dog Friendly" : null,
      details.kidFriendly ? "Kid Friendly" : null,
    ].filter((item): item is string => Boolean(item));

    const input: PlaceInput = {
      slug,
      name,
      description: details.description.trim() || notes.trim() || "Field capture draft",
      placeType: details.placeType,
      categories: [details.placeType],
      tags: ["field-mode", details.bestSeason || "season-pending", details.difficulty || "difficulty-pending"],
      address: "",
      city: townLabel,
      state: "VT",
      zip: "",
      latitude: latitude ?? 43,
      longitude: longitude ?? -72.5,
      phone: "",
      email: "",
      website: "",
      hours: "",
      featuredImage: photoPreviews[0] ?? "https://placehold.co/1200x800?text=Field+Capture",
      gallery: [...photoPreviews],
      amenities,
      featured: false,
      status: "draft",
      metadata: buildMetadata(details, details.placeType),
      relatedPlaces: [],
      seoTitle: name,
      seoDescription: details.description.trim() || notes.trim() || "Field capture draft",
    };

    try {
      const created = await createPlace(input);
      setSaveSuccess(`Draft saved: ${created.name} (${created.id})`);
    } catch {
      setSaveError("Unable to save draft right now. Try again in a moment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-[#d7cbb3] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Field Mode</p>
          <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold text-slate-700">Offline-ready UI</span>
        </div>
        <p className="mt-2 text-sm text-slate-600">Step {step + 1} of {stepLabels.length}: {stepLabels[step]}</p>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {stepLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                step === index ? "bg-[#1f3b2f] text-[#f8f2e4]" : "border border-[#d7cbb3] bg-[#fcfaf6] text-slate-700"
              }`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </section>

      {step === 0 ? <GPSCaptureCard status={gpsStatus} latitude={latitude} longitude={longitude} townLabel={townLabel} onRequestGps={requestGps} /> : null}
      {step === 1 ? <PhotoCaptureCard previewImages={photoPreviews} onCapturePhoto={handleCapturePhoto} onUploadPhoto={handleUploadPhoto} /> : null}
      {step === 2 ? <QuickDetailsCard value={details} onChange={setDetails} /> : null}
      {step === 3 ? <FieldNotesCard notes={notes} onChangeNotes={setNotes} /> : null}
      {step === 4 ? (
        <SaveDraftCard
          placeName={details.name}
          placeType={details.placeType}
          coordinatesLabel={coordinatesLabel}
          photoCount={photoPreviews.length}
          isSaving={isSaving}
          error={saveError}
          success={saveSuccess}
          onSaveDraft={createDraft}
        />
      ) : null}

      <section className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
          className="min-h-12 rounded-full border border-[#d7cbb3] bg-white px-5 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => setStep((current) => Math.min(stepLabels.length - 1, current + 1))}
          disabled={step === stepLabels.length - 1}
          className="min-h-12 rounded-full bg-[#1f3b2f] px-6 text-sm font-semibold text-[#f8f2e4] disabled:opacity-50"
        >
          Next
        </button>
      </section>

      <section className="rounded-3xl border border-[#d7cbb3] bg-[#fcfaf6] p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Future TODO</p>
        <ul className="mt-2 space-y-1">
          <li>GPS reverse geocoding</li>
          <li>Weather snapshot</li>
          <li>Offline sync queue</li>
          <li>Drone import</li>
          <li>Supabase sync</li>
        </ul>
        <div className="mt-3">
          <Link href="/basecamp/places" className="text-sm font-semibold text-[#1f3b2f]">Open places list</Link>
        </div>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => onPickFiles(event.target.files)}
      />
    </div>
  );
}
