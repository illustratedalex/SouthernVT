"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import type { Place, PlaceType } from "@/types/Place";
import { PlaceGallery } from "./PlaceGallery";

interface PlaceEditorProps {
  initialPlace?: Place;
}

const placeTypes: PlaceType[] = ["Restaurant", "Waterfall", "Hotel", "Trail"];
const amenityOptions = ["Parking", "Wi-Fi", "Pet Friendly", "Outdoor Seating", "Reservations", "Trail Access", "Dog Friendly"];

const createEmptyPlace = (): Place => ({
  id: "",
  name: "",
  slug: "",
  description: "",
  placeType: "Restaurant",
  categories: [],
  tags: [],
  address: "",
  city: "",
  state: "VT",
  zip: "",
  latitude: 43.0,
  longitude: -72.0,
  phone: "",
  email: "",
  website: "",
  hours: "",
  featuredImage: "",
  gallery: [],
  amenities: [],
  featured: false,
  status: "draft",
  metadata: {},
  relatedPlaces: [],
  seoTitle: "",
  seoDescription: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function getDynamicFields(placeType: PlaceType) {
  switch (placeType) {
    case "Restaurant":
      return [
        { key: "cuisine", label: "Cuisine", type: "text" },
        { key: "reservations", label: "Reservations", type: "checkbox" },
        { key: "outdoorSeating", label: "Outdoor Seating", type: "checkbox" },
      ];
    case "Waterfall":
      return [
        { key: "height", label: "Height", type: "text" },
        { key: "swimming", label: "Swimming", type: "checkbox" },
        { key: "trailDistance", label: "Trail Distance", type: "text" },
        { key: "difficulty", label: "Difficulty", type: "text" },
      ];
    case "Hotel":
      return [
        { key: "rooms", label: "Rooms", type: "text" },
        { key: "checkIn", label: "Check-in", type: "text" },
        { key: "petFriendly", label: "Pet Friendly", type: "checkbox" },
      ];
    case "Trail":
      return [
        { key: "distance", label: "Distance", type: "text" },
        { key: "elevation", label: "Elevation", type: "text" },
        { key: "loop", label: "Loop", type: "checkbox" },
        { key: "dogs", label: "Dogs", type: "checkbox" },
      ];
    default:
      return [];
  }
}

export function PlaceEditor({ initialPlace }: PlaceEditorProps) {
  const [place, setPlace] = useState<Place>(initialPlace ?? createEmptyPlace());
  const slugPreview = useMemo(() => {
    return place.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, [place.name]);

  const dynamicFields = useMemo(() => getDynamicFields(place.placeType), [place.placeType]);

  const updateField = (key: keyof Place, value: Place[keyof Place]) => {
    setPlace((current) => ({ ...current, [key]: value }));
  };

  const toggleAmenity = (value: string) => {
    setPlace((current) => ({
      ...current,
      amenities: current.amenities.includes(value) ? current.amenities.filter((item) => item !== value) : [...current.amenities, value],
    }));
  };

  return (
    <form className="space-y-6 rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
            <Input value={place.name} onChange={(event) => updateField("name", event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
            <Input value={place.slug || slugPreview} onChange={(event) => updateField("slug", event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={5}
              value={place.description}
              onChange={(event) => updateField("description", event.target.value)}
              className="w-full rounded-[1.5rem] border border-(--color-pine)/25 bg-white px-4 py-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Place Type</label>
            <select
              value={place.placeType}
              onChange={(event) => updateField("placeType", event.target.value as PlaceType)}
              className="h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
            >
              {placeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Categories</label>
            <Input value={place.categories.join(", ")} onChange={(event) => updateField("categories", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
            <Input value={place.tags.join(", ")} onChange={(event) => updateField("tags", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
          </div>
        </div>

        <div className="space-y-5 rounded-[24px] border border-[#f2e6cb] bg-[#fcfaf6] p-5">
          <div className="space-y-3">
            <label className="flex items-center gap-3 rounded-full border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" checked={place.featured} onChange={(event) => updateField("featured", event.target.checked)} />
              Featured
            </label>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Featured Image</label>
            <Input value={place.featuredImage} onChange={(event) => updateField("featuredImage", event.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Gallery</label>
            <Input value={place.gallery.join(", ")} onChange={(event) => updateField("gallery", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="Comma separated image URLs" />
          </div>
          <PlaceGallery images={place.gallery} />
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 rounded-full border border-[#e8dfc8] bg-white px-3 py-2 text-sm text-slate-700">
                  <input type="checkbox" checked={place.amenities.includes(option)} onChange={() => toggleAmenity(option)} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
          <Input value={place.address} onChange={(event) => updateField("address", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">City</label>
          <Input value={place.city} onChange={(event) => updateField("city", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">State</label>
          <Input value={place.state} onChange={(event) => updateField("state", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">ZIP</label>
          <Input value={place.zip} onChange={(event) => updateField("zip", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Latitude</label>
          <Input type="number" value={place.latitude} onChange={(event) => updateField("latitude", Number(event.target.value))} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Longitude</label>
          <Input type="number" value={place.longitude} onChange={(event) => updateField("longitude", Number(event.target.value))} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
          <Input value={place.phone} onChange={(event) => updateField("phone", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Website</label>
          <Input value={place.website} onChange={(event) => updateField("website", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Hours</label>
          <Input value={place.hours} onChange={(event) => updateField("hours", event.target.value)} />
        </div>
      </div>

      {dynamicFields.length > 0 ? (
        <div className="rounded-[24px] border border-[#e8dfc8] bg-[#fcfaf6] p-5">
          <h2 className="text-lg font-semibold text-slate-900">Type-specific details</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {dynamicFields.map((field) => (
              <div key={field.key}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</label>
                {field.type === "checkbox" ? (
                  <label className="flex items-center gap-3 rounded-full border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean((place as unknown as Record<string, unknown>)[field.key])}
                      onChange={(event) => updateField(field.key as keyof Place, event.target.checked)}
                    />
                    {field.label}
                  </label>
                ) : (
                  <Input
                    value={String((place as unknown as Record<string, unknown>)[field.key] ?? "")}
                    onChange={(event) => updateField(field.key as keyof Place, event.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-[24px] border border-[#e8dfc8] bg-[#fcfaf6] p-5">
        <h2 className="text-lg font-semibold text-slate-900">Metadata</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">SEO Title</label>
            <Input value={place.seoTitle} onChange={(event) => updateField("seoTitle", event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">SEO Description</label>
            <Input value={place.seoDescription} onChange={(event) => updateField("seoDescription", event.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
        <Button type="button" variant="secondary">
          Save Draft
        </Button>
        <Button type="button" variant="primary">
          Publish
        </Button>
        <Link href="/basecamp/places">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
