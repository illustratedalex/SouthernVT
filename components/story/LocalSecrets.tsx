import type { Story } from "@/types/Story";

type LocalSecretsProps = {
  story: Story;
};

export function LocalSecrets({ story }: LocalSecretsProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6">
      <h3 className="text-2xl font-semibold text-slate-900">Local Secrets</h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
        {story.localSecrets.map((secret) => (
          <li key={secret} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#7f5ea9]" />
            <span>{secret}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
