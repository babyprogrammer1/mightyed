import { useState } from "react";
import { Download, ChevronRight, Calendar, RefreshCw, Megaphone, CircleCheck, Landmark } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";
import StatusFooter from "../components/StatusFooter.jsx";

const CLASS_ROWS = [
  { name: "Senior Secondary 3 (SSS 3)", students: 209, pct: 91, collected: "₦62.1M", target: "₦68.2M", overdue: "₦6,100,000 Overdue (19 Students)", badge: "Top Performing", bc: "bg-green-100 text-green-700", bar: "bg-green-500", oc: "text-orange-500" },
  { name: "Senior Secondary 2 (SSS 2)", students: 212, pct: 78, collected: "₦48.36M", target: "₦62.0M", overdue: "₦13,640,000 Overdue (46 Students)", badge: null, bar: "bg-green-500", oc: "text-orange-500" },
  { name: "Senior Secondary 1 (SSS 1)", students: 215, pct: 75, collected: "₦49.91M", target: "₦66.5M", overdue: "₦16,637,500 Overdue (54 Students)", badge: null, bar: "bg-green-500", oc: "text-orange-500" },
  { name: "Junior Secondary 3 (JSS 3)", students: 204, pct: 81, collected: "₦49.57M", target: "₦61.2M", overdue: "₦11,628,000 Overdue (38 Students)", badge: null, bar: "bg-green-500", oc: "text-orange-500" },
  { name: "Junior Secondary 2 (JSS 2)", students: 198, pct: 64, collected: "₦38.4M", target: "₦60.0M", overdue: "₦21,600,000 Overdue (71 Students – Priority)", badge: "Action Required", bc: "bg-orange-100 text-orange-700", bar: "bg-yellow-500", oc: "text-red-500" },
  { name: "Junior Secondary 1 (JSS 1)", students: 210, pct: 82, collected: "₦50.2M", target: "₦61.2M", overdue: "₦11,000,000 Overdue (37 Students)", badge: null, bar: "bg-green-500", oc: "text-orange-500" },
];

const DEFAULTERS = [
  { i: "AI", name: "Abubakar Ibrahim", id: "MIS/2024/0091", cls: "JSS 3B", days: 28, dc: "bg-red-100 text-red-600", balance: "₦150,000.00" },
  { i: "OC", name: "Okafor Chinedu", id: "MIS/2023/0312", cls: "SSS 1A", days: 21, dc: "bg-orange-100 text-orange-600", balance: "₦220,000.00" },
  { i: "DM", name: "Danjuma Mary", id: "MIS/2025/0114", cls: "JSS 1C", days: 18, dc: "bg-yellow-100 text-yellow-700", balance: "₦110,000.00" },
];

const AUDIT = [
  { amt: "₦285,000.00", time: "2 mins ago", name: "Adebayo Samuel (SSS 2 Gold)", ch: "Paystack Online", inv: "INV-2026-0891", dot: "bg-brand", cc: "bg-blue-100 text-blue-700" },
  { amt: "₦150,000.00", time: "18 mins ago", name: "Okonkwo Chidimma (JSS 2 Ruby)", ch: "Bank Transfer Zenith", extra: "Bursar Lawal approved", dot: "bg-brand", cc: "bg-slate-100 text-slate-700" },
  { amt: "₦15,000.00 Waiver", time: "1 hr ago", name: "Early Bird Discount: Ekaette Blessing", ch: "Auto-Rule Applied", dot: "bg-green-500", cc: "bg-green-100 text-green-700", waiver: true },
  { amt: "₦310,000.00", time: "2 hrs ago", name: "Balogun Faroug (SSS 1 Diamond)", ch: "Monnify Gateway", inv: "INV-2026-0814", dot: "bg-brand", cc: "bg-purple-100 text-purple-700" },
];

