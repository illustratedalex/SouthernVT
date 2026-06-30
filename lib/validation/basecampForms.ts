import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";

export type FormErrors = Record<string, string>;

function required(value: string | undefined, message: string) {
  return value && value.trim() ? null : message;
}

export function validatePlaceForm(place: Place): FormErrors {
  const errors: FormErrors = {};
  const nameError = required(place.name, "Name is required.");
  const descriptionError = required(place.description, "Description is required.");
  const addressError = required(place.address, "Address is required.");
  const cityError = required(place.city, "City is required.");

  if (nameError) errors.name = nameError;
  if (descriptionError) errors.description = descriptionError;
  if (addressError) errors.address = addressError;
  if (cityError) errors.city = cityError;

  return errors;
}

export function validateCollectionForm(collection: Collection): FormErrors {
  const errors: FormErrors = {};
  const titleError = required(collection.title, "Title is required.");
  const descriptionError = required(collection.description, "Description is required.");

  if (titleError) errors.title = titleError;
  if (descriptionError) errors.description = descriptionError;

  return errors;
}

export function validateArticleForm(article: Article): FormErrors {
  const errors: FormErrors = {};
  const titleError = required(article.title, "Title is required.");
  const excerptError = required(article.excerpt, "Excerpt is required.");
  const bodyError = required(article.body, "Body is required.");
  const authorError = required(article.author, "Author is required.");

  if (titleError) errors.title = titleError;
  if (excerptError) errors.excerpt = excerptError;
  if (bodyError) errors.body = bodyError;
  if (authorError) errors.author = authorError;

  return errors;
}

export function validateEventForm(event: Event): FormErrors {
  const errors: FormErrors = {};
  const titleError = required(event.title, "Title is required.");
  const startDateError = required(event.startDate, "Start date is required.");
  const addressError = required(event.address, "Address is required.");
  const cityError = required(event.city, "City is required.");

  if (titleError) errors.title = titleError;
  if (startDateError) errors.startDate = startDateError;
  if (addressError) errors.address = addressError;
  if (cityError) errors.city = cityError;

  return errors;
}

export function validateDealForm(deal: Deal): FormErrors {
  const errors: FormErrors = {};
  const titleError = required(deal.title, "Title is required.");
  const shortDescriptionError = required(deal.shortDescription, "Short description is required.");
  const placeIdError = required(deal.placeId, "Place is required.");
  const startDateError = required(deal.startDate, "Start date is required.");
  const endDateError = required(deal.endDate, "End date is required.");

  if (titleError) errors.title = titleError;
  if (shortDescriptionError) errors.shortDescription = shortDescriptionError;
  if (placeIdError) errors.placeId = placeIdError;
  if (startDateError) errors.startDate = startDateError;
  if (endDateError) errors.endDate = endDateError;

  return errors;
}

export function validateMediaUploadForm(values: { title: string; altText: string }): FormErrors {
  const errors: FormErrors = {};
  const titleError = required(values.title, "Title is required.");
  const altTextError = required(values.altText, "Alt text is required.");

  if (titleError) errors.title = titleError;
  if (altTextError) errors.altText = altTextError;

  return errors;
}