interface EmptyRelatedStateProps {
  title: string;
  description: string;
}

export function EmptyRelatedState({ title, description }: EmptyRelatedStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-5">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}