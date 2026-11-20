import { useState } from "react";
import { Download, Search, ChevronDown, X, Megaphone, UserRound, Phone, Mail, Smartphone, Send } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";
import StatusFooter from "../components/StatusFooter.jsx";

const ROWS = [
  { i:"AI", name:"Abubakar Ibrahim", id:"MIS/2024/0091", cls:"JSS 3B", cc:"bg-indigo-100 text-brand", parent:"Mallam Yusuf Abubakar", phone:"0805 444 1122", email:"y.abubakar@gmail.com", inv:"INV-2026-0042", date:"02 Sept 2026", billed:"₦300,000", paid:"₦150,000", balance:"₦150,000", bc:"text-red-600", severity:"critical", days:28 },
  { i:"OC", name:"Okafor Chinedu", id:"MIS/2024/0310", cls:"SSS 1 Gold", cc:"bg-orange-100 text-orange-700", parent:"Mr. Emeka Okafor", phone:"0803 111 9988", email:"e.okafor@gmail.com", inv:"INV-2026-0188", date:"02 Sept 2026", billed:"₦310,000", paid:"₦0.00", balance:"₦310,000", bc:"text-red-600", severity:"critical", days:21 },
  { i:"OC", name:"Okonkwo Chidimma", id:"MIS/2024/0188", cls:"SSS 2 Gold", cc:"bg-purple-100 text-purple-700", parent:"Mrs. Grace Okonkwo", phone:"0802 987 6543", email:"g.okonkwo@gmail.com", inv:"INV-2026-0512", date:"02 Sept 2026", billed:"₦310,000", paid:"₦260,000", balance:"₦50,000", bc:"text-orange-500", severity:"partial", days:14 },
  { i:"AS", name:"Adebayo Samuel", id:"MIS/2024/0142", cls:"SSS 2 Gold", cc:"bg-green-100 text-green-700", parent:"Dr. Kunle Adebayo", phone:"0803 123 4567", email:"k.adebayo@gmail.com", inv:"INV-2026-0891", date:"02 Sept 2026", billed:"₦310,000", paid:"₦310,000", balance:"₦0.00", bc:"text-green-600", severity:"clear", days:0 },
  { i:"DM", name:"Danjuma Mary", id:"MIS/2025/0114", cls:"JSS 1 Silver", cc:"bg-indigo-100 text-brand", parent:"Alh. Kabir Danjuma", phone:"0807 555 3344", email:"k.danjuma@gmail.com", inv:"INV-2026-0744", date:"02 Sept 2026", billed:"₦285,000", paid:"₦175,000", balance:"₦110,000", bc:"text-red-600", severity:"critical", days:18 },
];

