import { Button } from "@/components/ui";

const TOTAL_STEPS = 7;

interface PlaceBuilderActionsProps {
  currentStep: number;
  isSaving: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function PlaceBuilderActions({
  currentStep,
  isSaving,
  onBack,
  onNext,
  onSaveDraft,
  onPublish,
}: PlaceBuilderActionsProps) {
  const isFirst = currentStep === 1;
  const isLast = currentStep === TOTAL_STEPS;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[32px] border border-[#e8dfc8] bg-white/80 p-4 shadow-sm backdrop-blur">
      <Button type="button" variant="ghost" onClick={onBack} disabled={isFirst}>
        ← Back
      </Button>

      <p className="hidden text-sm text-slate-500 sm:block">
        Step {currentStep} of {TOTAL_STEPS}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" onClick={onSaveDraft} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save Draft"}
        </Button>
        {isLast ? (
          <Button type="button" variant="secondary" onClick={onPublish} disabled={isSaving}>
            Publish
          </Button>
        ) : (
          <Button type="button" variant="primary" onClick={onNext} disabled={isSaving}>
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
