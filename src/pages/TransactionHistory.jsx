import { useRef, useState } from "react";
import { Download, Search, ChevronDown, Calendar, X, ZoomIn, Landmark } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";
import StatusFooter from "../components/StatusFooter.jsx";
import { downloadCSV } from "../utils.js";

const TXNS = [
  { ref:"TRX-PAY-9842011", date:"30 Sept 2026, 08:42 AM", name:"Adebayo Samuel", cls:"SSS 2A", parent:"Dr. Kunle Adebayo • 0803 123 4567", inv:"INV-2026-0891", channel:"Paystack Card", cc:"bg-blue-100 text-blue-700", status:"settled" },
  { ref:"TRX-PAY-9841882", date:"30 Sept 2026, 07:15 AM", name:"Okonkwo Chidimma", cls:"SSS 2A", parent:"Mrs. Grace Okonkwo", inv:"INV-2026-0512", channel:"Paystack Transfer", cc:"bg-blue-100 text-blue-700", status:"settled" },
  { ref:"MTR-GTB-004218", date:"29 Sept 2026, 04:30 PM", name:"Abubakar Ibrahim", cls:"JSS 3B", parent:"Mallam Yusuf Abubakar", inv:"INV-2026-0042", channel:"Direct GTBank", cc:"bg-orange-100 text-orange-700", status:"pending", selected:true },
  { ref:"TRX-FLW-4410928", date:"28 Sept 2026, 02:10 PM", name:"Okafor Chinedu", cls:"SSS 1A", parent:"Mr. Emeka Okafor", inv:"INV-2026-0188", channel:"Flutterwave", cc:"bg-purple-100 text-purple-700", status:"settled" },
  { ref:"POS-ZEN-771923", date:"28 Sept 2026, 11:20 AM", name:"Danjuma Mary", cls:"JSS 1B", parent:"Alh. Kabir Danjuma", inv:"INV-2026-0744", channel:"Zenith POS (Desk)", cc:"bg-green-100 text-green-700", status:"settled" },
];

