import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { ToastProvider, useToasts } from "@/components/ui";
import { PlaceForm } from "@/components/basecamp/PlaceForm";
import { CollectionForm } from "@/components/basecamp/CollectionForm";
import { ArticleForm } from "@/components/basecamp/ArticleForm";
import { EventForm } from "@/components/basecamp/EventForm";
import { mockPlaces } from "@/data/places";
import { mockCollections } from "@/data/collections";
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

  it("Event validation error", async () => {
    const user = userEvent.setup();
    renderWithToasts(<EventForm />);

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(screen.getByText("Please fix the highlighted fields.")).toBeInTheDocument();
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
