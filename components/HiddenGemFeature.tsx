export default function HiddenGemFeature() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="grid gap-8 rounded-[2rem] border border-[#eae1cb] bg-white p-8 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#1f3b2f]">
            Hidden gem of the week
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A quiet riverside path with a storybook bridge and a picnic spot beyond the main road.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            This tucked-away stop offers a slower rhythm, cool shade, and a chance to experience Vermont in a way that feels personal and unhurried.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] shadow-md">
          <div
            className="h-full min-h-[280px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80')",
            }}
          />
        </div>
      </div>
    </section>
  );
}
