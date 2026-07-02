interface StatisticCardProps {
  label: string;
  value: number;
}

export function StatisticCard({ label, value }: StatisticCardProps) {
  return (
    <div className="surface-panel p-5">
      <dt className="text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-slate-950">{value}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">records</span>
      </dd>
    </div>
  );
}
