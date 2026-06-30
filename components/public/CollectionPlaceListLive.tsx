"use client";

import { useMemo } from "react";
import { useRelationshipStore } from "@/components/relationships/RelationshipStoreProvider";
import { mockPlaces } from "@/data/places";
import { CollectionPlaceList } from "./CollectionPlaceList";

interface CollectionPlaceListLiveProps {
  collectionId: string;
  fallbackPlaceIds: string[];
}

export function CollectionPlaceListLive({ collectionId, fallbackPlaceIds }: CollectionPlaceListLiveProps) {
  const { getRelationships } = useRelationshipStore();

  const places = useMemo(() => {
    const containsRelationships = getRelationships({
      contentType: "collection",
      contentId: collectionId,
      relationshipType: "contains",
    });

    const relationshipPlaceIds = containsRelationships
      .map((relationship) => {
        const isFromCollection = relationship.fromType === "collection" && relationship.fromId === collectionId;
        if (isFromCollection && relationship.toType === "place") {
          return relationship.toId;
        }
        if (!isFromCollection && relationship.fromType === "place") {
          return relationship.fromId;
        }
        return null;
      })
      .filter((id): id is string => Boolean(id));

    const idsToUse = relationshipPlaceIds.length ? relationshipPlaceIds : fallbackPlaceIds;

    return idsToUse
      .map((id) => mockPlaces.find((place) => place.id === id && place.status === "published"))
      .filter((place): place is (typeof mockPlaces)[number] => Boolean(place));
  }, [collectionId, fallbackPlaceIds, getRelationships]);

  return <CollectionPlaceList places={places} />;
}
