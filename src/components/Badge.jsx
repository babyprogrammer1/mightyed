const tones = {
  purple: "bg-brand-light text-brand", blue: "bg-blue-100 text-blue-700", red: "bg-red-100 text-red-600",
  gray: "bg-slate-200 text-slate-700", green: "bg-green-100 text-green-700",
};
export default function Badge({ tone = "gray", children }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