export default function FeeOverview() {
  // Page flow: inspect collection health, act on gateway and defaulter queues, and track each local financial action.
  const toast = useToast();
  const [session, setSession] = useState("2026/2027 Session - Term 1");
  const [selectedClass, setSelectedClass] = useState(null);
  const [settled, setSettled] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [lastPolled, setLastPolled] = useState("4 mins ago");
  const [invoiceIssued, setInvoiceIssued] = useState(false);
  const [remindersSent, setRemindersSent] = useState(0);
  const [reportExported, setReportExported] = useState(false);
  const [showAllDefaulters, setShowAllDefaulters] = useState(false);
  const [remindedIds, setRemindedIds] = useState([]);
  return (
    <div className="-m-4 sm:-m-6 flex min-h-screen flex-col">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label: "Fee Management & Financials" }, { label: "Fee Management Overview" }]} />
      </div>
      <div className="flex-1 bg-indigo-50/70 p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Fee Management</h1>
            <p className="mt-1 text-sm text-slate-500">Real-time fee collection analytics, revenue trends, payment gateway reconciliations, and defaulter tracking.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <label className="btn btn-ghost flex items-center gap-2 text-sm">
              <Calendar size={14} />
              <select value={session} className="cursor-pointer bg-transparent outline-none" onChange={(event) => {
                setSession(event.target.value);
                toast(`Showing ${event.target.value}`);
              }}>
                <option>2026/2027 Session - Term 1</option>
                <option>2026/2027 Session - Term 2</option>
                <option>2025/2026 Session - Term 3</option>
              </select>
            </label>
            <button className="btn btn-ghost" onClick={() => { setReportExported(true); toast("Financial report exported"); }}><Download size={14} /> {reportExported ? "Report Exported" : "Export Financial Report"}</button>
            <button className="btn btn-primary" onClick={() => { setInvoiceIssued(true); toast("Invoice issued successfully"); }}>{invoiceIssued ? "Invoice Issued" : "+ Issue Single Invoice"}</button>
          </div>
        </div>

        <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Billed Revenue", value: "₦385,500,000.00", sub: "1,248 Active Invoices", badge: "Term 1 Forecast", bc: "bg-blue-100 text-blue-700" },
            { label: "Total Collected Revenue", value: "₦298,200,000.00", sub: "+77.3% Collection Rate (+4.2%)", sc: "text-green-600" },
            { label: "Total Outstanding Overdue", value: "₦87,300,000.00", vc: "text-orange-600", sub: "214 Accounts Need Follow-up", sc: "text-blue-600" },
            { label: "Discounts & Concessions", value: "₦3,450,000.00", sub: "Approved Waivers", sc: "text-purple-600" },
          ].map((s, i) => (
            <div key={i} className="card">
              <p className="mb-2 text-xs text-slate-500">{s.label}</p>
              <p className={`text-lg font-bold leading-tight ${s.vc ?? ""}`}>{s.value}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <small className={`text-xs ${s.sc ?? "text-slate-500"}`}>{s.sub}</small>
                {s.badge && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.bc}`}>{s.badge}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-5">
            <section className="card">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">Fee Collection Status by Class Level</h2>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-brand">Secondary Wing</span>
                  <p className="mt-1 text-xs text-slate-500">Comparative intake targets versus outstanding receivables per grade tier</p>
                </div>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-green-500" /> Collected (₦298.2M)</span>
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-orange-400" /> Outstanding (₦87.3M)</span>
                  <span className="font-semibold text-slate-700">Amount (₦)</span>
                  <span className="font-semibold text-slate-700">Percentage (%)</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {CLASS_ROWS.map((c) => (
                  <button type="button" key={c.name} className={`w-full rounded-xl p-3 text-left hover:bg-indigo-50/60 cursor-pointer ${selectedClass === c.name ? "bg-indigo-100 ring-2 ring-brand" : "bg-slate-50"}`} onClick={() => { setSelectedClass(c.name); toast(`Viewing ${c.name} fee details...`); }}>
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{c.name}</span>
                        <span className="text-xs text-slate-500">{c.students} Students</span>
                        {c.badge && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.bc}`}>{c.badge}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">{c.pct}%</span>
                        <span className="text-xs text-slate-500">{c.collected}/{c.target}</span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                    </div>
                    <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <div className="flex justify-between">
                      <p className="text-xs font-medium text-green-600">{c.collected} Collected</p>
                      <p className={`text-xs font-medium ${c.oc}`}>{c.overdue}</p>
                    </div>
                  </button>
                ))}
              </div>
              {selectedClass && <p className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs text-brand">
                Showing details for <strong>{selectedClass}</strong>. Select another class to change this view.
              </p>}
            </section>

            <section className="card">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold">Payment Gateways & Settlement Reconciliation</h2>
                  <p className="text-xs text-slate-500">Real-time status of merchant integrations, clearing accounts, and daily bank sweeps</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                  <span className="size-1.5 rounded-full bg-green-500" /> Live Uptime 99.98%
                </span>
              </div>
              <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative size-40">
                    <svg viewBox="0 0 160 160" className="size-40 -rotate-90">
                      <circle cx="80" cy="80" r="55" fill="none" stroke="#b44cf5" strokeWidth="22" strokeDasharray={`${2*Math.PI*55*.65} ${2*Math.PI*55}`} />
                      <circle cx="80" cy="80" r="55" fill="none" stroke="#3b82f6" strokeWidth="22" strokeDasharray={`${2*Math.PI*55*.25} ${2*Math.PI*55}`} strokeDashoffset={`${-(2*Math.PI*55*.65)}`} />
                      <circle cx="80" cy="80" r="55" fill="none" stroke="#94a3b8" strokeWidth="22" strokeDasharray={`${2*Math.PI*55*.10} ${2*Math.PI*55}`} strokeDashoffset={`${-(2*Math.PI*55*.90)}`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="text-xs text-slate-500">Total Cleared</p>
                      <p className="text-lg font-bold leading-tight">₦298.2M</p>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">SETTLED</span>
                    </div>
                  </div>
                  <div className="w-full space-y-1 text-xs">
                    {[["bg-brand","Online Gateway (Paystack/Flw)","65% (₦193.8M)"],["bg-blue-500","Direct Bank Transfer (Zenith)","25% (₦74.6M)"],["bg-slate-400","POS / Cash Bursary Ledger","10% (₦29.8M)"]].map(([c,l,v])=>(
                      <div key={l} className="flex items-center gap-2"><i className={`size-2.5 flex-none rounded-sm ${c}`} /><span className="flex-1 text-slate-600">{l}</span><span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm font-semibold"><Landmark size={14} className="text-brand"/> Paystack Merchant Balance</span>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">Ready for Payout</span>
                    </div>
                    <p className="text-xl font-bold">{settled ? "₦0.00" : "₦18,450,000.00"}</p>
                    <p className="mb-2 text-xs text-slate-500">{settled ? "Settlement completed" : "Automatic transfer queued for 23:59 WAT"}</p>
                    <button className="btn btn-primary btn-sm w-full justify-center" disabled={settled} onClick={() => { setSettled(true); toast("Settlement initiated..."); }}>{settled ? "Settled" : "Settle Now"}</button>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold text-sm">Manual Bank Receipts Pending</span>
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">Requires Approval</span>
                    </div>
                    <p className="text-lg font-bold text-orange-600">14 Receipts Uploaded</p>
                    <p className="mb-2 text-xs text-slate-500">Total unconfirmed sum: ₦4,120,000.00</p>
                    <button className="btn btn-ghost btn-sm w-full justify-center" onClick={() => { setQueueOpen(true); toast("Opening review queue..."); }}>{queueOpen ? "Queue Opened" : "Review Queue"}</button>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">⚡ Flutterwave Gateway Webhook</span>
                          <span className="size-2 rounded-full bg-green-500" />
                        </div>
                        <p className="text-xs font-medium text-green-600">Synchronized & Active</p>
                        <p className="text-xs text-slate-500">Last polled {lastPolled} (Response 128ms)</p>
                      </div>
                      <button className="icon-btn text-brand" onClick={() => { setLastPolled("just now"); toast("Refreshing webhook..."); }} aria-label="Refresh webhook"><RefreshCw size={15}/></button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-4">
            <section className="card">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-sm font-semibold">{showAllDefaulters ? "All Outstanding Defaulters" : "Top Outstanding Defaulters"}</h2>
                <button className="link text-xs" onClick={() => { setShowAllDefaulters(true); toast("Showing all 214 defaulters..."); }}>{showAllDefaulters ? "Showing All" : "All 214 →"}</button>
              </div>
              <p className="mb-3 text-xs text-slate-500">Overdue &gt;14 days post-resumption deadline</p>
              <div className="flex flex-col gap-3">
                {DEFAULTERS.map((d) => (
                  <div key={d.id} className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="grid size-9 flex-none place-items-center rounded-full bg-indigo-100 text-xs font-bold text-brand">{d.i}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-sm font-semibold truncate">{d.name}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${d.dc}`}>{d.days}d Overdue</span>
                        </div>
                        <p className="text-xs text-slate-500">{d.id} • {d.cls}</p>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Outstanding Balance</p>
                        <p className="text-lg font-bold text-brand">{d.balance}</p>
                      </div>
                      <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50"
                        onClick={() => { setRemindersSent((count) => count + 1); setRemindedIds((ids) => ids.includes(d.id) ? ids : [...ids, d.id]); toast(`Reminder sent to ${d.name}`); }}>
                        {remindedIds.includes(d.id) ? <><CircleCheck size={12}/> Reminder Sent</> : "Send Reminder"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-3 w-full justify-center"
                onClick={() => { setRemindersSent(214); toast("Broadcasting reminders to all 214 defaulters..."); }}>
                {remindersSent === 214 ? <><CircleCheck size={14}/> Reminders Broadcast</> : <><Megaphone size={14}/> Broadcast Reminder to All</>}
              </button>
            </section>

            <section className="card">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Live Payment Audit Log</h2>
                <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="size-2 rounded-full bg-green-500" /> Today</span>
              </div>
              <ul className="relative flex flex-col gap-4 pl-5 before:absolute before:bottom-2 before:left-2 before:top-1 before:w-0.5 before:bg-slate-200">
                {AUDIT.map((a, i) => (
                  <li key={i} className="relative">
                    <span className={`absolute -left-5 top-1 size-2.5 rounded-full ring-2 ring-white ${a.dot}`} />
                    <p className={`text-sm font-bold ${a.waiver ? "text-green-600" : ""}`}>{a.amt}</p>
                    <p className="text-xs text-slate-600">{a.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${a.cc}`}>{a.ch}</span>
                      {a.inv && <span className="text-[10px] text-slate-400">{a.inv}</span>}
                      {a.extra && <span className="text-[10px] text-slate-500">{a.extra}</span>}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">{a.time}</p>
                  </li>
                ))}
              </ul>
              <button className="mt-3 w-full text-center text-xs font-semibold text-brand hover:underline"
                onClick={() => toast("Opening complete bursary ledger...")}>
                View Complete Bursary Ledger →
              </button>
            </section>
          </aside>
        </div>
      </div>
      <StatusFooter />
    </div>
  );
}