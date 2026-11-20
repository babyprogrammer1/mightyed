import { LockKeyhole, RefreshCw } from "lucide-react";

export default function StatusFooter() {
  return (
    <footer className="sticky bottom-0 z-10 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-2.5 text-xs text-slate-500 print:hidden">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-500" />
          Zenith Automated Bank Sweep: Active & Balanced
        </span>
        <span>•</span>
        <span className="flex items-center gap-1"><LockKeyhole size={12}/> Fiscal Audit Signature: #MIS-2026-Q1-SECURE</span>
      </div>
      <span className="flex items-center gap-1 whitespace-nowrap"><RefreshCw size={12}/> Data refreshed 30 seconds ago</span>
    </footer>
  );
}