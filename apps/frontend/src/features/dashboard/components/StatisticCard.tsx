interface StatisticCardProps {
  label: string;
  value: number;
}

export function StatisticCard({ label, value }: StatisticCardProps) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold text-slate-950">{value}</dd>
    </div>
  );
}
