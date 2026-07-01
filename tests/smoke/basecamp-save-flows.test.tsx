import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { ToastProvider, useToasts } from "@/components/ui";
import { PlaceForm } from "@/components/basecamp/PlaceForm";
import { CollectionForm } from "@/components/basecamp/CollectionForm";
import { ArticleForm } from "@/components/basecamp/ArticleForm";
import { EventForm } from "@/components/basecamp/EventForm";
import { DealForm } from "@/components/basecamp/DealForm";
import { MediaLibraryClient } from "@/components/basecamp/MediaLibraryClient";
import { FeatureFlagsSettings } from "@/components/basecamp/FeatureFlagsSettings";
import { mockPlaces } from "@/data/places";
import { mockCollections } from "@/data/collections";
import { mockEvents } from "@/data/events";
import { mockDeals } from "@/data/deals";
import { mockArticles } from "@/data/articles";
import { mediaAssets } from "@/data/media";
import { mockFeatureFlags } from "@/data/featureFlags";
import { setRepositoryModeOverride } from "@/lib/repositories/mode";

function renderWithToasts(node: ReactNode) {
  return render(<ToastProvider>{node}</ToastProvider>);
}

function ToastHarness() {
  const { pushToast } = useToasts();

  return (
    <div>
      <button type="button" onClick={() => pushToast({ tone: "success", title: "Toast Success", description: "Saved" })}>
        Success Toast
      </button>
      <button type="button" onClick={() => pushToast({ tone: "error", title: "Toast Error", description: "Failed" })}>
        Error Toast
      </button>
    </div>
  );
}

beforeEach(() => {
  setRepositoryModeOverride("mock");
});

describe("Basecamp save flow smoke tests", () => {
  it("Place save draft", async () => {
    const user = userEvent.setup();
    const place = { ...mockPlaces[0], status: "draft" as const };

    renderWithToasts(<PlaceForm initialPlace={place} />);

    await user.click(screen.getByRole("button", { name: "Save Draft" }));

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("Place publish", async () => {
    const user = userEvent.setup();
    const place = { ...mockPlaces[0], status: "review" as const };

    renderWithToasts(<PlaceForm initialPlace={place} />);

    await user.click(screen.getByRole("button", { name: /^publish$/i }));
    await user.click(screen.getByRole("button", { name: /confirm publish/i }));

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("Collection save draft", async () => {
    const user = userEvent.setup();
    const collection = { ...mockCollections[0], status: "draft" as const };

    renderWithToasts(<CollectionForm initialCollection={collection} />);

    await user.click(screen.getByRole("button", { name: "Save Draft" }));

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("Article validation error", async () => {
    const user = userEvent.setup();
    renderWithToasts(<ArticleForm />);

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(screen.getByText("Please fix the highlighted fields.")).toBeInTheDocument();
  });

  it("Article save draft", async () => {
    const user = userEvent.setup();
    const article = { ...mockArticles[0], status: "draft" as const };

    renderWithToasts(<ArticleForm initialArticle={article} />);

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("Event validation error", async () => {
    const user = userEvent.setup();
    renderWithToasts(<EventForm />);

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(screen.getByText("Please fix the highlighted fields.")).toBeInTheDocument();
  });

  it("Event save draft", async () => {
    const user = userEvent.setup();
    const event = { ...mockEvents[0], status: "draft" as const };

    renderWithToasts(<EventForm initialEvent={event} />);

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("Deal save draft", async () => {
    const user = userEvent.setup();
    const deal = { ...mockDeals[0], status: "draft" as const };

    renderWithToasts(<DealForm initialDeal={deal} />);

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("Media upload save", async () => {
    const user = userEvent.setup();

    renderWithToasts(<MediaLibraryClient initialAssets={mediaAssets} />);

    await user.click(screen.getByRole("button", { name: /upload media/i }));
    await user.type(screen.getByLabelText("Title"), "Smoke Test Asset");
    await user.type(screen.getByLabelText("Alt Text"), "Smoke test alt text");
    await user.click(screen.getByRole("button", { name: /save upload/i }));

    await waitFor(() => {
      expect(screen.getByText("Media saved")).toBeInTheDocument();
    });
  });

  it("Feature flag toggle save", async () => {
    const user = userEvent.setup();

    renderWithToasts(<FeatureFlagsSettings initialFlags={mockFeatureFlags} />);

    await user.click(screen.getAllByRole("button", { name: /toggle/i })[0]!);

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("Toast success and error", async () => {
    const user = userEvent.setup();

    renderWithToasts(<ToastHarness />);

    await user.click(screen.getByRole("button", { name: /success toast/i }));
    expect(screen.getByText("Toast Success")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /error toast/i }));
    expect(screen.getByText("Toast Error")).toBeInTheDocument();
  });
});
