import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { Place } from "@/types/Place";
import { absoluteUrl } from "@/lib/seo";

function isoDateTime(date: string, time: string) {
  return `${date}T${time}:00`;
}

export function placeJsonLd(place: Place) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.name,
    description: place.description,
    image: [place.featuredImage, ...place.gallery].slice(0, 5),
    url: absoluteUrl(`/places/${place.slug}`),
    telephone: place.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address,
      addressLocality: place.city,
      addressRegion: place.state,
      postalCode: place.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.latitude,
      longitude: place.longitude,
    },
  };
}

export function eventJsonLd(event: Event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: [event.featuredImage, ...event.gallery].slice(0, 5),
    startDate: isoDateTime(event.startDate, event.startTime || "00:00"),
    endDate: isoDateTime(event.endDate, event.endTime || "23:59"),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.title,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.address,
        addressLocality: event.city,
        addressRegion: event.state,
        postalCode: event.zip,
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizerName,
      email: event.organizerEmail || undefined,
      url: event.organizerWebsite || undefined,
    },
    offers: event.ticketUrl
      ? {
          "@type": "Offer",
          url: event.ticketUrl,
          price: event.cost || undefined,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        }
      : undefined,
    url: absoluteUrl(`/events/${event.slug}`),
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.featuredImage, ...article.gallery].slice(0, 5),
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.publishedAt || article.updatedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
    url: absoluteUrl(`/guides/${article.slug}`),
  };
}

export function collectionJsonLd(collection: Collection) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.description,
    image: [collection.featuredImage, ...collection.gallery].slice(0, 5),
    numberOfItems: collection.places.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    url: absoluteUrl(`/collections/${collection.slug}`),
  };
}

export function dealJsonLd(deal: Deal) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: deal.title,
    description: deal.shortDescription,
    category: deal.dealType,
    validFrom: deal.startDate,
    validThrough: deal.endDate,
    url: absoluteUrl(`/deals/${deal.slug}`),
    image: [deal.featuredImage],
    eligibleTransactionVolume: deal.code || undefined,
    termsOfService: deal.terms,
  };
}
