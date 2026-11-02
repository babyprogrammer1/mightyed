import { TrendingUp } from "lucide-react";

export const Trend = () => (
  <small className="flex items-center gap-1 text-[11px] text-green-700"><TrendingUp size={13} /> +11.01% <em className="not-italic text-slate-500">this term</em></small>
);

export default function StatCard({ label, value, icon: Icon, footer = <Trend /> }) {
  return (
    <div className="card">
      <div className="mb-3 flex justify-between text-slate-600"><span>{label}</span><Icon size={20} className="text-brand" /></div>
      <div className="mb-3.5 text-[28px] font-medium leading-tight">{value}</div>
      {footer}
    </div>
  );
}
