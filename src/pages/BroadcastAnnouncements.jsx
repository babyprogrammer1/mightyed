import { Fragment, useState } from "react";
import {
  Download, Search, ChevronDown, RefreshCw, BellRing, Mail, MessageSquare,
  Megaphone, Smartphone, AlignLeft, Link, Paperclip,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";

const BROADCASTS = [
  { subject:"Term 1 Tuition Fee Second Notice", ref:"#BRD-9042", audience:"Parents of Defaulters", recipients:214, date:"28 Sept 2026", time:"09:30 AM", readPct:91, smsPct:99, channels:["portal","email","sms"] },
  { subject:"Inter-House Sports Competition Announcement", ref:"#BRD-9039", audience:"All Parents & Staff", recipients:1334, date:"15 Sept 2026", time:"02:00 PM", readPct:96, extra:"Synced", channels:["portal","email","sms"] },
  { subject:"STAFF BRIEFING: Term 1 Exam Timetable Review", ref:"#BRD-9031", audience:"All Academic Staff", recipients:64, date:"02 Sept 2026", time:"08:00 AM", readPct:100, extra:"Done", channels:["portal","email"] },
  { subject:"PTA General Meeting & Infrastructure Levy Update", ref:"#BRD-9018", audience:"Senior School Parents", recipients:650, date:"22 Aug 2026", time:"11:15 AM", readPct:93, smsPct:98, channels:["portal","email","sms"] },
];

export default function BroadcastAnnouncements() {
  // Page flow: prepare a targeted message, choose channels and timing, then save or dispatch the local broadcast draft.
  const toast = useToast();
  const [q, setQ] = useState("");
  const [recip, setRecip] = useState({ parents:true, teachers:false, students:false, defaulters:true });
  const [channels, setChannels] = useState({ portal:true, email:true, sms:true });
  const [subject, setSubject] = useState("Urgent: Payment Reminder for Outstanding");
  const [body, setBody] = useState("Dear {Parent Name},\n\nPlease be reminded that the outstanding fee balance of {Fee Balance} for {Student Name} is overdue. Kindly access the MightyEd Parent Portal or initiate a direct bank transfer to GTBank (0123456789) to prevent portal suspension.\n\nWarm regards,\nBursary Office, The Mighty International School.");
  const [timing, setTiming] = useState("now");
  // These local values mirror the controls until the broadcast service is connected.
  const [audience, setAudience] = useState("All Audiences (1,840)");
  const [channelFilter, setChannelFilter] = useState("All Channels");
  const [expandedRef, setExpandedRef] = useState(null);
  const [page, setPage] = useState(1);
  const [format, setFormat] = useState("B");
  const [draftSaved, setDraftSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const visibleBroadcasts = BROADCASTS.filter((broadcast) => {
    const matchesSearch = !q || `${broadcast.subject} ${broadcast.ref} ${broadcast.audience}`.toLowerCase().includes(q.toLowerCase());
    const matchesAudience =
      audience === "All Audiences (1,840)" ||
      (audience === "Parents Only" && broadcast.audience.toLowerCase().includes("parent")) ||
      (audience === "Staff Only" && broadcast.audience.toLowerCase().includes("staff"));
    const matchesChannel =
      channelFilter === "All Channels" ||
      broadcast.channels.includes(channelFilter === "SMS" ? "sms" : channelFilter === "Email" ? "email" : "portal");
    return matchesSearch && matchesAudience && matchesChannel;
  });

  const insertVar = (v) => setBody(b => b + v);
  const chooseFormat = (value) => {
    setFormat(value);
    toast(`${value} formatting selected`);
  };
  const insertTool = (value) => {
    if (value === "align") return toast("Text alignment selected");
    setBody((current) => `${current} [${value}]`);
    toast(`${value === "link" ? "Link" : "Attachment"} placeholder added`);
  };
  const sendBroadcast = () => {
    if (!subject.trim() || !body.trim()) return toast("Add a subject and message before sending");
    if (!Object.values(recip).some(Boolean) || !Object.values(channels).some(Boolean)) return toast("Select recipients and a delivery channel");
    setDraftSaved(false);
    toast("Broadcast dispatched successfully");
  };

  return (
    <div className="-m-4 sm:-m-6">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label:"Communication & Administration" }, { label:"Broadcast & Announcements" }]} />
      </div>

      <div className="min-h-screen bg-indigo-50/70 p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold">Broadcast & Announcements</h1>
          <p className="mt-1 text-sm text-slate-500">Create broadcast and sent announcements.</p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-5">
            {/* broadcast history */}
            <section className="card overflow-hidden p-0">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <h2 className="font-semibold">Recent Broadcast History & Audit Log</h2>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-brand">48 Dispatched</span>
                <div className="ml-auto flex gap-2">
                  <button className="icon-btn" onClick={()=>toast("Downloading history...")}><Download size={15}/></button>
                  <button className="icon-btn" onClick={()=>toast("Refreshed")} aria-label="Refresh broadcast history"><RefreshCw size={15}/></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 px-4 pb-3">
                <label className="flex flex-1 min-w-48 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500">
                  <Search size={15}/><input className="flex-1 bg-transparent text-sm text-ink outline-none" placeholder="Search broadcasts by subject or tag…" value={q} onChange={e=>setQ(e.target.value)}/>
                </label>
                <select value={audience} onChange={(e) => setAudience(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"><option>All Audiences (1,840)</option><option>Parents Only</option><option>Staff Only</option></select>
                <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"><option>All Channels</option><option>SMS</option><option>Email</option><option>Portal</option></select>
              </div>
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead><tr className="bg-slate-50 border-y border-slate-200">
                  {["BROADCAST SUBJECT","TARGET AUDIENCE","CHANNELS","DISPATCHED","DELIVERY / READ","ACTIONS"].map(h=>(
                    <th key={h} className="py-3 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {visibleBroadcasts.map((b)=>(
                    <Fragment key={b.ref}>
                    <tr className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-3 pl-3"><p className="font-semibold">{b.subject}</p><p className="text-xs text-slate-400">• Ref: {b.ref}</p></td>
                      <td className="py-3 pl-3"><p>{b.audience}</p><p className="text-xs text-slate-500">{b.recipients.toLocaleString()} Recipients</p></td>
                      <td className="py-3 pl-3">
                        <div className="flex gap-1">
                          {b.channels.includes("portal")&&<span className="grid size-6 place-items-center rounded bg-indigo-100 text-indigo-700"><BellRing size={12}/></span>}
                          {b.channels.includes("email")&&<span className="grid size-6 place-items-center rounded bg-blue-100 text-blue-700"><Mail size={12}/></span>}
                          {b.channels.includes("sms")&&<span className="grid size-6 place-items-center rounded bg-green-100 text-green-700"><MessageSquare size={12}/></span>}
                        </div>
                      </td>
                      <td className="py-3 pl-3"><p className="text-sm">{b.date}</p><p className="text-xs text-slate-500">{b.time}</p></td>
                      <td className="py-3 pl-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-green-500" style={{width:`${b.readPct}%`}}/></div>
                          <span className="text-xs font-semibold text-green-600">{b.readPct}% Read</span>
                        </div>
                        {b.smsPct&&<p className="text-xs text-slate-500">{b.smsPct}% SMS</p>}
                        {b.extra&&<span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.readPct===100?"bg-green-100 text-green-700":"bg-blue-100 text-blue-700"}`}>{b.extra}</span>}
                      </td>
                      <td className="py-3 pl-3">
                        <div className="flex gap-1">
                          <button className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium hover:bg-slate-50" onClick={()=>toast(`Analytics for ${b.ref}...`)}>Analytics</button>
                          <button className="icon-btn" aria-label={`Expand ${b.ref}`} onClick={() => setExpandedRef((current) => current === b.ref ? null : b.ref)}><ChevronDown size={13}/></button>
                        </div>
                      </td>
                    </tr>
                    {expandedRef === b.ref && <tr className="bg-indigo-50/50"><td colSpan={6} className="px-3 py-3 text-xs text-slate-600">Delivery details for {b.ref}: {b.recipients.toLocaleString()} recipients through {b.channels.join(", ")}.</td></tr>}
                    </Fragment>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between p-3 text-sm text-slate-500">
                <span>Showing {visibleBroadcasts.length} of {BROADCASTS.length} matching broadcasts</span>
                <div className="flex items-center gap-2">
                  <span>Page {page} of 12</span>
                  <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs disabled:opacity-50">‹</button>
                  <button disabled={page === 12} onClick={() => setPage((current) => Math.min(12, current + 1))} className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs disabled:opacity-50">›</button>
                </div>
              </div>
            </section>

            {/* gateways + audience */}
            <div className="grid gap-5 md:grid-cols-2">
              <section className="card">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Network Gateways</h2>
                  <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700"><span className="size-2 rounded-full bg-green-500"/>100% Operational</span>
                </div>
                {[["MTN Nigeria SMS Direct","99.1% latency < 2s"],["Airtel Business Hub","98.4% delivery"],["SendGrid Dedicated Email","99.8% inbox rate"]].map(([n,v])=>(
                  <div key={n} className="flex items-center gap-2.5 border-t border-slate-100 py-2 first:border-0">
                    <span className="size-2 flex-none rounded-full bg-green-500"/>
                    <span className="flex-1 text-sm">• {n}</span>
                    <span className="text-xs text-slate-500">{v}</span>
                  </div>
                ))}
              </section>
              <section className="card">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Audience Reach Profile</h2>
                  <span className="font-bold text-brand">1,840 Total</span>
                </div>
                {[["Parents (Primary & College)","1,280"],["Academic Staff","94"],["Senior Students","466"]].map(([l,v])=>(
                  <div key={l} className="flex justify-between border-t border-slate-100 py-2 first:border-0 text-sm">
                    <span className="text-slate-600">{l}</span><span className="font-semibold">{v}</span>
                  </div>
                ))}
                <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500 space-y-0.5">
                  <p>Verified phone numbers: <b className="text-green-600">97.4%</b></p>
                  <p>Valid parent emails: <b className="text-green-600">99.1%</b></p>
                </div>
              </section>
            </div>
          </div>

          {/* compose panel */}
          <aside className="card flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="grid size-8 place-items-center rounded-lg bg-brand-light text-brand"><Megaphone size={16}/></span>
                <div>
                  <h2 className="font-bold leading-tight">Compose Multi-Channel Broadcast</h2>
                  <p className="text-xs text-slate-500">MightyEd Instant Dispatch Gateway</p>
                </div>
              </div>
              <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">Active Draft</span>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">1. Recipient Selection</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[["parents","Parents (All)"],["teachers","Teachers & Staff"],["students","Students"],["defaulters","Fee Defaulters Only"]].map(([k,l])=>(
                  <label key={k} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-xs font-medium ${recip[k]?"border-brand bg-brand-light text-brand":"border-slate-200 hover:bg-slate-50"}`}>
                    <input type="checkbox" className="accent-brand" checked={recip[k]} onChange={()=>setRecip({...recip,[k]:!recip[k]})}/>{l}
                  </label>
                ))}
              </div>
              <p className="mb-1 text-xs text-slate-500">Target Class Arm / Level:</p>
              <select className="input w-full text-xs py-2"><option>All Classes (JSS1 – SSS3) • Full Roster</option><option>SSS Only</option><option>JSS Only</option></select>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">2. Delivery Channels</p>
              <div className="space-y-2">
                {[["portal",Smartphone,"In-App Portal Notification","Free • Instant","bg-indigo-500"],["email",Mail,"Email Broadcast","Free • HTML Template","bg-blue-500"],["sms",MessageSquare,"SMS Alert","Est: 214 Units (Bal: 14,250)","bg-green-500"]].map(([k,Icon,l,sub,c])=>(
                  <label key={k} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 ${channels[k]?"border-brand bg-brand-light":"border-slate-200"}`}>
                    <input type="checkbox" className="size-4 accent-brand" checked={channels[k]} onChange={()=>setChannels({...channels,[k]:!channels[k]})}/>
                    <span className={`grid size-7 flex-none place-items-center rounded text-white ${c}`}><Icon size={13}/></span>
                    <span className="flex-1 text-sm font-medium">{l}</span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 whitespace-nowrap">{sub}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">3. Announcement Subject</p>
              <input className="input w-full" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Enter announcement subject…"/>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">4. Broadcast Body Content</p>
              <div className="mb-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-slate-500">Insert Variable:</span>
                {["{Parent Name}","{Student Name}","{Fee Balance}","{Due Date}"].map(v=>(
                  <button key={v} onClick={()=>insertVar(v)} className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-brand hover:bg-indigo-100">{v}</button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 px-2 py-1.5">
                {[["B","font-bold"],["I","italic"],["U","underline"]].map(([f,s])=>(
                  <button key={f} onClick={() => chooseFormat(f)} className={`rounded px-2 py-0.5 text-xs hover:bg-slate-200 ${s} ${format === f ? "bg-slate-200" : ""}`}>{f}</button>
                ))}
                <span className="mx-1 text-slate-300">|</span>
                {[["align",AlignLeft],["link",Link],["attachment",Paperclip]].map(([k,Icon])=><button key={k} onClick={() => insertTool(k)} className="grid size-7 place-items-center rounded text-slate-600 hover:bg-slate-200" aria-label={k}><Icon size={13}/></button>)}
                <span className="ml-auto text-[10px] text-slate-400">MightyEd Secure Gateway</span>
              </div>
              <textarea rows={6} className="input w-full rounded-t-none border-t-0 resize-none py-2.5 text-xs" value={body} onChange={e=>setBody(e.target.value)}/>
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>{body.length} characters (1 SMS page per recipient)</span>
                <span className="font-semibold text-orange-600">Estimated Total: 214 SMS Units</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">5. Dispatch Timing</p>
              <div className="flex gap-5">
                {[["now","Send Immediately"],["later","Schedule for Later"]].map(([v,l])=>(
                  <label key={v} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="radio" name="timing" value={v} checked={timing===v} onChange={()=>setTiming(v)} className="accent-brand"/>{l}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
              <button className="btn btn-primary flex-1 justify-center text-sm" onClick={sendBroadcast}>Send Broadcast Now</button>
              <button className="btn btn-ghost text-sm" onClick={() => { setDraftSaved(true); toast("Draft saved"); }}>{draftSaved ? "Draft Saved" : "Save Draft"}</button>
              <button className="icon-btn" aria-label="Toggle mobile preview" onClick={() => { setPreviewOpen((open) => !open); toast(previewOpen ? "Mobile preview closed" : "Mobile preview opened"); }}><Smartphone size={15}/></button>
            </div>
            {previewOpen && <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-xs text-slate-600"><strong className="block text-slate-800">{subject || "Untitled broadcast"}</strong><p className="mt-1 whitespace-pre-line">{body}</p></div>}
          </aside>
        </div>
      </div>
    </div>
  );
}