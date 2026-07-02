interface SummaryPanelItem {
  label: string;
  value: number;
}

interface SummaryPanelProps {
  title: string;
  items: SummaryPanelItem[];
}

export function SummaryPanel({ title, items }: SummaryPanelProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="surface-panel">
      <h3 className="border-b border-slate-200/80 px-5 py-4 text-base font-semibold text-slate-950">{title}</h3>
      {items.length === 0 ? (
        <p className="p-5 text-sm text-slate-600">No summary data available.</p>
      ) : (
        <dl className="space-y-4 p-5">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm font-medium text-slate-700">{item.label}</dt>
                <dd className="text-sm font-semibold text-slate-950">{item.value}</dd>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-teal-600"
                  style={{ width: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