export default function InvoiceDefaulters() {
  // Page flow: filter overdue invoices, inspect a selected account, and dispatch individual or bulk notices.
  const toast = useToast();
  const [tab, setTab] = useState("defaulters");
  const [selected, setSelected] = useState(ROWS[0]);
  const [q, setQ] = useState("");
  const [channel, setChannel] = useState({ sms: true, portal: true, email: true });
  const [template, setTemplate] = useState("Notice 2: Final Warning Before Portal Restriction");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [durationFilter, setDurationFilter] = useState("Overdue > 14 Days");
  const [statusFilter, setStatusFilter] = useState("Overdue / Defaulter");
  const [selectedIds, setSelectedIds] = useState(new Set([ROWS[0].id]));
  const filteredRows = ROWS.filter((row) => {
    const matchesQuery = !q || `${row.name} ${row.id} ${row.inv}`.toLowerCase().includes(q.toLowerCase());
    const matchesClass = classFilter === "All Classes" || row.cls.includes(classFilter);
    const matchesDuration =
      durationFilter === "All durations" ||
      (durationFilter === "Overdue > 14 Days" && row.days > 14) ||
      (durationFilter === "Overdue > 21 Days" && row.days > 21) ||
      (durationFilter === "1–14 Days" && row.days >= 1 && row.days <= 14);
    const matchesStatus =
      statusFilter === "All statuses" ||
      (statusFilter === "Overdue / Defaulter" && row.days > 0) ||
      (statusFilter === "Critical" && row.severity === "critical") ||
      (statusFilter === "Partial" && row.severity === "partial") ||
      (statusFilter === "Cleared" && row.severity === "clear");
    const matchesTab =
      tab === "all" ||
      (tab === "defaulters" && row.days > 0) ||
      (tab === "approvals" && row.severity === "partial");
    return matchesQuery && matchesClass && matchesDuration && matchesStatus && matchesTab;
  });
  const toggleSelected = (id) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="-m-4 sm:-m-6 flex min-h-screen flex-col">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label: "Academics" }, { label: "Fee Management" }, { label: "Invoice & Defaulters Management" }]} />
      </div>

      <div className="flex-1 bg-indigo-50/70 p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Invoice & Defaulters Management</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-500">Track individual student fee billing, view paid vs. outstanding ledger balances, batch-generate termly invoices, and issue automated reminders to fee defaulters.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button className="btn btn-ghost" onClick={() => toast("Exporting defaulters list...")}><Download size={14} /> Export Defaulters</button>
            <button className="btn btn-ghost" onClick={() => toast("Broadcasting bulk reminders...")}><Megaphone size={14} /> Broadcast Bulk Reminders</button>
            <button className="btn btn-primary" onClick={() => toast("Generating term invoices...")}>+ Generate Term Invoices</button>
          </div>
        </div>

        <div className="mb-5 grid gap-5 sm:grid-cols-3">
          <div className="card"><p className="text-xs text-slate-500 mb-1">Total Overdue Amount</p><p className="text-2xl font-bold text-orange-600">₦87,300,000.00</p><p className="text-xs text-slate-500 mt-1">Across 214 Student Accounts (22.7% of term total)</p></div>
          <div className="card"><p className="text-xs text-slate-500 mb-1">Critical Defaulters (&gt;30 Days)</p><p className="text-2xl font-bold text-red-600">48 Critical Accounts</p><p className="text-xs text-slate-500 mt-1">Cumulative Overdue Balance: ₦24,800,000.00</p></div>
          <div className="card"><p className="text-xs text-slate-500 mb-1">Automated Reminders Dispatched</p><p className="text-2xl font-bold">542 Alerts Issued</p><p className="text-xs text-slate-500 mt-1">380 SMS • 162 Emails • 42 Agreements</p></div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-4">
            {/* tabs + search */}
            <div className="card p-0 overflow-hidden">
              <div className="flex border-b border-slate-200">
                {[["all","All Invoices (1,248)"],["defaulters","Defaulters & Overdue 214"],["approvals","Approvals Queue"]].map(([k,l])=>(
                  <button key={k} onClick={() => setTab(k)}
                    className={`flex-1 py-3 text-sm font-medium ${tab===k?"border-b-2 border-brand text-brand bg-indigo-50/50":"text-slate-600 hover:bg-slate-50"}`}>
                    {l}{k==="approvals"&&<span className="ml-1 size-2 inline-block rounded-full bg-red-500" />}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 p-3">
                <label className="flex flex-1 min-w-48 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500">
                  <Search size={15} /><input className="flex-1 bg-transparent text-sm text-ink outline-none" placeholder="Search student, adm ID, invoice…" value={q} onChange={(e)=>setQ(e.target.value)} />
                </label>
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
                  <option>All Classes</option><option>JSS 1</option><option>JSS 3</option><option>SSS 1</option><option>SSS 2</option>
                </select>
                <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
                  <option>Overdue &gt; 14 Days</option>
                  <option>Overdue &gt; 21 Days</option>
                  <option>1–14 Days</option>
                  <option>All durations</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
                  <option>Overdue / Defaulter</option>
                  <option>Critical</option>
                  <option>Partial</option>
                  <option>Cleared</option>
                  <option>All statuses</option>
                </select>
                <button className="icon-btn" onClick={() => toast("Filters are applied automatically")}><ChevronDown size={15} /></button>
              </div>
            </div>

            <section className="card overflow-hidden p-0">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">Filtered Ledger Records</span>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-brand">{filteredRows.length} Matching Accounts</span>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-red-500" /> Critical Overdue (&gt;21d)</span>
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-orange-400" /> Partial Balance</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200">
                      <th className="py-3 pl-4"><input type="checkbox" className="size-4 accent-brand" checked={filteredRows.length > 0 && filteredRows.every((row) => selectedIds.has(row.id))} onChange={() => {
                        const allSelected = filteredRows.every((row) => selectedIds.has(row.id));
                        setSelectedIds((current) => {
                          const next = new Set(current);
                          filteredRows.forEach((row) => allSelected ? next.delete(row.id) : next.add(row.id));
                          return next;
                        });
                      }} /></th>
                      {["STUDENT RECORD ↕","PARENT CONTACT","INVOICE REF","BILLED","PAID","BALANCE DUE ↓"].map(h=>(
                        <th key={h} className="py-3 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((r)=>(
                      <tr key={r.id} onClick={()=>setSelected(r)}
                        className={`border-t border-slate-100 cursor-pointer ${selected?.id===r.id?"bg-blue-50":r.severity==="critical"?"bg-red-50/30":"hover:bg-slate-50"}`}>
                        <td className="py-3 pl-4" onClick={e=>e.stopPropagation()}>
                          <input type="checkbox" className="size-4 accent-brand" checked={selectedIds.has(r.id)} onChange={()=>{ toggleSelected(r.id); setSelected(r); }} />
                        </td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`grid size-9 flex-none place-items-center rounded-full text-xs font-bold ${r.cc}`}>{r.i}</span>
                            <div>
                              <p className="font-semibold">{r.name}</p>
                              <code className="text-[11px] text-slate-500">{r.id}</code>
                              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${r.severity==="critical"?"bg-red-100 text-red-600":"bg-orange-100 text-orange-600"}`}>• {r.cls}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-sm">{r.parent}<br /><span className="text-xs text-slate-500">{r.phone}</span></td>
                        <td className="py-3 pr-3"><p className="font-mono text-xs font-semibold text-brand">{r.inv}</p><p className="text-xs text-slate-500">{r.date}</p></td>
                        <td className="py-3 pr-3 font-semibold">{r.billed}</td>
                        <td className="py-3 pr-3 font-semibold text-green-600">{r.paid}</td>
                        <td className={`py-3 pr-3 font-bold ${r.bc}`}>{r.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 p-3">
                <span className="text-sm text-slate-500">Showing {filteredRows.length} matching defaulter records</span>
                <div className="flex items-center gap-2">
                  <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"><option>10 per page</option></select>
                  <div className="flex gap-1">
                    {["1","2","3","…","22","›"].map(p=>(
                      <button key={p} onClick={() => toast(`Opening invoice page ${p}`)} className={`rounded-md px-2.5 py-1.5 text-xs ${p==="1"?"bg-brand text-white":"bg-slate-100"}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* right panel */}
          {selected && (
            <aside className="card flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  <div>
                    <h2 className="font-bold">Direct Payment Notice</h2>
                    <p className="text-xs text-slate-500">1 Student Account Target</p>
                  </div>
                </div>
                <button className="icon-btn" onClick={() => setSelected(null)}><X size={16} /></button>
              </div>

              <div className="rounded-xl bg-indigo-50/80 p-3">
                <div className="flex items-start gap-2.5 mb-2">
                  <span className={`grid size-10 flex-none place-items-center rounded-full text-sm font-bold ${selected.cc}`}>{selected.i}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{selected.name}</p>
                      {selected.days > 0 && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">{selected.days} Days Overdue</span>}
                    </div>
                    <p className="text-xs text-slate-500">Class: {selected.cls} • Adm: {selected.id}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-600"><UserRound size={12} /> Parent: {selected.parent}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-600"><Phone size={12} /> Phone: {selected.phone}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-600"><Mail size={12} /> Email: {selected.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Overdue Ledger Balance</p>
                  <div className="flex items-end justify-between">
                    <p className="text-xl font-bold text-brand">{selected.balance}</p>
                    <div className="text-right text-xs text-slate-500"><p>Billed: {selected.billed}</p><p>Deposit: {selected.paid}</p></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Inv #{selected.inv} (Term 1 Balance)</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Delivery Channels</p>
                <div className="space-y-2">
                  {[["sms","Priority SMS Alert","("+selected.phone+")","bg-blue-500"],["portal","In-App Parent Portal Notification Push","","bg-indigo-500"],["email","Official Email Dispatch with PDF Invoice","","bg-blue-400"]].map(([k,l,s,c])=>(
                    <label key={k} className="flex cursor-pointer items-center gap-2.5 text-sm">
                      <input type="checkbox" className="size-4 accent-brand" checked={channel[k]} onChange={()=>setChannel({...channel,[k]:!channel[k]})} />
                      <span className={`grid size-5 flex-none place-items-center rounded text-white ${c}`}><Smartphone size={11} /></span>
                      <span>{l} {s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Standard Notice Template</p>
                <select className="input w-full text-sm py-2" value={template} onChange={e=>setTemplate(e.target.value)}>
                  <option>Notice 2: Final Warning Before Portal Restriction</option>
                  <option>Notice 1: Friendly Reminder</option>
                  <option>Notice 3: Exam Card Hold</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Editable Message Preview</p>
                  <button className="text-xs font-semibold text-brand hover:underline" onClick={() => toast("Resetting to default...")}>Reset to Default</button>
                </div>
                <textarea rows={4} className="input w-full resize-none py-2 text-xs" defaultValue={`Dear ${selected.parent}, This is a formal reminder from The Mighty International School regarding the outstanding fee balance of ${selected.balance} for ${selected.name}. Kindly complete payment via…`} />
              </div>

              <div className="flex gap-2.5">
                <button className="btn btn-primary flex-1 justify-center" onClick={() => toast("Notice dispatched!")}><Send size={14} /> Dispatch Notice Now</button>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </aside>
          )}
        </div>
      </div>
      <StatusFooter />
    </div>
  );
}