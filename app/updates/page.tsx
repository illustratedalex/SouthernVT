import { readFile } from "node:fs/promises";
import path from "node:path";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type Release = {
  version: string;
  title: string;
  added: string[];
  changed: string[];
};

function parseChangelog(markdown: string): Release[] {
  const lines = markdown.split(/\r?\n/);
  const releases: Release[] = [];
  let current: Release | null = null;
  let mode: "added" | "changed" | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      if (current) {
        releases.push(current);
      }

      const heading = trimmed.replace(/^##\s+/, "");
      const [version, ...rest] = heading.split(" - ");
      current = {
        version,
        title: rest.join(" - ") || version,
        added: [],
        changed: [],
      };
      mode = null;
      continue;
    }

    if (!current) {
      continue;
    }

    if (trimmed === "### Added") {
      mode = "added";
      continue;
    }

    if (trimmed === "### Changed") {
      mode = "changed";
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const item = trimmed.replace(/^-\s+/, "");
      if (mode === "added") {
        current.added.push(item);
      }
      if (mode === "changed") {
        current.changed.push(item);
      }
    }
  }

  if (current) {
    releases.push(current);
  }

  return releases.reverse();
}

export default async function UpdatesPage() {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");
  const markdown = await readFile(changelogPath, "utf8");
  const releases = parseChangelog(markdown);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <header className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Updates</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">SouthernVT Changelog</h1>
        </header>

        <div className="space-y-4">
          {releases.map((release) => (
            <article key={release.version} className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{release.version}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{release.title}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <section>
                  <p className="text-sm font-semibold text-slate-900">Added</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {release.added.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <p className="text-sm font-semibold text-slate-900">Changed</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {release.changed.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
