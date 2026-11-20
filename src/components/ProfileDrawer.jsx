import { useState } from "react";
import { X, Pencil, MoreVertical, Phone, MessageSquare, Printer, ArrowRight, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { idToSlug } from "../data/students.js";
import Avatar from "./Avatar.jsx";
import { useToast } from "../context/AppContext.jsx";

const TABS = ["Overview", "Ledger", "Grades (CA)", "Attendance"];

const EXT = {
  "MIS/2024/0142": {
    bloodGroup: "O+", genotype: "AA", boarding: "Hall 3B", house: "Niger House", role: "Class Prefect",
    gpa: 4.62, gpaMax: 5.0, attendance: 98.2, rank: "2nd in Arm", tuitionBalance: 0,
    guardian: {
      name: "Dr. Kunle Adebayo", role: "Father • Medical Director",
      phone: "0803 123 4567", email: "kunle.adebayo@health.gov.ng",
      address: "Plot 14, Admiralty Way, Lekki Phase 1, Lagos State",
    },
    emergency: { name: "Mrs. Folake Adebayo", role: "Mother", phone: "0802 333 8812" },
    medical: "Mild asthmatic (Ventolin inhaler kept at Sick Bay Locker #4). No known dietary allergies or lactose intolerance.",
  },
};

export default function ProfileDrawer({ student, onClose }) {
  const toast = useToast();
  const [tab, setTab] = useState(0);
  const e = EXT[student.id] ?? {};

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-[380px] flex-col border-l border-slate-200 bg-white shadow-2xl">
      {/* header */}
      <div className="flex items-center justify-between bg-purple-100 px-4 py-3">
        <span className="rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-white">ACTIVE SELECTION</span>
        <div className="flex items-center gap-1">
          <button className="icon-btn" onClick={() => toast(`Editing ${student.name}`)} aria-label="Edit student"><Pencil size={16} /></button>
          <button className="icon-btn" onClick={() => toast(`More actions for ${student.name}`)} aria-label="More student actions"><MoreVertical size={16} /></button>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* identity */}
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-start gap-3">
            <Avatar student={student} size={56} />
            <div className="min-w-0">
              <h2 className="text-lg font-bold leading-tight">{student.name}</h2>
              <p className="text-xs text-slate-500">{student.id} • {e.role ?? "Student"}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-brand">{student.cls} Gold</span>
                {e.house && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{e.house}</span>}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[["Blood Group", e.bloodGroup], ["Genotype", e.genotype], ["Boarding", e.boarding]].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-slate-50 p-2">
                <p className="text-[11px] text-slate-500">{l}</p>
                <p className="mt-0.5 font-bold">{v ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* tabs */}
        <div className="flex border-b border-slate-100">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex flex-1 items-center justify-center gap-1 py-3 text-xs font-medium ${tab === i ? "border-b-2 border-brand text-brand" : "text-slate-500 hover:text-slate-700"}`}>
              {t}{t === "Ledger" && <span className="size-1.5 rounded-full bg-green-500" />}
            </button>
          ))}
        </div>

        {/* overview */}
        {tab === 0 && (
          <div className="p-4">
            {/* GPA block */}
            <div className="rounded-xl bg-indigo-50/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Term 3 Performance</p>
              <div className="mt-1 flex items-end justify-between">
                <span className="text-2xl font-bold leading-none">
                  {e.gpa ?? "—"}
                  <span className="text-sm font-normal text-slate-500">/{e.gpaMax ?? 5}.00 GPA</span>
                </span>
                <span className="text-xs font-semibold text-green-600">Ranked {e.rank ?? "—"}</span>
              </div>
              <p className="mt-1 text-right text-xs font-semibold text-brand">{e.attendance ?? "—"}% Class Attendance</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-purple-200">
                <div className="h-full rounded-full bg-brand" style={{ width: `${((e.gpa ?? 0) / (e.gpaMax ?? 5)) * 100}%` }} />
              </div>
            </div>

            {/* Primary guardian */}
            {e.guardian && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Primary Guardian & Sponsor</p>
                  <span className="text-[11px] font-semibold text-green-600">Verified</span>
                </div>
                <div className="mt-2 rounded-xl border border-slate-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm">
                      <p className="font-semibold">{e.guardian.name}</p>
                      <p className="text-xs text-slate-500">{e.guardian.role}</p>
                      <p className="mt-1.5 flex items-center gap-1 text-xs"><Phone size={11} /> {e.guardian.phone}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">{e.guardian.email}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-400">{e.guardian.address}</p>
                    </div>
                    <button className="rounded-full bg-indigo-50 p-2 text-brand" onClick={() => toast(`Calling ${e.guardian.name}...`)}>
                      <Phone size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency contact */}
            {e.emergency && (
              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Secondary / Emergency Contact</p>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="font-semibold text-sm">{e.emergency.name}</p>
                    <p className="text-xs text-slate-500">{e.emergency.role} • {e.emergency.phone}</p>
                  </div>
                  <button className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700"
                    onClick={() => toast("Opening WhatsApp...")}>WhatsApp</button>
                </div>
              </div>
            )}

            {/* Medical */}
            {e.medical && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600"><HeartPulse size={14} /> Medical Advisory</p>
                <p className="mt-1 text-xs text-slate-700">{e.medical}</p>
              </div>
            )}

            {/* Balance */}
            <div className="mt-4">
              <p className="text-xs text-slate-500">Term 3 Tuition Balance</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-green-600">
                  ₦{(e.tuitionBalance ?? 0).toLocaleString()}.00
                  <span className="text-sm font-normal text-slate-500"> (Fully Cleared)</span>
                </p>
                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                  onClick={() => toast("Opening receipt...")}>View Receipt</button>
              </div>
            </div>
          </div>
        )}

        {tab === 1 && <div className="p-4 text-sm text-slate-500">Ledger details — open the full profile to view.</div>}
        {tab === 2 && <div className="p-4 text-sm text-slate-500">CA Grades — open the full profile to view.</div>}
        {tab === 3 && <div className="p-4 text-sm text-slate-500">Attendance records — open the full profile to view.</div>}
      </div>

      {/* footer */}
      <div className="border-t border-slate-100 p-4">
        <button className="btn btn-primary w-full justify-center"
          onClick={() => toast("SMS / Portal message queued")}>
          <MessageSquare size={16} /> Message Guardian (SMS / Portal)
        </button>
        <div className="mt-3 flex justify-between">
          <button className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-ink" onClick={() => window.print()}>
            <Printer size={14} /> Print Dossier
          </button>
          <Link to={`/students/${idToSlug(student.id)}`} onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand">
            Full Profile <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}