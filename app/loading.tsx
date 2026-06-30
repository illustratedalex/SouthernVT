import { LoadingState } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-6 py-16">
      <LoadingState title="Loading Southern Vermont" description="Fetching the latest routes and content..." className="w-full" />
    </div>
  );
}