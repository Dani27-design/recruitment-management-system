interface SummaryPanelItem {
  label: string;
  value: number;
}

interface SummaryPanelProps {
  title: string;
  items: SummaryPanelItem[];
}

export function SummaryPanel({ title, items }: SummaryPanelProps) {
  return (
    <section className="rounded border border-slate-200 bg-white">
      <h3 className="border-b border-slate-200 px-4 py-3 text-base font-semibold text-slate-950">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="p-4 text-sm text-slate-600">No summary data available.</p>
      ) : (
        <dl className="divide-y divide-slate-200">
          {items.map((item) => (
            <div className="flex items-center justify-between gap-4 px-4 py-3" key={item.label}>
              <dt className="text-sm text-slate-700">{item.label}</dt>
              <dd className="text-sm font-semibold text-slate-950">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
