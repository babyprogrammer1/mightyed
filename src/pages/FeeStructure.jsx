import { useState, useRef } from "react";
import { Download, Search, ChevronDown, CalendarDays, Copy, FileText, GraduationCap, Monitor, FlaskConical, Bot, Landmark, LockKeyhole } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";
import StatusFooter from "../components/StatusFooter.jsx";

const FEE_ITEMS = [
  { icon: GraduationCap, name: "Tuition & Academic Support", desc: "Core classroom instruction, continuous…", classes: "All Classes (JSS 1 – SSS 3)", amount: "₦250,000.00", type: "mandatory", selected: true },
  { icon: Monitor, name: "ICT Infrastructure & LMS Portal Access", desc: "High-speed campus fiber, cloud student portal…", classes: "All Classes (JSS 1 – SSS 3)", amount: "₦35,000.00", type: "mandatory", selected: true },
  { icon: FlaskConical, name: "Science Practical Materials & Consumables", desc: "Chemistry reagents, biology specimens, physics…", classes: "SSS 1, SSS 2, SSS 3 Only", amount: "₦25,000.00", type: "mandatory", selected: false },
  { icon: Bot, name: "Robotics & Coding Club", desc: "After-school robotics kit, LEGO Mindstorms &…", classes: "Optional Elective Selection", amount: "₦20,000.00", type: "elective", selected: true, optTag: "Optional Elective Selection" },
  { icon: GraduationCap, name: "Graduation Levy & Certificate Processing", desc: "Valedictory gown rental, yearbook, WAEC/NECO…", classes: "SSS 3 Only", amount: "₦50,000.00", type: "mandatory", selected: true },
];

const COHORTS = [
  { level: "JUNIOR SECONDARY", name: "JSS 1 Cohort", students: 210, amount: "₦285,000.00", desc: "Tuition ₦250k + ICT ₦35k", bar: 65, barColor: "bg-brand" },
  { level: "JUNIOR SECONDARY", name: "JSS 2 Cohort", students: 198, amount: "₦285,000.00", desc: "Tuition ₦250k + ICT ₦35k", bar: 65, barColor: "bg-brand" },
  { level: "JUNIOR SECONDARY", name: "JSS 3 Cohort", students: 204, amount: "₦300,000.00", desc: "Includes BECE Exam Levy ₦15k", bar: 70, barColor: "bg-brand" },
  { level: "SENIOR SECONDARY", name: "SSS 1 Cohort", students: 215, amount: "₦310,000.00", desc: "Tuition + ICT + Science ₦25k", bar: 75, barColor: "bg-purple-500" },
  { level: "SENIOR SECONDARY", name: "SSS 2 Cohort", students: 212, amount: "₦310,000.00", desc: "Tuition + ICT + Science ₦25k", bar: 75, barColor: "bg-purple-500" },
  { level: "SENIOR SECONDARY", name: "SSS 3 Cohort", students: 209, amount: "₦360,000.00", desc: "Includes Practicals + Grad ₦50k", bar: 90, barColor: "bg-purple-500" },
];

