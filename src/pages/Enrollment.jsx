import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, ChevronLeft, ChevronRight, ChevronDown, Filter, CalendarDays, UserRound, ArrowLeftRight, Zap, CircleCheck, TriangleAlert, Mail, LockKeyhole } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";

const ROSTER = [
  { initials: "AS", name: "Adebayo Samuel O.", id: "MIS/2024/0142", arm: "SS 2B", pct: 88.4, grade: "GPA 3.85", gradeColor: "text-green-600", ledger: "Cleared (₦0.00)", cleared: true, status: "Promoted", sc: "bg-green-100 text-green-700" },
  { initials: "OC", name: "Okonkwo Chidimma", id: "MIS/2024/0188", arm: "SS 2A", pct: 79.2, grade: "Very Good", gradeColor: "text-blue-600", ledger: "Cleared (₦0.00)", cleared: true, status: "Promoted", sc: "bg-green-100 text-green-700" },
  { initials: "DK", name: "Danjuma Kabiru", id: "MIS/2024/0205", arm: "SS 2C", pct: 42.1, grade: "Deficient", gradeColor: "text-red-600", ledger: "Cleared (₦0.00)", cleared: true, status: "Repeat", sc: "bg-orange-100 text-orange-700" },
  { initials: "AI", name: "Abubakar Ibrahim", id: "MIS/2024/0091", arm: "SS 2C", pct: 74.0, grade: "Passed", gradeColor: "text-blue-500", ledger: "₦85,000 Overdue", cleared: false, status: "Hold (Def.)", sc: "bg-red-100 text-red-600" },
  { initials: "EB", name: "Ekaette Blessing M.", id: "MIS/2023/0401", arm: "SS 2B", pct: 94.5, grade: "Honors", gradeColor: "text-purple-700", ledger: "Cleared (₦0.00)", cleared: true, status: "Accepted", sc: "bg-indigo-100 text-indigo-700" },
];

const barColor = (p) => p >= 80 ? "bg-green-500" : p >= 60 ? "bg-blue-500" : "bg-red-500";

