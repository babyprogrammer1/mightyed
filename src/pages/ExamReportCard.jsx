import { useState } from "react";
import { Download, Search, Printer, Settings2, ClipboardList, CheckCircle2, Zap, BarChart3, FileText, LockKeyhole, UsersRound, School } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";
import { downloadCSV } from "../utils.js";

const GRADEBOOKS = [
  { cls:"SSS 2A", badge:"38 Active Enrolled", bc:"bg-blue-100 text-blue-700", teacher:"Mrs. C. Okafor", ti:"CO", assessment:["CA 40/40 Verified","Exam Approved VP"], assessColor:"text-green-600", mean:"82.1%", meanLabel:"Distinction", bursarCleared:"38 / 42", overdue:"4 Overdue Held", overColor:"text-orange-500", status:"Built & Ready (42)", sc:"bg-green-100 text-green-700", selected:true },
  { cls:"SSS 1A", badge:"38 Active Enrolled", bc:"bg-blue-100 text-blue-700", teacher:"Dr. Femi Alabi", ti:"FA", assessment:["CA Complete","Pending VP Review"], assessColor:"text-orange-500", mean:"71.4%", meanLabel:"Pass Avg", bursarCleared:"32 / 38", overdue:"6 Fees Pending", overColor:"text-orange-500", status:"In Review", sc:"bg-yellow-100 text-yellow-700" },
  { cls:"JSS 2B", badge:"40 Active Enrolled", bc:"bg-indigo-100 text-brand", teacher:"Mr. Okon", ti:"OK", assessment:["Missing Basic Tech","CA: 40/40 Ready"], assessColor:"text-red-600", mean:"—", meanLabel:"Incomplete", bursarCleared:"35 / 40", overdue:"5 Not Cleared", overColor:"text-red-500", status:"Blocked", sc:"bg-red-100 text-red-600" },
  { cls:"SSS 3A", badge:"36 Graduating Seniors", bc:"bg-purple-100 text-purple-700", teacher:"Arc. Balogun", ti:"AB", assessment:["CA Verified","WAEC Mock Synced"], assessColor:"text-green-600", mean:"85.6%", meanLabel:"Superior", bursarCleared:"36 / 36", overdue:"100% Cleared", overColor:"text-green-600", status:"Published Portal", sc:"bg-blue-100 text-blue-700" },
  { cls:"JSS 3A", badge:"39 Junior Candidates", bc:"bg-green-100 text-green-700", teacher:"Mrs. K. Adeleke", ti:"KA", assessment:["BECE Ready","Exam Complete"], assessColor:"text-green-600", mean:"78.2%", meanLabel:"Merit", bursarCleared:"35 / 39", overdue:"4 Pending", overColor:"text-orange-500", status:"Built & Ready", sc:"bg-green-100 text-green-700" },
];

const SUBJECTS = [
  { name:"Mathematics", ca1:37, exam:54, total:91, grade:"A1", remark:"Outstanding analytical skills & proofs", teacher:"Mr. D. Okon" },
  { name:"English Language", ca1:33, exam:48, total:81, grade:"A1", remark:"Articulate essay structure & speech delivery", teacher:"Mrs. E. Okafor" },
  { name:"Physics", ca1:33, exam:51, total:84, grade:"A1", remark:"Exceptional laboratory practicals & lab safety", teacher:"Dr. B. Alabi" },
  { name:"Chemistry", ca1:31, exam:49, total:80, grade:"A1", remark:"Consistent organic chemistry stoichiometry", teacher:"Mr. C. Chukwu" },
  { name:"Biology", ca1:35, exam:52, total:87, grade:"A1", remark:"High aptitude in biological taxonomy", teacher:"Mrs. A. Balogun" },
  { name:"Further Mathematics", ca1:36, exam:52, total:88, grade:"A1", remark:"Active class governance debate lead", teacher:"Mr. T. Danjuma" },
];