function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange}
      className={`relative h-6 w-11 flex-none rounded-full transition-colors ${on ? "bg-brand" : "bg-slate-300"}`}>
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function FeeStructure() {
  // Page flow: configure billable fee items and rules, review the preview, then save or publish the structure.
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState(FEE_ITEMS);
  const [discounts, setDiscounts] = useState({ sibling: true, earlyBird: true, staff: true });
  const [lateSurcharge, setLateSurcharge] = useState(true);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [q, setQ] = useState("");
  const [cohortFilter, setCohortFilter] = useState("All Cohorts");
  const [sortAsc, setSortAsc] = useState(true);
  const [currency, setCurrency] = useState("NGN (₦)");
  const [allSelected, setAllSelected] = useState(false);
  const [session, setSession] = useState("2026/2027 Academic Session");
  const [billingTerm, setBillingTerm] = useState("Term 1 (First Term)");

  const toggleItem = (idx) => setItems(items.map((it, i) => i === idx ? { ...it, selected: !it.selected } : it));
  const filtered = items.filter((it) => {
    if (q && !it.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (cohortFilter === "Junior" && !it.classes.includes("JSS")) return false;
    if (cohortFilter === "Senior" && !it.classes.includes("SSS")) return false;
    if (tab === "mandatory") return it.type === "mandatory";
    if (tab === "elective") return it.type === "elective";
    return true;
  }).sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const toggleAll = () => {
    setAllSelected((value) => !value);
    setItems((current) => current.map((item) => ({ ...item, selected: !allSelected })));
  };

  return (
    <div className="-m-4 sm:-m-6 flex min-h-screen flex-col">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label: "Academics" }, { label: "Fee Management" }, { label: "Fee Structure & Billing" }]} />
      </div>

      <div className="flex-1 bg-indigo-50/70 p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Fee Structure & Billing</h1>
            <p className="mt-1 text-sm text-slate-500">Configure termly fee items, class-level billing structures, early-bird/sibling discounts, and automatic invoice generation rules</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button className="btn btn-ghost" onClick={() => toast("Duplicating fee structure...")}><Copy size={14} /> Duplicate Fee Structure</button>
            <button className="btn btn-ghost" onClick={() => toast("Publishing & invoicing...")}><FileText size={14} /> Publish & Invoices</button>
            <button className="btn btn-primary" onClick={() => toast("Opening fee category form...")}>+ Add Fee Category</button>
          </div>
        </div>

        {/* status bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm shadow-sm">
          <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
          <CalendarDays size={14} /> Session:
          <select className="bg-transparent outline-none" value={session} onChange={(e) => { setSession(e.target.value); toast(`Showing ${e.target.value}`); }}><option>2026/2027 Academic Session</option><option>2025/2026 Academic Session</option></select>
          </label>
          <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
          Billing:
          <select className="bg-transparent outline-none" value={billingTerm} onChange={(e) => { setBillingTerm(e.target.value); toast(`Showing ${e.target.value}`); }}><option>Term 1 (First Term)</option><option>Term 2 (Second Term)</option><option>Term 3 (Third Term)</option></select>
          </label>
          <div className="flex gap-1 rounded-lg border border-slate-200 overflow-hidden">
          {["NGN (₦)", "USD ($)"].map((option) => <button key={option} onClick={() => setCurrency(option)} className={`${currency === option ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-50"} px-3 py-1.5 text-sm`}>{option}</button>)}
          </div>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            <span className="size-2 rounded-full bg-orange-500" /> DRAFT — NOT YET PUBLISHED
          </span>
        </div>

        {/* stats */}
        <div className="mb-5 flex flex-wrap items-center gap-6 text-sm">
          <span><b className="font-bold text-brand">5</b> Active Fee Items</span>
          <span className="text-slate-300">•</span>
          <span><b className="font-bold">3</b> Auto Rules</span>
          <span className="text-slate-300">•</span>
          <span><b className="font-bold">1,248</b> Target Students</span>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-5">
            {/* fee items card */}
            <section className="card overflow-hidden p-0">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <label className="flex flex-1 min-w-48 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-500">
                  <Search size={15} />
                  <input className="flex-1 bg-transparent text-sm text-ink outline-none" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
                </label>
                <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                  {[["all","All Items (5)"],["mandatory","Mandatory (4)"],["elective","Elective (1)"]].map(([k,l])=>(
                    <button key={k} onClick={() => setTab(k)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${tab === k ? "bg-white text-brand shadow-sm" : "text-slate-600"}`}>
                      {l}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600" onClick={() => setCohortFilter((value) => value === "All Cohorts" ? "Junior" : value === "Junior" ? "Senior" : "All Cohorts")}>🔽 {cohortFilter}</button>
                <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600" onClick={() => setSortAsc((value) => !value)}>↕ Sort {sortAsc ? "A-Z" : "Z-A"}</button>
              </div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="py-3 pl-4 text-left"><input type="checkbox" className="size-4 accent-brand" checked={allSelected} onChange={toggleAll} /></th>
                    <th className="py-3 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Fee Item & Category</th>
                    <th className="py-3 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Applicable Classes</th>
                    <th className="py-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">Amount (₦)</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((it, i) => (
                    <tr key={it.name} className={`border-t border-slate-100 ${it.selected ? "bg-indigo-50/40" : ""}`}>
                      <td className="py-3.5 pl-4"><input type="checkbox" className="size-4 accent-brand" checked={it.selected} onChange={() => toggleItem(items.indexOf(it))} /></td>
                      <td className="py-3.5 pr-3">
                        <div className="flex items-start gap-2.5">
                          <span className="grid size-8 flex-none place-items-center rounded-lg bg-brand-light text-brand"><it.icon size={16}/></span>
                          <div>
                            <p className="font-semibold">{it.name}</p>
                            <p className="text-xs text-slate-500">{it.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${it.type === "elective" ? "bg-orange-100 text-orange-700" : "bg-blue-50 text-blue-700"}`}>
                          {it.classes}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-right font-bold">{it.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-slate-100 p-4">
                <button className="text-sm font-semibold text-brand hover:underline" onClick={() => toast("Adding sub-item...")}>+ Add Sub-Item to Bill</button>
              </div>
            </section>

            {/* cohort breakdown */}
            <section className="card">
              <h2 className="mb-1 font-semibold">Class Cohort Total Invoiced Breakdown</h2>
              <p className="mb-4 text-xs text-slate-500">Estimated invoice total per enrolled student before discretionary discounts.</p>
              <div className="mb-3 flex gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-brand" /> Tuition</span>
                <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-blue-400" /> Tech/Portal</span>
                <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-slate-300" /> Levies/Practicals</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {COHORTS.map((c) => (
                  <div key={c.name} className="rounded-xl border border-slate-200 p-3">
                    <p className={`text-[11px] font-semibold uppercase tracking-wide mb-0.5 ${c.level === "SENIOR SECONDARY" ? "text-purple-600" : "text-blue-600"}`}>{c.level}</p>
                    <p className="text-sm font-semibold mb-0.5">{c.name}</p>
                    <p className="text-xs text-slate-500 mb-1">{c.students} Students</p>
                    <p className="text-xl font-bold">{c.amount}</p>
                    <p className="text-xs text-slate-500 mb-2">{c.desc}</p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${c.barColor}`} style={{ width: `${c.bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* right panel */}
          <aside className="flex flex-col gap-4">
            <section className="card">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">🎟 Automated Discounts</h2>
                <button className="link text-xs" onClick={() => toast("Adding discount rule...")}>+ Add Rule</button>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { key: "sibling", label: "Sibling Concession Discount", desc: "10% off Tuition for 3rd child onwards of the same parent account.", extra: "Auto-detected NIN Link", stat: "Est. 48 Students (–₦1.2M)", statColor: "text-green-600" },
                  { key: "earlyBird", label: "Early Bird Payment Incentive", desc: "₦15,000 flat discount if fees are paid in full 14 days before resumption.", extra: "Valid until: 28 Aug 2026", stat: "Est. 310 Early Payers", statColor: "text-green-600" },
                  { key: "staff", label: "Staff Dependent Subsidy", desc: "50% waiver on Tuition for confirmed full-time school faculty dependents.", extra: "Linked to HR EMP ID", stat: "18 Children (~₦2.25M)", statColor: "text-green-600" },
                ].map((d) => (
                  <div key={d.key} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold">{d.label}</p>
                      <Toggle on={discounts[d.key]} onChange={() => setDiscounts({ ...discounts, [d.key]: !discounts[d.key] })} />
                    </div>
                    <p className="text-xs text-slate-500 mb-1.5">{d.desc}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{d.extra}</span>
                      <span className={`font-medium ${d.statColor}`}>{d.stat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Landmark size={15} className="text-brand"/> Billing & Gateway Enforcements</h2>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Active Bursary Channels</p>
              <div className="mb-3 grid grid-cols-2 gap-2">
                {["Paystack","Flutterwave","Monnify","Zenith NIBSS"].map((g) => (
                  <div key={g} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2">
                    <span className="size-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium">{g}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-indigo-50/80 p-3 mb-3">
                <p className="text-xs font-semibold text-brand mb-1">INSTALLMENT POLICY</p>
                <p className="text-xs text-slate-600">Minimum 40% First Deposit required before resumption clearance; remaining 40% due by Mid-Term Break.</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold">Late Payment Surcharge</p>
                  <p className="text-xs text-slate-500">5% surcharge 14 calendar days post-due</p>
                </div>
                <Toggle on={lateSurcharge} onChange={() => setLateSurcharge(!lateSurcharge)} />
              </div>
              <div className="rounded-xl border border-slate-200 p-3 mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Term Invoice Due Date</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><CalendarDays size={14} className="text-brand"/><span className="font-bold">15 October 2026</span></div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">45 Days Out</span>
                </div>
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs">
                  <input type="checkbox" className="accent-brand" checked={autoDispatch} onChange={() => setAutoDispatch(!autoDispatch)} />
                  Auto-dispatch SMS & Email Invoices immediately on publish.
                </label>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Revenue Forecast <span className="ml-1 rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">Term 1 Final</span></p>
                <div className="space-y-1 text-sm mb-1">
                  <div className="flex justify-between"><span className="text-slate-500">Projected Gross Billing:</span><span className="font-semibold">₦385,500,000.00</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Est. Automated Deductions:</span><span className="font-semibold text-red-600">-₦3,450,000.00</span></div>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <p className="text-xs text-slate-500 mb-0.5">NET TARGET REVENUE: 1,248 Enrollees</p>
                  <p className="text-2xl font-bold text-brand">₦382,050,000.00</p>
                </div>
              </div>
              <button className="btn btn-primary mt-4 w-full justify-center" onClick={() => toast("Publishing fee structure...")}>Publish Fee Structure →</button>
              <button className="mt-2 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => toast("Saving draft...")}>Save as Draft & Review</button>
              <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] text-slate-400"><LockKeyhole size={11}/> Locked upon publishing. Modifications after invoice dispatch require Senate Bursary authorization.</p>
            </section>
          </aside>
        </div>
      </div>
      <StatusFooter />
    </div>
  );
}