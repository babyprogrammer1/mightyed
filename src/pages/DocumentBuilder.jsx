import { useState } from "react";
import {
  Award,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  GraduationCap,
  CreditCard,
  Landmark,
  LockKeyhole,
  Plane,
  Printer,
  QrCode,
  ScrollText,
  Settings,
  Trophy,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";
import { downloadCSV } from "../utils.js";
import { studentPhotos } from "../data/students.js";

const STUDENTS = [
  { name:"Adebayo Samuel O.", cls:"SSS 2A", id:"MIS/2024/0142", dob:"14 May, 2011", blood:"O+", genotype:"AA", phone:"0803 123 4567", house:"JAGUAR HOUSE", houseColor:"bg-red-600", role:"HOUSE PREFECT", photo:studentPhotos[0] },
  { name:"Okonkwo Chidimma", cls:"SSS 2A", id:"MIS/2024/0188", dob:"02 Mar, 2010", blood:"A+", genotype:"AS", phone:"0802 987 6543", house:"EAGLE HOUSE", houseColor:"bg-blue-700", role:"CLASS CAPTAIN", photo:studentPhotos[1] },
  { name:"Abubakar Ibrahim", cls:"JSS 3C", id:"MIS/2024/0091", dob:"17 Jul, 2012", blood:"B+", genotype:"AA", phone:"0805 444 1122", house:"LION HOUSE", houseColor:"bg-green-700", role:"STUDENT", photo:studentPhotos[2] },
];

const TEMPLATE_INFO = {
  id: { title: "Student & Staff ID Cards Builder", format: "CR80 PVC", batch: "42 Student Cards", front: "Front Face (Observer)", back: "Reverse Face (Institutional)" },
  transfer: { title: "Transfer & Character Certificates", format: "A4 Security Paper", batch: "3 Transfer Certificates", front: "Official Transfer Certificate", back: "Verification & Registry" },
  transcripts: { title: "Official Academic Transcripts", format: "3-Page Sealed Portfolio", batch: "18 Academic Transcripts", front: "Academic Transcript", back: "Verification & Registrar Seal" },
  testimonials: { title: "Testimonials & Graduation Awards", format: "A4 Award Certificate", batch: "12 Graduation Awards", front: "Graduation Testimonial", back: "Principal's Commendation" },
};

function AlternateDocumentPreview({ tab, student }) {
  const info = TEMPLATE_INFO[tab];
  return (
    <div className="w-full max-w-[520px] rounded-xl border-2 border-brand/30 bg-white p-5 text-slate-800 shadow-sm">
      <div className="border-b-2 border-brand pb-3 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">The Mighty International School</p>
        <h3 className="mt-1 text-xl font-black uppercase">{info.title}</h3>
        <p className="mt-1 text-xs text-slate-500">Victoria Island Annex • Lagos State • 2026/2027 Academic Session</p>
      </div>
      <div className="mt-4 flex items-start gap-3">
        <img src={student.photo} alt="" className="size-16 rounded-lg object-cover" />
        <div className="text-sm">
          <p className="font-bold uppercase">{student.name}</p>
          <p className="text-xs text-slate-500">{student.id} • {student.cls}</p>
          <p className="mt-2 text-xs font-semibold text-brand">{tab === "transfer" ? "Approved for institutional transfer" : tab === "transcripts" ? "Cumulative academic record" : "Awarded for outstanding school service"}</p>
        </div>
      </div>
      {tab === "transcripts" ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 text-xs">
          {["Mathematics — A1 — 91%", "English Language — A1 — 81%", "Physics — A1 — 84%"].map((subject) => <div key={subject} className="flex justify-between border-b border-slate-100 px-3 py-2 last:border-0"><span>{subject.split(" — ")[0]}</span><b className="text-brand">{subject.split(" — ").slice(1).join(" — ")}</b></div>)}
        </div>
      ) : <p className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs leading-relaxed text-slate-600">{tab === "transfer" ? "This certifies that the student has completed the required clearance and may transfer with the school’s approval." : "A diligent and exemplary student whose leadership, conduct, and academic commitment merit this formal commendation."}</p>}
      <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-3 text-[10px] text-slate-500">
        <span>Issued: 06 October 2026<br />Registry hash: MCS-2026-0142</span>
        <span className="rounded bg-green-100 px-2 py-1 font-bold text-green-700">VALIDATED</span>
      </div>
    </div>
  );
}

function QRPattern() {
  const grid = Array.from({length:7},(_,r)=>Array.from({length:7},(_,c)=>{
    const p=[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,0],[1,6],[2,0],[2,2],[2,3],[2,4],[2,6],[3,0],[3,2],[3,4],[3,6],[4,0],[4,2],[4,3],[4,4],[4,6],[5,0],[5,6],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[1,2],[1,3],[1,4],[3,3],[4,1]];
    return p.some(([pr,pc])=>pr===r&&pc===c);
  }));
  return (
    <div className="grid gap-px" style={{gridTemplateColumns:`repeat(7,8px)`}}>
      {grid.flat().map((on,i)=><div key={i} className={`size-2 ${on?"bg-black":"bg-white"}`}/>)}
    </div>
  );
}

