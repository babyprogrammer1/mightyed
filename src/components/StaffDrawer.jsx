import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useToast } from "../context/AppContext.jsx";
import Avatar from "./Avatar.jsx";

const SUBJECTS = [
  "English Literature (Selective)", "Mathematics", "Physics", "Chemistry",
  "Biology", "Civic Education", "Agricultural Science", "ICT & Comp. Studies",
];
const COHORTS = [
  "SS 3 A & B (Combined)", "SS 2 Gold", "SS 2 Diamond",
  "SS 1 Gold & Diamond", "JSS 3 A", "JSS 3 B",
];
const LOADS = [
  "4 Periods / Week (Standard)", "3 Periods / Week (Light)",
  "6 Periods / Week (Full)", "2 Periods / Week (Relief)",
];

function FSelect({ label, value, onChange, options }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <div className="relative">
        <select className="input h-10 w-full appearance-none pr-8 text-sm"
          value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-3 top-3 text-slate-400" />
      </div>
    </label>
  );
}

export default function StaffDrawer({ staff, onClose }) {
  const toast = useToast();
  const [allocations, setAllocations] = useState(staff.allocations ?? []);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [cohort, setCohort] = useState(COHORTS[0]);
  const [load, setLoad] = useState(LOADS[0]);
  const [gradebook, setGradebook] = useState(false);
  const [sms, setSms] = useState(false);

  const usedHours = Math.min(24, allocations.length * 6);
  const pct = Math.round((usedHours / 24) * 100);
  const optimal = pct >= 50 && pct <= 80;
  const barColor = pct > 80 ? "bg-red-500" : optimal ? "bg-green-500" : "bg-blue-400";
  const loadLabel = pct > 80 ? "Heavy" : optimal ? "Optimal" : "Light";

  const addAllocation = () => {
    const chip = `${subject.split(" ")[0]} • ${cohort.split(" ").slice(0, 3).join(" ")}`;
    if (!allocations.includes(chip)) setAllocations([...allocations, chip]);
  };
  const removeAllocation = (a) => setAllocations(allocations.filter((x) => x !== a));

  const isAcademic = ["academic", "teacher", "faculty"].includes(staff.roleTone);

  return (
    <div className="fixed bottom-0 right-0 top-40 z-40 flex w-[380px] flex-col rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* header */}
      <div className="flex items-start justify-between rounded-t-2xl bg-purple-50 px-4 py-3">
        <div>
          <span className="rounded-full bg-brand px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            Quick Assignment Panel
          </span>
          <h2 className="mt-2 text-base font-bold">Teaching Allocation</h2>
        </div>
        <button className="icon-btn mt-0.5" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* staff mini profile */}
        <div className="mb-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <Avatar student={staff} size={44} />
            <div>
              <p className="text-lg font-bold leading-tight">{staff.name}</p>
              <p className="text-xs text-slate-500">{staff.id} • {staff.role}</p>
              <p className="mt-0.5 text-xs font-medium text-brand">
                {isAcademic ? "Academic • Senior Secondary" : "Administrative Staff"}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[["Department", staff.dept], ["Status", staff.status], ["Portal", staff.portal]].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-2">
                <p className="text-[11px] text-slate-500">{label}</p>
                <p className="mt-0.5 truncate text-xs font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="mb-3 text-base font-bold">Teaching Allocation</h2>
        {/* current allocations */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Current Allocations ({allocations.length})
            </p>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-brand">
              Term 3 Active
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allocations.length > 0 ? allocations.map((a) => (
              <span key={a} className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-brand">
                {a}
                <button className="text-slate-400 hover:text-red-500 leading-none" onClick={() => removeAllocation(a)}>×</button>
              </span>
            )) : <p className="text-xs text-slate-400 italic">No allocations yet for this term.</p>}
          </div>
        </div>

        {/* add subject / cohort */}
        <div className="mb-4 rounded-xl border border-slate-200 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Add Subject / Cohort</p>
          <div className="grid gap-2.5">
            <FSelect label="Select Subject" value={subject} onChange={setSubject} options={SUBJECTS} />
            <FSelect label="Select Cohort & Arm" value={cohort} onChange={setCohort} options={COHORTS} />
            <FSelect label="Teaching Load / Periods" value={load} onChange={setLoad} options={LOADS} />
          </div>
          <button type="button" className="btn btn-ghost btn-sm mt-3 w-full justify-center text-xs"
            onClick={addAllocation}>
            + Add to Allocation
          </button>
        </div>

        {/* weekly load bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span>Weekly Load: <strong>{usedHours} / 24 Hours</strong></span>
            <span className={`font-semibold ${pct > 80 ? "text-red-600" : "text-green-600"}`}>
              {pct}% ({loadLabel})
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* permission checkboxes */}
        <div className="space-y-2.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" className="size-4 accent-brand" checked={gradebook}
              onChange={(e) => setGradebook(e.target.checked)} />
            Grant Gradebook Final Submission Rights
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" className="size-4 accent-brand" checked={sms}
              onChange={(e) => setSms(e.target.checked)} />
            Allow Direct Cohort SMS Broadcasts
          </label>
        </div>
      </div>

      {/* footer */}
      <div className="border-t border-slate-100 p-4">
        <button className="btn btn-primary w-full justify-center"
          onClick={() => toast(`Allocation committed for ${staff.name}`)}>
          ✓ Save & Commit Allocation
        </button>
        <button className="mt-3 w-full text-center text-sm font-semibold text-brand hover:underline"
          onClick={() => toast("Opening full staff dossier...")}>
          View Complete Staff Dossier →
        </button>
      </div>
    </div>
  );
}