export default function Enrollment() {
  // Page flow: review eligible students, validate promotion conditions, and commit the selected class transition.
  const toast = useToast();
  const [tab, setTab] = useState(1);
  const [filterQ, setFilterQ] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [selected, setSelected] = useState(new Set(["MIS/2024/0142", "MIS/2024/0188"]));
  const [sourceClass, setSourceClass] = useState("SS 2 (2026/2027 Session)");
  const [targetCohort, setTargetCohort] = useState("SS 3 (2026/2027 Session)");
  const [standards, setStandards] = useState("Auto-National Curriculum");

  const toggleRow = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const rows = ROSTER.filter((r) => r.name.toLowerCase().includes(filterQ.toLowerCase()) || r.id.includes(filterQ));
  const toggleAll = () => setSelected((current) => {
    const allSelected = rows.length > 0 && rows.every((r) => current.has(r.id));
    const next = new Set(current);
    rows.forEach((r) => allSelected ? next.delete(r.id) : next.add(r.id));
    return next;
  });

  return (
    <div className="-m-4 sm:-m-6">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label: "Student Records Management" }, { label: "Enrollment & Class Promotion" }]} />
      </div>

      <div className="min-h-screen bg-indigo-50/70 p-6">
        {/* header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Enrollment & Class Promotion</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Register incoming admissions or execute systemic, criteria-driven batch end-of-session promotions, retentions, and graduation workflows across academic tiers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-brand-light px-4 py-2 text-sm font-semibold text-brand">
              <CalendarDays size={15} /> Target Session: 2026/2027 Academic Session
            </span>
            <button className="btn btn-ghost" onClick={() => toast("Downloading report...")}><Download size={15} /> Download Eligibility Report</button>
            <button className="btn btn-primary" onClick={() => toast("Opening batch promotion engine...")}>⚡ Execute Batch Promotion</button>
          </div>
        </div>

        {/* tabs */}
        <div className="mb-6 flex w-fit gap-1 rounded-xl bg-white p-1 shadow-sm">
          {[{ label: "Single & Bulk Student Enrollment", icon: UserRound }, { label: "Batch Class Promotion Engine", icon: ArrowLeftRight }].map(({ label, icon: Icon }, i) => (
            <button key={label} onClick={() => setTab(i)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${tab === i ? "bg-brand text-white shadow" : "text-slate-600 hover:bg-slate-50"}`}>
              <Icon size={15} /> {label}
              {i === 1 && <span className="size-2 rounded-full bg-green-400" />}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="card flex flex-col items-center gap-4 py-16 text-center">
            <h2 className="text-lg font-semibold">Single & Bulk Student Enrollment</h2>
            <p className="text-slate-500">Use this tab to register new students individually or upload a bulk roster CSV.</p>
            <Link to="/enroll" className="btn btn-primary"><UserRound size={15} /> Enroll New Student</Link>
          </div>
        )}

        {tab === 1 && (
          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            {/* left */}
            <div className="flex flex-col gap-5">
              {/* pipeline params */}
              <section className="card">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                  <span className="text-brand">⇄</span> Promotion Pipeline Parameters
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Source Class", ["SS 2 (2026/2027 Session)", "SS 1 (2026/2027 Session)", "JSS 3 (2026/2027 Session)"]],
                    ["Target Cohort", ["SS 3 (2026/2027 Session)", "SS 2 (2026/2027 Session)"]],
                    ["Standards", ["Auto-National Curriculum", "Custom Criteria"]],
                  ].map(([label, opts]) => {
                    const value = label === "Source Class" ? sourceClass : label === "Target Cohort" ? targetCohort : standards;
                    const update = label === "Source Class" ? setSourceClass : label === "Target Cohort" ? setTargetCohort : setStandards;
                    return (
                    <label key={label} className="relative grid gap-1.5">
                      <span className="text-xs font-medium text-slate-600">{label}</span>
                      <select value={value} onChange={(e) => update(e.target.value)} className="input h-10 appearance-none pr-8 text-sm">{opts.map((o) => <option key={o}>{o}</option>)}</select>
                      <ChevronDown size={14} className="pointer-events-none absolute bottom-2.5 right-3 text-slate-400" />
                    </label>
                    );
                  })}
                </div>
              </section>

              {/* roster */}
              <section className="card">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">
                      Class Roster: SSS 2{" "}
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-brand">Gold & Diamond Arms</span>{" "}
                      <span className="text-sm font-normal text-slate-500">42 Total Students</span>
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">● 36 Eligible for Promotion</span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">● 4 Conditional / Retain</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700"><TriangleAlert size={12} /> 2 Blocked (Outstanding Fees)</span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    <Filter size={14} />
                    <input placeholder="Filter Student Admission No." className="w-44 bg-transparent outline-none"
                      value={filterQ} onChange={(e) => setFilterQ(e.target.value)} />
                  </label>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="py-3 pl-3 text-left">
                          <input type="checkbox" className="size-4 accent-brand"
                            checked={rows.length > 0 && rows.every((r) => selected.has(r.id))}
                            onChange={toggleAll} />
                        </th>
                        {["Student Record", "Current Arm", "Cumulative Academics", "Bursar Ledger", "Status"].map((h) => (
                          <th key={h} className="py-3 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.id} onClick={() => toggleRow(r.id)}
                          className={`cursor-pointer border-t border-slate-100 ${selected.has(r.id) ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                          <td className="py-3.5 pl-3">
                            <input type="checkbox" className="size-4 accent-brand" checked={selected.has(r.id)}
                                    onChange={() => toggleRow(r.id)} onClick={(e) => e.stopPropagation()} />
                          </td>
                          <td className="py-3.5 pr-3">
                            <div className="flex items-center gap-2.5">
                              <span className="grid size-9 flex-none place-items-center rounded-full bg-indigo-100 text-xs font-bold text-brand">{r.initials}</span>
                              <div>
                                <p className="font-semibold">{r.name}</p>
                                <code className="text-[11px] text-slate-500">{r.id}</code>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-brand">{r.arm}</span>
                          </td>
                          <td className="py-3.5 pr-6">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold">{r.pct}%</span>
                              <span className={`text-xs font-medium ${r.gradeColor}`}>{r.grade}</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                              <div className={`h-full rounded-full ${barColor(r.pct)}`} style={{ width: `${r.pct}%` }} />
                            </div>
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${r.cleared ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                              {r.cleared ? <CircleCheck size={12}/> : <LockKeyhole size={12}/>} {r.ledger}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${r.sc}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span>Showing 1 to {rows.length} of 42 records (SSS 2 Cohort)</span>
                  <div className="flex items-center gap-2">
                    <button className="rounded-md bg-slate-100 p-1.5 hover:bg-slate-200" onClick={() => toast("Already on the first roster page")}><ChevronLeft size={14} /></button>
                    <span className="rounded-md bg-brand px-2.5 py-1 text-xs text-white">Page 1 of 9</span>
                    <button className="rounded-md bg-slate-100 p-1.5 hover:bg-slate-200" onClick={() => toast("Loading the next roster page...")}><ChevronRight size={14} /></button>
                  </div>
                </div>
              </section>
            </div>

            {/* right panel */}
            <aside className="flex flex-col gap-4">
              <section className="card">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">⟩⟨ Batch Promotion Impact</h2>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">LIVE SIMULATION</span>
                </div>
                <div className="mt-3 rounded-lg bg-indigo-50/80 px-3 py-2 text-xs font-medium">
                  Transition Track{" "}
                  <span className="ml-2 font-bold text-brand">{sourceClass.split(" (")[0]} → {targetCohort.split(" (")[0]} (2026/27)</span>
                </div>

                {[
                  { label: "Promoted", n: 36, pct: 85.7, bar: "bg-green-500", text: "text-green-700" },
                  { label: "Retained / Repeat", n: 4, pct: 9.5, bar: "bg-slate-400", text: "text-slate-600" },
                  { label: "Bursar Blocked", n: 2, pct: 4.8, bar: "bg-red-500", text: "text-red-600" },
                ].map((item) => (
                  <div key={item.label} className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${item.text}`}>{item.label}</span>
                      <span className={`font-bold ${item.text}`}>{item.n} Students ({item.pct}%)</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${item.bar}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[["Projected SSS 3 Gold", "22 Students", "91.6% Capacity"], ["Projected SSS 3", "18 Students", "75.0% Capacity"]].map(([l, n, c]) => (
                    <div key={l} className="rounded-lg bg-slate-50 p-2.5 text-xs">
                      <p className="text-slate-500">{l}</p>
                      <p className="mt-1 text-lg font-bold">{n}</p>
                      <p className="text-slate-400">{c}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-indigo-50 p-3">
                  <p className="text-xs text-slate-500">Projected Term 1 Tuition Invoiced</p>
                  <p className="text-xl font-bold">₦16,200,000.00</p>
                </div>
              </section>

              <section className="card">
                <h2 className="flex items-center gap-2 font-semibold"><CircleCheck size={16} className="text-green-600" /> Pre-Commit Checklist</h2>
                <div className="mt-3 flex flex-col gap-2">
                  {[
                    { icon: CircleCheck, label: "Senate Academic Approval", sub: "Validated by Principal Admin (Dr. D. Okoye)", color: "text-green-700" },
                    { icon: TriangleAlert, label: "Bursary Sync Warning", sub: "2 students flagged for uncollected Term 3 fees", color: "text-yellow-600" },
                    { icon: Mail, label: "Automated Parent Letters", sub: "36 SMS & Portal promotion slips queued", color: "text-blue-600" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-lg bg-slate-50 p-3">
                      <p className={`flex items-center gap-2 text-sm font-semibold ${c.color}`}><c.icon size={14} /> {c.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{c.sub}</p>
                    </div>
                  ))}
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 p-3 text-xs text-slate-600">
                  <input type="checkbox" className="mt-0.5 size-4 flex-none accent-brand" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                  I confirm that academic records and bursar clearances have been reviewed and validated according to MightyEd institutional promotion policy.
                </label>

                <button disabled={!confirmed}
                  className={`btn btn-primary mt-4 w-full justify-center ${!confirmed ? "opacity-50" : ""}`}
                  onClick={() => { setCommitted(true); toast("Promotion batch committed successfully!"); }}>
                  {committed ? "✓ Committed" : "Commit Promotion Batch →"}
                </button>
                <button className="mt-2 w-full rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50"
                  onClick={() => toast("Cancelled")}>
                  Cancel
                </button>
              </section>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}