function Barcode() {
  const pattern=[1,0,1,1,0,1,0,1,1,0,1,0,0,1,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,0,1,1];
  return (
    <div className="flex h-6 gap-px">
      {pattern.map((on,i)=><div key={i} className={`flex-none ${on?"bg-black":"bg-white"}`} style={{width:"3px"}}/>)}
    </div>
  );
}

function StudentIDCardFront({ student }) {
  return (
    <div className="rounded-xl overflow-hidden text-white select-none" style={{background:"#0d0d1a",width:"280px",minHeight:"440px"}}>
      {/* gold header */}
      <div style={{background:"#c9970a"}} className="text-center py-2 leading-tight">
        <p className="text-[11px] font-black uppercase tracking-widest">THE MIGHTY INTERNATIONAL</p>
        <p className="text-[9px] font-semibold tracking-widest">VICTORIA ISLAND • LAGOS</p>
      </div>
      <div className="text-center py-1 text-[9px] font-bold tracking-widest text-yellow-300">STUDENT IDENTITY CARD</div>
      {/* photo area */}
      <div className="flex justify-center py-3">
        <div className="relative rounded-lg overflow-hidden size-20 bg-slate-700 border-2 border-yellow-500 flex items-center justify-center">
          <img src={student.photo} alt="" className="size-full object-cover" />
          <span className="absolute bottom-1 right-1 grid size-4 place-items-center rounded-full border-2 border-white bg-yellow-500 text-black"><Award size={8} strokeWidth={3}/></span>
        </div>
      </div>
      {/* name */}
      <div className="px-3 text-center">
        <p className="text-lg font-black tracking-wide uppercase leading-tight">{student.name}</p>
        <div className="mt-1 inline-block rounded bg-blue-700 px-3 py-0.5 text-[10px] font-bold tracking-wide">SENIOR STUDENT • SSS 2</div>
      </div>
      {/* details */}
      <div className="mt-2 px-4 text-[11px] space-y-0.5 text-slate-300">
        <div className="flex justify-between"><span className="text-slate-500">ID:</span><span className="font-mono font-semibold">{student.id}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Class:</span><span className="font-semibold">{student.cls}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">DOB:</span><span>{student.dob}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">BLOOD / GENOTYPE:</span><span className="font-semibold text-white">{student.blood} / {student.genotype}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span>{student.phone}</span></div>
      </div>
      {/* house banner */}
      <div className={`mt-3 flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase ${student.houseColor}`}>
        <span>{student.house} • {student.houseColor.includes("red")?"RED":student.houseColor.includes("blue")?"BLUE":student.houseColor.includes("green")?"GREEN":"GOLD"}</span>
        <span>{student.role}</span>
      </div>
      {/* bottom */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-[9px] text-slate-500 font-mono">MIS/2024/0142</span>
        <span className="rounded bg-brand px-2 py-0.5 text-[9px] font-bold">OFFICIAL CR80</span>
      </div>
    </div>
  );
}

function StudentIDCardBack() {
  return (
    <div className="rounded-xl overflow-hidden text-white select-none" style={{background:"#0d0d1a",width:"280px",minHeight:"440px"}}>
      {/* track bar */}
      <div className="bg-black px-3 py-1.5 font-mono text-[8px] text-slate-500">TRACK 2 ENCODED • 6701820374</div>
      {/* return notice */}
      <div className="bg-slate-800 text-center py-1 text-[9px] font-bold tracking-wider text-slate-200">INSTITUTIONAL PROPERTY • RETURN NOTICE</div>
      <div className="p-3">
        <p className="text-[9px] text-slate-400 leading-relaxed">
          This identity card remains the exclusive property of <b className="text-white">The Mighty International School</b>. It must be surrendered upon graduation, transfer, or request by school proctors. If recovered, please return immediately to Plot 14, Victoria Island Annex, Lagos, Nigeria, or call +234 1234 5678.
        </p>
        <div className="mt-3 flex gap-3">
          {/* QR */}
          <div className="bg-white p-1.5 rounded">
            <QRPattern/>
          </div>
          <div>
            <p className="text-[9px] font-bold text-brand">ENCRYPTED VERIFICATION</p>
            <p className="mt-0.5 text-[8px] text-slate-400 leading-tight">Scan via camera to confirm status with MightyEd Guardian Cloud.</p>
            <p className="mt-1.5 text-[8px] text-slate-500 font-mono">HASH: 68BF–43E1–BC77–2026</p>
          </div>
        </div>
        {/* signature */}
        <div className="mt-4 border-t border-slate-700 pt-3">
          <p className="text-xl italic font-bold" style={{color:"#b44cf5",fontFamily:"Georgia,serif"}}>Dr. S. Emmanuel</p>
          <p className="text-[9px] text-slate-400 mt-0.5 tracking-wide">PRINCIPAL / HEAD OF SCHOOL</p>
        </div>
        {/* barcode */}
        <div className="mt-4">
          <Barcode/>
          <div className="mt-1 flex justify-between font-mono text-[8px] text-slate-500">
            <span>ID : MIS2024/0142</span>
            <span>SN : MCS-CR80-2026-0001</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentBuilder() {
  // Page flow: select a document template, customize its data, and render or export the finished documents.
  const toast = useToast();
  const [tab, setTab] = useState("id");
  const [studentIdx, setStudentIdx] = useState(0);
  const [embedQR, setEmbedQR] = useState(true);
  const [hologram, setHologram] = useState(true);
  const [houseColors, setHouseColors] = useState(true);
  const [layout, setLayout] = useState("portrait");
  const [zoom, setZoom] = useState(100);
  const [session, setSession] = useState("2026/2027 Session");
  const [cohort, setCohort] = useState("SSS 2 A - 42 Students");
  const [issueDate, setIssueDate] = useState("2026-10-06");
  const [expiry, setExpiry] = useState("31 July 2028");
  const [officer, setOfficer] = useState("Dr. Samuel Emmanuel");
  const [seal, setSeal] = useState("Official Crest Seal");
  const [bleedMargins, setBleedMargins] = useState(true);
  const [rendered, setRendered] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [cloned, setCloned] = useState(false);
  const [customized, setCustomized] = useState(false);

  const student = STUDENTS[studentIdx];
  const total = STUDENTS.length;
  const template = TEMPLATE_INFO[tab];
  const chooseTemplate = (key) => {
    setTab(key);
    setRendered(false);
    toast(`${TEMPLATE_INFO[key].title} selected`);
  };
  const renderBatch = () => {
    setRendered(true);
    toast(`${template.batch} rendered as PDF`);
  };
  const printBatch = () => {
    setPrinted(true);
    toast(`${template.batch} sent to the print queue`);
  };

  const TABS = [
    ["id",CreditCard,"Student & Staff ID Cards Builder"],
    ["transfer",ScrollText,"Transfer & Character Certificates"],
    ["transcripts",GraduationCap,"Official Academic Transcripts"],
    ["testimonials",Trophy,"Testimonials & Graduation Awards"],
  ];

  return (
    <div className="-m-4 sm:-m-6">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{label:"Communication & Administration"},{label:"Document & Certificate Builder"}]}/>
      </div>

      <div className="min-h-screen bg-indigo-50/70 p-4 sm:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold">Document & Certificate Builder</h1>
          <p className="mt-1 text-sm text-slate-500">Design official institutional templates, manage cryptographic signatures, and batch-generate PVC student identity cards, accredited transfer certificates, and sealed academic transcripts.</p>
        </div>

        {/* main tabs */}
        <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
          {TABS.map(([k,Icon,l])=>(
            <button key={k} onClick={()=>chooseTemplate(k)}
              className={`flex flex-none items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium ${tab===k?"bg-brand text-white":"text-slate-600 hover:bg-slate-50"}`}>
              <Icon size={17} strokeWidth={2}/> {l}
            </button>
          ))}
        </div>

        {/* template cards */}
        <div className="mb-6 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Standard Student ID Card */}
          <div className="card relative border-2 border-brand">
            <span className="absolute -top-3 left-3 rounded-full bg-brand px-3 py-0.5 text-[11px] font-bold text-white">ACTIVE TEMPLATE</span>
            <span className="absolute -top-3 right-3 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand">2026/2027</span>
            <div className="flex items-start gap-3 mt-2">
              <span className="grid size-9 flex-none place-items-center rounded-lg bg-brand-light text-brand"><CreditCard size={18}/></span>
              <div>
                <p className="font-bold">Standard Student ID Card</p>
                <p className="text-xs text-slate-500 mt-0.5">Dual-sided vertical CR80 PVC format with high-density barcode, cryptographic security QR, and emergency bio-ledger.</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-slate-400">FORMAT:</p><p className="font-semibold">CR80 (85.6 × 53.98mm)</p></div>
              <div><p className="text-slate-400">PRINT RUN:</p><p className="font-semibold">Batch 2 Batch (42 Cards)</p></div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">● Synchronized</span>
              <button className="ml-auto text-xs font-semibold text-slate-500 hover:text-brand" onClick={()=>{setCloned(true);toast("Template cloned to a new draft");}}>{cloned ? "Cloned" : "Clone"}</button>
              <button className="btn btn-primary btn-sm" onClick={()=>{setCustomized(true);toast("Layout editor changes applied");}}>{customized ? "Layout Customized" : "Customize Layout"}</button>
            </div>
          </div>

          {/* Official Transfer Certificate */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="grid size-9 flex-none place-items-center rounded-lg bg-blue-50 text-blue-600"><ScrollText size={18}/></span>
                <div>
                  <div className="flex items-center gap-2"><p className="font-bold">Official Transfer Certificate</p><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">Security Paper</span></div>
                  <p className="text-xs text-slate-500 mt-0.5">A4 institutional parchment with Ministry of Education endorsement stamp, conduct ratings, and digital registry link.</p>
                </div>
              </div>

            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-slate-400">DIMENSIONS:</p><p className="font-semibold">A4 Standard (210 × 297mm)</p></div>
              <div><p className="text-slate-400">LAST ISSUED:</p><p className="font-semibold">28 Sep 2026 (3 Dispatched)</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>Ready for intake transfer</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>chooseTemplate("transfer")}>{tab === "transfer" ? "Selected" : "Select Template"}</button>
            </div>
          </div>

          {/* Secondary Academic Transcript */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="grid size-9 flex-none place-items-center rounded-lg bg-purple-50 text-purple-600"><GraduationCap size={18}/></span>
                <div>
                  <div className="flex items-center gap-2"><p className="font-bold">Secondary Academic Transcript</p><span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">WAEC/NECO</span></div>
                  <p className="text-xs text-slate-500 mt-0.5">Multi-page cumulative grade point matrix with cryptographic verification seal and registrar ink signature placeholder.</p>
                </div>
              </div>

            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-slate-400">FORMAT:</p><p className="font-semibold">3-Page Sealed Portfolio</p></div>
              <div><p className="text-slate-400">LAST ISSUED:</p><p className="font-semibold">24 Sep 2026 (18 Dispatched)</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>Cryptographic hash v2.4</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>chooseTemplate("transcripts")}>{tab === "transcripts" ? "Selected" : "Select Template"}</button>
            </div>
          </div>
          {/* Testimonials and graduation awards */}
          <div className="card">
            <div className="flex items-start gap-3">
              <span className="grid size-9 flex-none place-items-center rounded-lg bg-amber-50 text-amber-600"><Trophy size={18}/></span>
              <div>
                <div className="flex items-center gap-2"><p className="font-bold">Testimonials & Graduation Awards</p><span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">A4 Award</span></div>
                <p className="mt-0.5 text-xs text-slate-500">Personalized commendation and graduation award certificates with principal signature and registry verification.</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-slate-400">FORMAT:</p><p className="font-semibold">A4 Portrait Certificate</p></div>
              <div><p className="text-slate-400">LAST ISSUED:</p><p className="font-semibold">30 Sep 2026 (12 Dispatched)</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>Principal signature ready</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>chooseTemplate("testimonials")}>{tab === "testimonials" ? "Selected" : "Select Template"}</button>
            </div>
          </div>
        </div>

        {/* main content */}
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          {/* left: batch engine */}
          <section className="card flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="grid size-9 place-items-center rounded-lg bg-indigo-100 text-brand"><Settings size={18}/></span>
                <div>
                  <h2 className="font-bold">Batch Generation & Data Binding Engine</h2>
                  <p className="text-xs text-slate-500">MIS Student Information System • Live Synced</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700"><span className="size-2 rounded-full bg-green-500"/> API Active</span>
            </div>

            {/* step 1 */}
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-3 flex items-center gap-2 font-semibold"><span className="grid size-6 place-items-center rounded-full bg-brand text-xs font-bold text-white">1</span>Target Academic Cohort & Filtering</p>
              <div className="grid gap-3">
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-600">Academic Session</p>
                  <select value={session} onChange={(e) => setSession(e.target.value)} className="input w-full text-sm py-2.5"><option>2026/2027 Session</option><option>2025/2026 Session</option></select>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-600">Class Level & Arms</p>
                  <select value={cohort} onChange={(e) => setCohort(e.target.value)} className="input w-full text-sm py-2.5"><option>SSS 2 A - 42 Students</option><option>SSS 2 B - 40 Students</option><option>SSS 1 A - 38 Students</option><option>JSS 3 A - 39 Students</option></select>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-indigo-50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <LockKeyhole size={15} className="flex-none text-slate-600"/>
                  <p className="text-sm font-semibold">Financial Clearance Enforcement Lock</p>
                </div>
                <p className="text-xs text-slate-600">Cleared Students Only (Balance = ₦0). 4 defaulters auto-excluded from batch.</p>
                <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700"><Landmark size={12}/> Bursar Verified</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-brand">CO</span>
                <span>Mrs. Chioma Okafor (SSS 2A)</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-500">Co-Lead: Mr. Okon</span>
              </div>
            </div>

            {/* step 2 */}
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-3 flex items-center gap-2 font-semibold"><span className="grid size-6 place-items-center rounded-full bg-brand text-xs font-bold text-white">2</span>Document Customization Variables</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <label className="grid gap-1 text-xs font-medium text-slate-600">Issue Date<input type="date" className="input py-2" value={issueDate} onChange={(e) => setIssueDate(e.target.value)}/></label>
                <label className="grid gap-1 text-xs font-medium text-slate-600">Valid Until (Expiry)<input type="text" className="input py-2" value={expiry} onChange={(e) => setExpiry(e.target.value)}/></label>
              </div>
              <div className="mb-3">
                <p className="mb-2 text-xs font-medium text-slate-600">Card Layout & Form Factor</p>
                <div className="grid grid-cols-2 gap-2">
                  {[["portrait","Vertical Portrait","CR80 (85.6 × 53...)"],["landscape","Horizontal Lan…","Executive Staff S..."]].map(([v,l,s])=>(
                    <label key={v} className={`flex cursor-pointer items-start gap-2 rounded-xl border-2 p-2.5 ${layout===v?"border-brand bg-brand-light":"border-slate-200"}`}>
                      <input type="radio" name="layout" value={v} checked={layout===v} onChange={()=>setLayout(v)} className="mt-0.5 accent-brand"/>
                      <div><p className="text-xs font-semibold">{l}</p><p className="text-[10px] text-slate-500">{s}</p></div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <label className="grid gap-1 text-xs font-medium text-slate-600">Authorizing Officer Signature
                  <select value={officer} onChange={(e) => setOfficer(e.target.value)} className="input py-2 text-xs"><option>Dr. Samuel Emmanuel</option><option>Prof. A. C. Nwosu</option></select>
                </label>
                <label className="grid gap-1 text-xs font-medium text-slate-600">Institutional Seal Style
                  <select value={seal} onChange={(e) => setSeal(e.target.value)} className="input py-2 text-xs"><option>Official Crest Seal</option><option>Minimal Seal</option></select>
                </label>
              </div>
              <div className="space-y-2">
                {[["embedQR",embedQR,setEmbedQR,"Embed Cryptographic Verification QR Code"],["hologram",hologram,setHologram,"Iridescent Golden Hologram Foil Band"],["houseColors",houseColors,setHouseColors,"Auto-detect Student House Colors & Crest"]].map(([k,val,set,l])=>(
                  <label key={k} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" className="size-4 accent-brand" checked={val} onChange={()=>set(!val)}/>
                    {l}
                    {val&&<span className="ml-auto size-4 rounded bg-brand"/>}
                  </label>
                ))}
              </div>
            </div>

            {/* batch summary */}
            <div className="rounded-xl bg-slate-800 p-4 text-white">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-2xl font-bold">{template.batch}</p>
                  <p className="text-xs text-slate-400">100% Cleared by Bursary • {session} • {cohort}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs font-semibold">{template.format} • 300 DPI</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">Est. Render: ~4.2s</p>
              <div className="mt-3 flex flex-col gap-2">
                <button className="btn btn-primary w-full justify-center" onClick={renderBatch}><Download size={14}/> {rendered ? "Batch Rendered" : `Render ${template.title}`}</button>
                <button className="btn w-full justify-center border border-slate-600 text-white hover:bg-slate-700" onClick={printBatch}><Printer size={14}/> {printed ? "Print Queue Updated" : `Send ${template.format} to Printer`}</button>
                <button className="flex items-center gap-1.5 text-left text-xs text-brand underline" onClick={()=>{downloadCSV("student-cards.csv",STUDENTS.map(s=>({ID:s.id,Name:s.name,Class:s.cls})));toast("CSV exported");}}><FileSpreadsheet size={14}/> Export Data to Excel/CSV</button>
                <p className="text-[10px] text-slate-500">Queue ID: #JOB-2026-0941</p>
              </div>
            </div>
          </section>

          {/* right: live canvas */}
          <section className="flex flex-col gap-4">
            <div className="card overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500"/>
                  <p className="font-semibold">Live Canvas • {template.format}</p>
                </div>
                <p className="text-xs text-slate-500">Previewing: {student.name} ({student.cls})</p>
              </div>

              {/* zoom controls */}
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-2">
                <button className="icon-btn" onClick={()=>setZoom(z=>Math.max(50,z-10))}>−</button>
                <span className="text-sm font-medium">{zoom}%</span>
                <button className="icon-btn" onClick={()=>setZoom(z=>Math.min(150,z+10))}>+</button>
                <span className="text-xs text-slate-400 ml-2">|</span>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" className="accent-brand" checked={bleedMargins} onChange={(e) => setBleedMargins(e.target.checked)}/>
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand">Bleed Margins (3mm)</span>
                </label>
              </div>

              {/* card preview */}
              <div className="bg-slate-200 p-6">
                <div className="flex flex-wrap justify-center gap-6">
                  <div>
                    <p className="mb-2 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">{template.front}</p>
                    <div style={{transform:`scale(${zoom/100})`,transformOrigin:"top center"}}>
                      {tab === "id" ? <StudentIDCardFront student={student}/> : <AlternateDocumentPreview tab={tab} student={student}/>}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-green-500"/>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{template.back}</p>
                    </div>
                    <div style={{transform:`scale(${zoom/100})`,transformOrigin:"top center"}}>
                      {tab === "id" ? <StudentIDCardBack/> : <AlternateDocumentPreview tab={tab} student={student}/>}
                    </div>
                  </div>
                </div>
              </div>

              {/* navigation */}
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                <button className="btn btn-ghost btn-sm" disabled={studentIdx===0} onClick={()=>setStudentIdx(i=>Math.max(0,i-1))}>
                  <ChevronLeft size={15}/> Previous Student
                </button>
                <p className="text-sm font-medium text-slate-600">Student {studentIdx+1} of {total} • {student.name}</p>
                <button className="btn btn-ghost btn-sm" disabled={studentIdx===STUDENTS.length-1} onClick={()=>setStudentIdx(i=>Math.min(STUDENTS.length-1,i+1))}>
                  Next Student <ChevronRight size={15}/>
                </button>
              </div>
            </div>

            {/* pre-flight validation */}
            <section className="card">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane size={18} className="text-slate-500"/>
                  <h2 className="font-semibold">Pre-Flight Print Validation & Quality Audit</h2>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">All Checks Passed</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {icon:Award,label:"Photo DPI Integrity",detail:"42/42 high-res portraits exceed 300 DPI",ok:true},
                  {icon:Banknote,label:"Bursar Clearances",detail:"42/42 students zero outstanding balances",ok:true},
                  {icon:QrCode,label:"QR Hash Entropy",detail:"256-bit SHA keys verified on cloud registry",ok:true},
                ].map((c)=>{
                  const Icon = c.icon;
                  return (
                  <div key={c.label} className="rounded-xl bg-green-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={15} className="text-green-600"/>
                      <p className="text-sm font-semibold text-green-800">{c.label}</p>
                    </div>
                    <p className="text-xs text-green-700">{c.detail}</p>
                  </div>
                  );
                })}
              </div>
            </section>

            {/* batch registry */}
            <section className="card">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-semibold">Active Batch Sample Registry (SSS 2 Gold)</h2>
                <span className="text-xs text-slate-500">Viewing 1 of 42</span>
              </div>
              <div className="overflow-hidden">
                <table className="w-full border-collapse text-xs">
                  <thead><tr className="bg-slate-50 border-y border-slate-200">
                    {["Student Name","ID","Class","House","Role","Status"].map(h=>(
                      <th key={h} className="py-2 pl-3 text-left font-semibold text-slate-500">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {STUDENTS.map((s,i)=>(
                      <tr key={s.id} onClick={()=>setStudentIdx(i)}
                        className={`border-t border-slate-100 cursor-pointer ${studentIdx===i?"bg-blue-50":"hover:bg-slate-50"}`}>
                        <td className="py-2 pl-3 font-medium">{s.name}</td>
                        <td className="py-2 pl-3 font-mono text-brand">{s.id}</td>
                        <td className="py-2 pl-3">{s.cls}</td>
                        <td className="py-2 pl-3">{s.house}</td>
                        <td className="py-2 pl-3">{s.role}</td>
                        <td className="py-2 pl-3"><span className="rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-700">Cleared</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}