export default function ExamReportCard() {
  // Page flow: filter gradebooks, select classes, review the generated dossier, then approve, export, or publish results.
  const toast = useToast();
  const [tab, setTab] = useState("approved");
  const [selected, setSelected] = useState(GRADEBOOKS[0]);
  const [query, setQuery] = useState("");
  const [wing, setWing] = useState("Junior & Senior");
  const [checked, setChecked] = useState(new Set([GRADEBOOKS[0].cls]));
  const [page, setPage] = useState(1);
  const [gradingScale, setGradingScale] = useState("WAEC / NECO Standard (9-Scale A1-F9)");
  const [gradeSheetExported, setGradeSheetExported] = useState(false);
  const [batchPublished, setBatchPublished] = useState(false);
  const [zipGenerated, setZipGenerated] = useState(false);
  const [portalPublished, setPortalPublished] = useState(false);
  const [approved, setApproved] = useState(new Set());
  const visibleGradebooks = GRADEBOOKS.filter((gradebook) => {
    const matchesQuery = `${gradebook.cls} ${gradebook.teacher}`.toLowerCase().includes(query.toLowerCase());
    const matchesWing = wing === "Junior & Senior" || (wing === "Senior" ? gradebook.cls.startsWith("SSS") : gradebook.cls.startsWith("JSS"));
    const matchesTab = tab === "all" ||
      (tab === "approved" && gradebook.status.includes("Ready")) ||
      (tab === "review" && gradebook.status === "In Review") ||
      (tab === "blocked" && gradebook.status === "Blocked");
    return matchesQuery && matchesWing && matchesTab;
  });
  const toggleChecked = (className) => setChecked((current) => {
    const next = new Set(current);
    if (next.has(className)) next.delete(className); else next.add(className);
    return next;
  });
  const toggleGradebook = (gradebook) => {
    const wasChecked = checked.has(gradebook.cls);
    toggleChecked(gradebook.cls);
    if (wasChecked && selected?.cls === gradebook.cls) setSelected(null);
    if (!wasChecked) setSelected(gradebook);
  };
  const exportGradeSheet = () => {
    downloadCSV("gradebook-summary.csv", visibleGradebooks.map(({ cls, teacher, mean, status }) => ({
      Class: cls, Teacher: teacher, Mean: mean, Status: status,
    })));
    setGradeSheetExported(true);
    toast("Grade sheet exported");
  };
  const generateAndPublish = () => {
    if (!checked.size) return toast("Select at least one class before publishing");
    setBatchPublished(true);
    toast(`${checked.size} class gradebook${checked.size === 1 ? "" : "s"} generated and published`);
  };
  const approveSelected = (gradebook = selected) => {
    if (!gradebook) return;
    setApproved((current) => new Set(current).add(gradebook.cls));
    toast(`${gradebook.cls} batch approved`);
  };

  return (
    <div className="-m-4 flex min-h-screen flex-col sm:-m-6">
      <div className="bg-white px-4 py-4 sm:px-6">
        <Breadcrumb trail={[{ label: "Academic & Exam Oversight" }, { label: "Exam & Report Card Generator" }]} />
      </div>

      <div className="flex-1 bg-indigo-50/70 p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Exam & Report Card Generator</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">● EXAM COUNCIL ACTIVE</span>
            <p className="mt-1.5 text-sm text-slate-500">Review teacher assessment submissions, approve term gradebooks, configure grading scales, and batch-generate official report cards and transcripts.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button className="btn btn-ghost" onClick={() => { setGradingScale((current) => current.includes("WAEC") ? "MightyEd 100-Point Scale" : "WAEC / NECO Standard (9-Scale A1-F9)"); toast("Grading scale updated"); }}><Settings2 size={14}/> Configure Grading Scale</button>
            <button className="btn btn-ghost" onClick={exportGradeSheet}><Download size={14} /> {gradeSheetExported ? "Grade Sheet Exported" : "Export Grade Sheet"}</button>
            <button className="btn btn-primary" onClick={generateAndPublish}><ClipboardList size={14}/> {batchPublished ? "Batch Published" : "Batch Generate & Publish"}</button>
          </div>
        </div>

        <div className="mb-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card">
            <div className="mb-1 flex items-center justify-between"><p className="text-xs text-slate-500">CA & Exam Grade Submissions</p><CheckCircle2 size={14} className="text-green-600"/></div>
            <p className="text-2xl font-bold">92% Approved</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-brand" style={{ width: "92%" }} /></div>
            <p className="mt-1 text-xs text-slate-500">22 of 24 Classes Submitted & Verified</p>
            <span className="text-[11px] font-semibold text-brand">91.6%</span>
          </div>
          <div className="card">
            <div className="mb-1 flex items-center justify-between"><p className="text-xs text-slate-500">Pending VP Approvals</p><Zap size={14} className="text-orange-400"/></div>
            <p className="text-2xl font-bold text-orange-500">2 Classes Pending</p>
            <p className="mt-1 flex items-center gap-1 text-xs"><span className="size-2 rounded-full bg-orange-400" /> SSS 1 Diamond (Phys) & JSS 2 Sil</p>
            <p className="mt-1 text-xs font-semibold text-red-600">Action Required Before 5 PM</p>
          </div>
          <div className="card">
            <div className="mb-1 flex items-center justify-between"><p className="text-xs text-slate-500">Class Performance Average</p><BarChart3 size={14} className="text-brand"/></div>
            <p className="text-2xl font-bold">74.8% <span className="text-sm font-normal text-green-600">↗+3.4%</span></p>
            <p className="text-xs text-slate-500">Highest: SSS 2A (82.1%)</p>
            <p className="text-xs text-slate-500">Lowest: JSS 1B (68.4%)</p>
          </div>
          <div className="card">
            <div className="mb-1 flex items-center justify-between"><p className="text-xs text-slate-500">Report Cards Ready</p><FileText size={14} className="text-brand"/></div>
            <p className="text-2xl font-bold">1,142 PDFs</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-orange-500"><LockKeyhole size={12}/> 106 On Hold (Bursar)</p>
            <span className="text-[11px] font-semibold text-green-600">91.5% Cleared</span>
          </div>
        </div>

        <div className={`grid min-w-0 gap-5 ${selected ? "xl:grid-cols-[minmax(0,1fr)_340px]" : ""}`}>
          <div className="flex min-w-0 flex-col gap-4">
            {/* tabs */}
            <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
              {[["all","All Classes","24"],["approved","Approved & Ready","22"],["review","Pending VP Review","2"],["blocked","Blocked Submissions","1"]].map(([k,l,c])=>(
                <button key={k} onClick={()=>setTab(k)}
                  className={`flex flex-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${tab===k?"bg-brand text-white":"text-slate-600 hover:bg-slate-50"}`}>
                  {l}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tab===k?"bg-white/20 text-white":"bg-slate-100 text-slate-700"}`}>{c}</span>
                </button>
              ))}
            </div>

            {/* gradebook table */}
            <section className="card overflow-hidden p-0">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">Terminal Cohort Gradebooks</span>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-brand">Term 3 Final Dossier</span>
                </div>
                <span className="text-xs text-slate-500">{checked.size} of 24 Selected</span>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="py-3 pl-4"><input type="checkbox" className="size-4 accent-brand" checked={visibleGradebooks.length > 0 && visibleGradebooks.every((g) => checked.has(g.cls))} onChange={() => {
                      const allChecked = visibleGradebooks.every((g) => checked.has(g.cls));
                      setChecked((current) => {
                        const next = new Set(current);
                        visibleGradebooks.forEach((g) => allChecked ? next.delete(g.cls) : next.add(g.cls));
                        return next;
                      });
                      if (allChecked && selected && visibleGradebooks.some((g) => g.cls === selected.cls)) setSelected(null);
                      if (!allChecked && visibleGradebooks.length > 0) setSelected(visibleGradebooks[0]);
                    }} /></th>
                    {["CLASS & ARM","FORM TEACHER","ASSESSMENT (CA/EXAM)","MEAN","BURSAR CLEARED","STATUS","ACTIONS"].map(h=>(
                      <th key={h} className="py-3 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleGradebooks.map((g)=>(
                    <tr key={g.cls} onClick={()=>setSelected(g)}
                      className={`border-t border-slate-100 cursor-pointer ${selected?.cls===g.cls?"bg-blue-50":"hover:bg-slate-50"}`}>
                      <td className="py-3 pl-4" onClick={e=>e.stopPropagation()}>
                        <input type="checkbox" className="size-4 accent-brand" checked={checked.has(g.cls)} onChange={() => toggleGradebook(g)} />
                      </td>
                      <td className="py-3 pr-3">
                        <p className={`font-bold ${selected?.cls===g.cls?"text-brand":""}`}>{g.cls}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${g.bc}`}>{g.badge}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-brand">{g.ti}</span>
                          <span className="text-xs">{g.teacher}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        {g.assessment.map((a,i)=>(
                          <p key={i} className={`text-xs ${i===0?g.assessColor:"text-slate-500"}`}>{i===0?"✓ ":""}{a}</p>
                        ))}
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-bold">{g.mean}</p>
                        <span className={`text-xs ${g.mean==="—"?"text-red-500":"text-slate-500"}`}>{g.meanLabel}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="text-sm">{g.bursarCleared}</p>
                        <p className={`text-xs ${g.overColor}`}>{g.overdue}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${g.sc}`}>{g.status}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <button className="icon-btn text-brand" aria-label={`Approve ${g.cls}`} onClick={e=>{e.stopPropagation(); setSelected(g); approveSelected(g); }}>⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 p-3">
                <span className="text-sm text-slate-500">Showing 1 to 5 of 24 Class Arms</span>
                <div className="flex gap-1">
                  {["‹","1","2","3","›"].map(p=>(
                    <button key={p} disabled={p === "‹" && page === 1 || p === "›" && page === 3} onClick={() => {
                      if (p === "‹") setPage((current) => Math.max(1, current - 1));
                      else if (p === "›") setPage((current) => Math.min(3, current + 1));
                      else setPage(Number(p));
                    }} className={`rounded-md px-2.5 py-1.5 text-xs ${Number(p) === page ? "bg-brand text-white" : "bg-slate-100"} disabled:opacity-50`}>{p}</button>
                  ))}
                </div>
              </div>
            </section>

            {/* batch packaging */}
            <section className="card flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-indigo-100 text-brand">📦</span>
                <div>
                  <p className="font-semibold text-sm">Selected Class Batch Packaging</p>
                  <p className="text-xs text-slate-500">SSS 2A (42 students) • High-res printable ZIP archive format</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <button className="btn btn-ghost" onClick={() => { setZipGenerated(true); toast("ZIP archive generated"); }}>{zipGenerated ? "ZIP Generated" : "Generate Zip"}</button>
                <button className="btn btn-primary" onClick={() => { setPortalPublished(true); toast("Report cards pushed to parent portal"); }}>📤 {portalPublished ? "Published to Portal" : "Push to Portal"}</button>
              </div>
            </section>
          </div>

          {/* right panel: live document dossier */}
          {selected && (
            <aside className="flex flex-col gap-0">
              <div className="card overflow-hidden p-0">
                <div className="flex items-center justify-between bg-slate-50 px-3 py-2.5">
                  <label className="flex flex-1 items-center gap-2 text-slate-500 text-sm">
                    <Search size={14} /><input className="flex-1 bg-transparent text-sm text-ink outline-none" placeholder="Search class, form teacher, subject…" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 p-3 border-b border-slate-200">
                  <label className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"><UsersRound size={13} className="text-brand"/>
                    <select className="bg-transparent outline-none" value={wing} onChange={(e) => setWing(e.target.value)}><option>Junior & Senior</option><option>Junior</option><option>Senior</option></select>
                  </label>
                  <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-indigo-50 px-2.5 py-1.5 text-xs text-brand" onClick={() => { setGradingScale((current) => current.includes("WAEC") ? "MightyEd 100-Point Scale" : "WAEC / NECO Standard (9-Scale A1-F9)"); toast("Grading standard selected"); }}><Settings2 size={13}/> {gradingScale}</button>
                </div>

                {/* dossier header */}
                <div className="p-3 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-green-500" />
                      <span className="text-xs font-semibold">Live Document Dossier</span>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold">WAEC/Bilingual v4</span>
                  </div>
                </div>

                {/* report card preview */}
                <div className="p-3 text-xs border-b border-slate-200">
                  <div className="rounded-xl border-2 border-brand/30 bg-white p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="grid size-8 place-items-center rounded-full bg-brand text-white"><School size={14}/></span>
                      <div>
                        <p className="font-bold text-sm uppercase">The Mighty International School</p>
                        <p className="text-[10px] text-brand font-semibold">EXCELLENCE & INTEGRITY IN LEADERSHIP</p>
                        <p className="text-[10px] text-slate-500">Plot 14 Victoria Island Annex, Lagos State, Nigeria</p>
                      </div>
                    </div>
                    <div className="rounded bg-indigo-50 px-2 py-1 mb-2 text-center">
                      <p className="text-[10px] font-bold uppercase text-brand">Official Third Term Terminal Examination Dossier • 2025/2026 Academic Session</p>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mb-2 text-[11px]">
                      <div><p className="text-slate-400">Student Name</p><p className="font-semibold">ADEBAYO, Samuel O.</p></div>
                      <div><p className="text-slate-400">Admission No.</p><p className="font-semibold text-brand">MIS/2024/0142</p></div>
                      <div><p className="text-slate-400">Class & Arm</p><p className="font-semibold text-brand">SSS 2A</p></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mb-3 text-[11px]">
                      <div><p className="text-slate-400">Term Position</p><p className="font-bold text-brand">3rd of 42 Students</p></div>
                      <div><p className="text-slate-400">Cumulative GPA</p><p className="font-bold">4.85 / 5.0 (86.4%)</p></div>
                      <div><p className="text-slate-400">Term Attendance</p><p className="font-bold">116 / 120 Days (96.7%)</p></div>
                    </div>

                    <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Cognitive Subject Mastery <span className="font-normal">Weight: CA 40% | Exam 60%</span></p>
                    <table className="w-full border-collapse text-[10px] mb-3">
                      <thead><tr className="bg-slate-50"><th className="py-1 text-left font-semibold">Subject</th><th>CA(40)</th><th>Exam(60)</th><th>Total</th><th>Grade</th><th className="text-left pl-1">Remark</th></tr></thead>
                      <tbody>
                        {SUBJECTS.map((s)=>(
                          <tr key={s.name} className="border-t border-slate-100">
                            <td className="py-1 font-medium">{s.name}</td>
                            <td className="text-center">{s.ca1}</td>
                            <td className="text-center">{s.exam}</td>
                            <td className="text-center font-bold text-brand">{s.total}%</td>
                            <td className="text-center"><span className="rounded bg-green-100 px-1 py-0.5 text-[9px] font-bold text-green-700">{s.grade}</span></td>
                            <td className="pl-1 text-slate-500">Distinction</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p className="mb-1.5 text-[10px] font-bold uppercase text-slate-500">Affective & Psychomotor Evaluation</p>
                    <div className="mb-3 grid grid-cols-4 gap-1 text-center text-[10px]">
                      {[["Punctuality","5/5","Exceptional"],["Leadership","4/5","Commendable"],["Sports & Fitness","4/5","Active Member"],["Conduct","5/5","Role Model"]].map(([l,v,r])=>(
                        <div key={l} className="rounded bg-slate-50 p-1.5">
                          <p className="text-slate-400">{l}</p>
                          <p className="font-bold text-brand">{v}</p>
                          <p className="text-green-600">{r}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-2 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="rounded bg-slate-50 p-2">
                        <p className="font-bold mb-0.5">Form Teacher Remark</p>
                        <p className="text-slate-600 italic">"An exceptionally brilliant, diligent student with consistent academic vigor and exemplary conduct."</p>
                        <p className="mt-1 text-slate-400">Chioma Okafor (Mrs.) — July 18, 2026</p>
                      </div>
                      <div className="rounded bg-indigo-50 p-2">
                        <p className="font-bold mb-0.5 text-brand">Principal's Promotion Verdict</p>
                        <p className="text-slate-600 italic">"Outstanding terminal performance. Promoted to Senior Secondary 3 (SSS 3A) with honors."</p>
                        <p className="mt-1 text-slate-400">Prof. A. C. Nwosu — Executive Principal</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-green-50 border border-green-200 p-2 text-[10px]">
                      <p className="flex items-center gap-1 font-bold text-green-700">✓ BURSAR FINANCIAL CLEARANCE: 100% CLEARED</p>
                      <p className="text-slate-500">Tuition Receipt #TRX-PAY-9842011 • Zero Outstanding Dues</p>
                      <span className="float-right rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-bold text-green-700">VALIDATED</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 p-3">
                  <button className="btn btn-ghost flex-1 justify-center text-sm" onClick={() => window.print()}>
                    <Printer size={14} /> Print
                  </button>
                  <button className="btn btn-primary flex-1 justify-center text-sm" onClick={approveSelected}>
                    {approved.has(selected.cls) ? "✓ Batch Approved" : `✓ Batch Approve ${selected.cls}`}
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}