export default function TransactionHistory() {
  // Page flow: filter transactions, select ledger rows, verify receipts, and export or reconcile payment records.
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(TXNS[2]);
  const [checklist, setChecklist] = useState({ bank: false, amount: false, student: false });
  const [channelFilter, setChannelFilter] = useState("All Channels");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedRefs, setSelectedRefs] = useState(new Set([TXNS[2].ref]));
  const [page, setPage] = useState(1);
  const statementInput = useRef(null);
  const filteredTxns = TXNS.filter((transaction) =>
    (!q || `${transaction.ref} ${transaction.name} ${transaction.inv}`.toLowerCase().includes(q.toLowerCase())) &&
    (channelFilter === "All Channels" || transaction.channel.includes(channelFilter)) &&
    (statusFilter === "All Statuses" || transaction.status === statusFilter.toLowerCase()) &&
    (tab === "all" ||
      (tab === "manual" && (transaction.channel.includes("Bank") || transaction.channel.includes("POS"))) ||
      (tab === "gateway" && !transaction.channel.includes("Bank") && !transaction.channel.includes("POS")) ||
      (tab === "payout" && transaction.status === "pending"))
  );
  const toggleRef = (ref) => setSelectedRefs((current) => {
    const next = new Set(current);
    if (next.has(ref)) next.delete(ref); else next.add(ref);
    return next;
  });
  const toggleTransaction = (transaction) => {
    const wasSelected = selectedRefs.has(transaction.ref);
    toggleRef(transaction.ref);
    if (wasSelected && selected?.ref === transaction.ref) setSelected(null);
    if (!wasSelected) setSelected(transaction);
  };
  const importStatement = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    toast(`Statement "${file.name}" uploaded for reconciliation`);
  };
  const exportLedger = () => {
    downloadCSV("transaction-ledger.csv", filteredTxns.map(({ ref, date, name, cls, inv, channel, status }) => ({
      Reference: ref, Date: date, Student: name, Class: cls, Invoice: inv, Channel: channel, Status: status,
    })));
    toast("Ledger exported");
  };

  return (
    <div className="-m-4 sm:-m-6 flex min-h-screen flex-col">
      <div className="bg-white px-4 py-4 sm:px-6">
        <Breadcrumb trail={[{ label: "Academics" }, { label: "Fee Management" }, { label: "Transaction History & Gateway Reconciliation" }]} />
      </div>

      <div className="flex-1 bg-indigo-50/70 p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Transaction History & Gateway Reconciliation</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-500">Audit live payment transactions, reconcile online gateway payouts, verify manual bank transfers, and resolve ledger discrepancies.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <input ref={statementInput} type="file" accept=".csv,.xls,.xlsx,.pdf" hidden onChange={importStatement} />
            <button className="btn btn-ghost" onClick={() => statementInput.current?.click()}><Download size={14} /> Upload Statement</button>
            <button className="btn btn-ghost" onClick={exportLedger}><Download size={14} /> Export Ledger</button>
            <button className="btn btn-primary" onClick={() => toast("Initiating payout reconciliation...")}>⟳ Initiate Payout Reconciliation</button>
          </div>
        </div>

        <div className="mb-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label:"Net Settled Volume (This Term)", value:"₦298,200,000.00", sub:"1,034 Successfully settled online gateway transactions", badge:"Paystack Batch #PAY-2026-092", bc:"bg-blue-100 text-blue-700" },
            { label:"Pending Gateway Settlements", value:"₦18,450,000.00", sub:"Due Tomorrow", badge:"", bc:"" },
            { label:"Pending Manual Verification", value:"12 Unverified Receipts", vc:"text-orange-600", sub:"Total: ₦4,200,000.00", action:"Review Queue →" },
            { label:"Transaction Failure/Refund Rate", value:"0.42%", sub:"4 Failed / 2 Refunds", badge2:"99.98% Uptime", bc2:"bg-green-100 text-green-700" },
          ].map((s,i)=>(
            <div key={i} className="card">
              <p className="mb-1.5 text-xs text-slate-500">{s.label}</p>
              <p className={`text-xl font-bold ${s.vc??""}`}>{s.value}</p>
              <p className={`mt-1 text-xs ${s.action?"text-brand font-semibold cursor-pointer":"text-slate-500"}`} onClick={s.action?()=>toast("Opening review queue..."):undefined}>{s.sub}</p>
              {s.badge && <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.bc}`}>{s.badge}</span>}
              {s.badge2 && <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.bc2}`}>{s.badge2}</span>}
            </div>
          ))}
        </div>

        <div className={`grid min-w-0 gap-5 ${selected ? "xl:grid-cols-[minmax(0,1fr)_380px]" : ""}`}>
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
              {[["all","All Payment Transactions","1,248"],["gateway","Online Gateway Logs","Paystack / FLW"],["manual","Manual Bank Transfers & POS Queue","14"],["payout","Gateway Payout Reconciliations",""]].map(([k,l,c])=>(
                <button key={k} onClick={()=>setTab(k)}
                  className={`flex flex-none items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${tab===k?"bg-brand text-white":"text-slate-600 hover:bg-slate-50"}`}>
                  {l}
                  {c && <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${tab===k?"bg-white/20 text-white":k==="manual"?"bg-red-500 text-white":"bg-slate-100 text-slate-700"}`}>{c}</span>}
                </button>
              ))}
            </div>

            <div className="card overflow-hidden p-0">
              <div className="flex flex-wrap gap-3 p-3">
                <label className="flex flex-1 min-w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-500">
                  <Search size={15} /><input className="flex-1 bg-transparent text-sm text-ink outline-none" placeholder="Search by Transaction Reference, Invoice No, Student Name" value={q} onChange={e=>setQ(e.target.value)} />
                </label>
                <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"><option>All Channels</option><option>Paystack</option><option>GTBank</option><option>Flutterwave</option><option>Zenith</option></select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"><option>All Statuses</option><option>Settled</option><option>Pending</option></select>
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" onClick={() => toast("Date range: 01 Sept 2026 – 30 Sept 2026")}><Calendar size={14} /> 01 Sept 2026 – 30 Sept 2026 <ChevronDown size={13} /></button>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Transaction Ledger Matrix</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">Live Feed</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="size-2 rounded-full bg-green-500" /> Auto-Sync: 12s ago</span>
              </div>

              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 pl-4"><input type="checkbox" className="size-4 accent-brand" checked={filteredTxns.length > 0 && filteredTxns.every((t) => selectedRefs.has(t.ref))} onChange={() => {
                      const allSelected = filteredTxns.every((t) => selectedRefs.has(t.ref));
                      setSelectedRefs((current) => {
                        const next = new Set(current);
                        filteredTxns.forEach((t) => allSelected ? next.delete(t.ref) : next.add(t.ref));
                        return next;
                      });
                      if (allSelected && selected && filteredTxns.some((t) => t.ref === selected.ref)) setSelected(null);
                      if (!allSelected && filteredTxns.length > 0) setSelected(filteredTxns[0]);
                    }} /></th>
                    {["TX REF & DATE","STUDENT & PARENT INFO","INVOICE REF","CHANNEL"].map(h=>(
                      <th key={h} className="py-3 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTxns.map((t)=>(
                    <tr key={t.ref} onClick={()=>setSelected(t)}
                      className={`border-t border-slate-100 cursor-pointer ${selected?.ref===t.ref?"bg-blue-50":"hover:bg-slate-50"}`}>
                      <td className="py-3 pl-4" onClick={e=>e.stopPropagation()}>
                        <input type="checkbox" className="size-4 accent-brand" checked={selectedRefs.has(t.ref)} onChange={() => toggleTransaction(t)} />
                      </td>
                      <td className="py-3 pr-3">
                        <p className={`font-mono text-sm font-semibold ${t.status==="pending"?"text-brand":""}`}>{t.ref}</p>
                        <p className="text-xs text-slate-500">{t.date}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-semibold">{t.name} <span className="text-xs font-normal text-slate-500">({t.cls})</span></p>
                        <p className="text-xs text-slate-500">{t.parent}</p>
                      </td>
                      <td className="py-3 pr-3"><span className="font-mono text-xs font-semibold text-brand">{t.inv}</span></td>
                      <td className="py-3 pr-3"><span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${t.cc}`}><Landmark size={12}/> {t.channel}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-slate-100 p-3 text-sm text-slate-500">
                <span>Showing {filteredTxns.length} matching transaction logs</span>
                <div className="flex items-center gap-2">
                  <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"><option>10 per page</option></select>
                  {["‹","1","2","3","…","125","›"].map(p=>(
                    <button key={p} disabled={p === "…" } onClick={() => {
                      if (p === "‹") setPage((current) => Math.max(1, current - 1));
                      else if (p === "›") setPage((current) => Math.min(125, current + 1));
                      else if (p !== "…") setPage(Number(p));
                    }} className={`rounded-md px-2.5 py-1.5 text-xs ${Number(p) === page ? "bg-brand text-white" : "bg-slate-100"} disabled:cursor-default disabled:opacity-50`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* right panel */}
          {selected && (
            <aside className="card flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold">Verify Bank Transfer Receipt</h2>
                    {selected.status === "pending" && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">Priority</span>}
                  </div>
                  <p className="text-xs text-slate-500">Manual Transfer Queue • Pending Bursar Action</p>
                </div>
                <button className="icon-btn" onClick={() => setSelected(null)}><X size={16} /></button>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-sm">
                <div className="mb-2 grid grid-cols-2 gap-2">
                  <div><p className="text-[11px] text-slate-500">INTERNAL REFERENCE</p><p className="font-mono font-bold text-brand">{selected.ref}</p></div>
                  <div><p className="text-[11px] text-slate-500">Student:</p><p className="font-semibold">{selected.name} ({selected.cls})</p></div>
                  <div><p className="text-[11px] text-slate-500">Parent/Depositor:</p><p>{selected.parent}</p></div>
                  <div><p className="text-[11px] text-slate-500">Target Invoice:</p><p className="font-mono font-semibold text-brand">{selected.inv} (Term 1 Tuition Balance)</p></div>
                </div>
                <div className="mt-2 border-t border-slate-200 pt-2">
                  <p className="text-[11px] text-slate-500">CLAIMED AMOUNT:</p>
                  <p className="text-2xl font-bold text-brand">₦150,000.00</p>
                  <p className="text-xs text-slate-500 mt-0.5">Transfer Timestamp: 29 Sept 2026, 16:30 WAT</p>
                  <p className="text-xs text-slate-500">Destination Acct: GTBank (Acct: 0123456789)</p>
                  <p className="text-xs text-slate-500">Narrative: TUITION BAL – ABUBAKAR IBRAHIM JSS3D</p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Depositor Proof Document</p>
                  <button className="link text-xs" onClick={() => toast("Opening full preview...")}>⤡ Open Full Preview</button>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 font-mono text-xs">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">Guaranty Trust Bank Transfer Receipt</span>
                    <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">SUCCESSFUL</span>
                  </div>
                  {[["Session ID","0000132600929163012981"],["Payer Acct","Yusuf Abubakar (****4912)"],["Beneficiary","The Mighty International S…"],["Amount","NGN 150,000.00"],["NIBSS Ref","NIBSS/E-TRN/98219739"]].map(([k,v])=>(
                    <div key={k} className="flex justify-between text-[11px] leading-5"><span className="text-slate-500">{k}:</span><span>{v}</span></div>
                  ))}
                  <div className="mt-2.5 flex gap-2">
                    <button className="flex items-center justify-center gap-1 rounded-md border border-slate-200 py-1.5 text-center text-[11px] font-medium hover:bg-slate-50" onClick={() => toast("Zooming receipt...")}><ZoomIn size={12}/> Zoom Receipt</button>
                    <button className="flex-1 rounded-md border border-slate-200 py-1.5 text-center text-[11px] font-medium hover:bg-slate-50" onClick={() => toast("Downloading slip...")}>⬇ Download Slip</button>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Mandatory Bursar Checklist</p>
                <div className="space-y-2">
                  {[["bank","Credit alert confirmed in school GTBank live statement (NIBSS reference matched)."],["amount","Amount matches outstanding invoice ledger balance (₦150,000.00 of ₦300,000.00)."],["student","Student admission ID verified with enrolled student roster."]].map(([k,l])=>(
                    <label key={k} className="flex cursor-pointer items-start gap-2.5 text-xs">
                      <input type="checkbox" className="mt-0.5 size-4 accent-brand flex-none" checked={checklist[k]} onChange={()=>setChecklist({...checklist,[k]:!checklist[k]})} />
                      <span className="text-slate-600">{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Audit Notes / Statement Line Reference
                  <input className="input py-2 font-mono" defaultValue="Verified against GTBank statement page 4, item #82" />
                </label>
              </div>

              <div className="flex gap-2">
                <button className="btn btn-ghost flex-1 justify-center text-red-600 border-red-200 hover:bg-red-50" onClick={() => toast("Transaction rejected — SMS sent to parent")}>⊘ Reject & SMS</button>
                <button className={`btn btn-primary flex-1 justify-center ${!Object.values(checklist).every(Boolean) ? "opacity-60" : ""}`}
                  onClick={() => Object.values(checklist).every(Boolean) ? toast("Transaction approved & credited!") : toast("Complete the checklist first")}>
                  ✓ Approve & Credit
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
      <StatusFooter />
    </div>
  );
}