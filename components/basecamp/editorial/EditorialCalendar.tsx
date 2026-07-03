"use client";

const monthlyTopics: Record<number, string[]> = {
  1: ["Winter Cozy Getaways", "Holiday Markets", "Snowy Trails"],
  2: ["Winter Sports", "Romantic Inns", "Scenic Drives"],
  3: ["Spring Waterfalls", "Wildflowers", "Mud Season Routes"],
  4: ["Spring Hiking", "Easter Events", "Garden Tours"],
  5: ["Outdoor Activities", "Memorial Day Trips", "Local Farms"],
  6: ["Summer Camping", "Swimming Holes", "Kayaking"],
  7: ["Swimming Holes", "Camping", "Summer Music Festivals"],
  8: ["Family Trips", "Farmers Markets", "Outdoor Concerts"],
  9: ["Apple Orchards", "Back-to-School Trips", "Hiking"],
  10: ["Fall Foliage", "Harvest Festivals", "Scenic Drives"],
  11: ["Covered Bridges", "Thanksgiving Trips", "Cozy Inns"],
  12: ["Holiday Markets", "Winter Lights", "New Year Getaways"],
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function EditorialCalendar() {
  const currentMonth = new Date().getMonth() + 1;
  const upcomingMonths = Array.from({ length: 6 }, (_, i) => {
    const month = ((currentMonth + i - 1) % 12) + 1;
    return month;
  });

  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Editorial Calendar</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Seasonal Topics</h2>
      <p className="mt-1 text-sm text-slate-600">Content priorities for upcoming months</p>

      <div className="mt-6 space-y-4">
        {upcomingMonths.map((month) => {
          const monthIndex = month - 1;
          const topics = monthlyTopics[month] || [];

          return (
            <div key={month} className="border-l-4 border-[#1f3b2f] pl-4 py-2">
              <h4 className="font-semibold text-sm text-slate-900 mb-2">
                {monthNames[monthIndex]}
              </h4>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span key={topic} className="inline-block text-xs font-semibold text-slate-700 bg-[#fcfaf6] px-3 py-1 rounded-full border border-[#ece3cf]">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
