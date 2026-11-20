import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download, ChevronDown, CalendarDays, Building2, UserRoundCheck, Settings2,
  Utensils, MapPin, Plus, UsersRound, AlertTriangle,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";
import StatusFooter from "../components/StatusFooter.jsx";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const DAY_SLOTS = [8, 8, 8, 8, 8];

const PERIODS = [
  { n: 1, start: "08:00", end: "08:45", note: "Morning Bell" },
  { n: 2, start: "08:45", end: "09:30", note: "45 Mins" },
  { n: 3, start: "09:30", end: "10:15", note: "45 Mins" },
  { break: true, label: "Morning Break & Homeroom Check-in", time: "10:15 AM – 10:30 AM", note: "• 15 Minutes Pastoral Support & Refreshment" },
  { n: 4, start: "10:30", end: "11:15", note: "45 Mins" },
  { n: 5, start: "11:15", end: "12:00", note: "45 Mins" },
  { break: true, label: "Midday Lunch & Recreation Break", time: "12:00 – 12:45", note: "• 45 Mins Cafeteria Dining & Supervised Recreation" },
  { n: 6, start: "12:45", end: "01:30", note: "45 Mins" },
  { n: 7, start: "01:30", end: "02:15", note: "45 Mins" },
  { n: 8, start: "02:15", end: "03:00", note: "Closing Slot" },
];

const CAT = {
  "CORE MATH": "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  "LAB SCIENCE": "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  "HUMANITIES": "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  "SCIENCE": "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200",
  "SOCIAL SCI": "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  "ADVANCED": "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
  "ICT & TECH": "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  "COMMERCIAL": "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  "TECHNICAL": "bg-slate-200 text-slate-700 ring-1 ring-slate-300",
  "ATHLETICS": "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  "RESEARCH": "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  "VOCATIONAL": "bg-lime-100 text-lime-700 ring-1 ring-lime-200",
  "CO-CURRICULAR": "bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200",
  "ASSEMBLY": "bg-pink-100 text-pink-700 ring-1 ring-pink-200",
  "MORAL/REL": "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
  "PASTORAL": "bg-teal-100 text-teal-700 ring-1 ring-teal-200",
  "SOCIETY": "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  "MODERN LANG": "bg-pink-100 text-pink-700 ring-1 ring-pink-200",
  "BIO SCIENCE": "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
};

const GRID = {
  MONDAY:   { 1:{c:"CORE MATH",n:"Mathematics",t:"Mr. Okon",r:"Rm 14",x:""},2:{c:"CORE MATH",n:"Mathematics",t:"Mr. Okon",r:"Rm 14",x:"Part 2/2"},3:{c:"HUMANITIES",n:"English Language",t:"Mrs. Okafor",r:"Rm 14",x:"Grammar"},4:{c:"LAB SCIENCE",n:"Biology Theory",t:"Mrs. Adeleke",r:"Bio Lab 1",x:"1 of 2"},5:{c:"LAB SCIENCE",n:"Biology Theory",t:"Mrs. Adeleke",r:"Bio Lab 1",x:"2 of 2"},6:{c:"MORAL/REL",n:"Civic Education",t:"Mr. Bello",r:"Rm 14",x:"Governance"},7:{c:"ATHLETICS",n:"Inter-House Sports & PE",t:"Coach Bassey",r:"Sports Oval",x:"1 of 2"},8:{c:"ATHLETICS",n:"Inter-House Sports & PE",t:"Coach Bassey",r:"Sports Oval",x:""} },
  TUESDAY:  { 1:{c:"LAB SCIENCE",n:"Physics Practical",t:"Dr. Alabi",r:"Physics Lab 2",x:"Double"},2:{c:"LAB SCIENCE",n:"Physics Practical",t:"Dr. Alabi",r:"Physics Lab 2",x:"Double (Part 2)"},3:{c:"SCIENCE",n:"Chemistry Theory",t:"Mr. Danjuma",r:"Rm 14",x:"Periodic T"},4:{c:"ADVANCED",n:"Further Mathematics",t:"Mr. Okon",r:"Rm 14",x:"Calculus"},5:{c:"SOCIAL SCI",n:"Economics & Entr.",t:"Mrs. Folashade",r:"Rm 14",x:"1 of 2"},6:{c:"SOCIAL SCI",n:"Economics & Entr.",t:"Mrs. Folashade",r:"Rm 14",x:"2 of 2"},7:{c:"RESEARCH",n:"Library & Study",t:"Mrs. Eze",r:"Central Lib.",x:"Quiet"},8:{c:"RESEARCH",n:"Library & Study",t:"Mrs. Eze",r:"Central Lib.",x:"Checkout"} },
  WEDNESDAY:{ 1:{c:"LAB SCIENCE",n:"Chemistry Practical",t:"Mr. Danjuma",r:"Chem Lab",x:"1 of 2"},2:{c:"LAB SCIENCE",n:"Chemistry Practical",t:"Mr. Danjuma",r:"Chem Lab",x:"2 of 2"},3:{c:"HUMANITIES",n:"English Literature",t:"Mrs. Okafor",r:"Rm 14",x:"Poetry"},4:{c:"COMMERCIAL",n:"Financial Accounting",t:"Mr. Lawal",r:"Comm. Rm 8",x:"Ledgers"},5:{c:"ICT & TECH",n:"Data Processing",t:"Engr. Chinedu",r:"ICT Lab 2",x:"Python"},6:{c:"MODERN LANG",n:"French Language",t:"Mme. Dubois",r:"Lang Lab",x:"Oral Conv."},7:null,8:{c:"CO-CURRICULAR",n:"Clubs & Societies",t:"Club Patrons",r:"Multiple Hubs",x:"Elective"} },
  THURSDAY: { 1:{c:"TECHNICAL",n:"Technical Drawing",t:"Arc. Balogun",r:"CAD Studio",x:"Theory"},2:{c:"SCIENCE",n:"Physics Theory",t:"Dr. Alabi",r:"Rm 14",x:"Optics"},3:{c:"SOCIAL SCI",n:"Geography",t:"Mr. Suleiman",r:"Rm 14",x:"Cartography"},4:{c:"VOCATIONAL",n:"Agricultural Science",t:"Mr. Yakubu",r:"Agro Lab",x:"Soil Chem."},5:{c:"HUMANITIES",n:"English Language",t:"Mrs. Okafor",r:"Rm 14",x:"Essay"},6:{c:"ADVANCED",n:"Further Mathematics",t:"Mr. Okon",r:"Rm 14",x:"Vectors"},7:null,8:{c:"PASTORAL",n:"Supervised Study Prep",t:"Form Tutors",r:"Rm 14",x:"Quiet"} },
  FRIDAY:   { 1:{c:"ASSEMBLY",n:"All-School Assembly",t:"Principal & Staff",r:"Auditorium Hall",x:"Mandatory"},2:{c:"CORE MATH",n:"Mathematics",t:"Mr. Okon",r:"Rm 14",x:"Trig."},3:{c:"BIO SCIENCE",n:"Biology Theory",t:"Mrs. Adeleke",r:"Rm 14",x:"Genetics"},4:{c:"MORAL/REL",n:"CRS / IRS Studies",t:"Pastor Paul / Ustaz",r:"Split Rm",x:"Ethics"},5:{c:"SOCIAL SCI",n:"Civic Education",t:"Mr. Bello",r:"Rm 14",x:"Constitution"},6:{c:"CO-CURRICULAR",n:"JETS & STEM Club",t:"Engr. Chinedu",r:"MakerSpace",x:""},7:{c:"SOCIETY",n:"Literary & Debating",t:"Mrs. Okafor",r:"Rm 14",x:"WASSCE Prep"},8:{c:"PASTORAL",n:"Weekend Pastoral Close",t:"Mrs. Adeleke",r:"Rm 14",x:"Departure"} },
};

function Cell({ slot }) {
  if (!slot) return (
    <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-2 text-center text-xs text-slate-400">
      <Plus size={14} className="mb-1 text-brand" />
      Drag & Drop Subject<br />or click to auto-allocate
    </div>
  );
  return (
    <div className="min-h-20 rounded-lg border border-slate-200 bg-white p-2 hover:shadow-md hover:border-brand/40 transition-all cursor-pointer">
      <span className={`mb-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${CAT[slot.c] ?? "bg-slate-100 text-slate-600"}`}>{slot.c}</span>
      <p className="text-xs font-semibold leading-tight">{slot.n}</p>
      <p className="flex items-center gap-1 text-[11px] text-slate-500"><UserRoundCheck size={11} /> {slot.t}</p>
      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><MapPin size={10} /> {slot.r}</span>
        {slot.x && <span className="text-brand font-medium">{slot.x}</span>}
      </div>
    </div>
  );
}

export default function TimetableManager() {
  // Page flow: inspect the weekly schedule, detect clashes, and open the focused timetable creation workflow.
  const nav = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("grid");
  const [arm, setArm] = useState("Senior Sec. (SSS 2 – Gold)");
  const [subTab, setSubTab] = useState("arm");

  return (
    <div className="-m-4 sm:-m-6 flex min-h-screen flex-col">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label: "Academic & Exam Oversight" }, { label: "Class & Timetable Manager" }]} />
      </div>

      <div className="flex-1 bg-indigo-50/70 p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Class & Timetable Manager</h1>
            <p className="mt-1 text-sm text-slate-500">Configure class arms, allocate subject periods, assign form teachers, and build interactive weekly master timetables.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button className="btn btn-ghost" onClick={() => toast("Exporting schedule...")}><Download size={14} /> Export Schedule</button>
            <button className="btn btn-primary" onClick={() => nav("/create-timetable")}>
            + Create New Timetable
            </button>
            <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
              <span className="size-2 rounded-full bg-green-500" /> 0 Period Overlaps / Overload Detected
            </span>
          </div>
        </div>

        {/* main tabs */}
        <div className="mb-4 flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
          {[["grid","Interactive Weekly Grid","40 Periods"],["matrix","Subject & Period Matrix",""],["teachers","Class Arms & Form Teachers",""]].map(([k,l,c])=>(
            <button key={k} onClick={()=>setTab(k)}
              className={`flex flex-none items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium ${tab===k?"bg-brand text-white":"text-slate-600 hover:bg-slate-50"}`}>
              {l}
              {c && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tab===k?"bg-white/20 text-white":"bg-indigo-100 text-brand"}`}>{c}</span>}
            </button>
          ))}
        </div>

        {/* controls */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" onClick={() => toast("Academic term selector opened")}>
            <CalendarDays size={15} className="text-brand" />
            Target Academic Term: 2026/2027 Session - Term 1 <ChevronDown size={13} />
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" onClick={() => toast("Class arm selector opened")}>
            <Building2 size={15} className="text-brand" />
            Active Arm: {arm} <ChevronDown size={13} />
          </button>
          <span className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3.5 py-2.5 text-sm">
            <UserRoundCheck size={15} className="text-brand" />
            Form Teacher: Mrs. K. Adeleke (Science Wing)
          </span>
        </div>

        {/* sub-tabs */}
        <div className="mb-4 flex gap-1 rounded-lg bg-white p-1 w-fit shadow-sm">
          {[["arm","Class Arm View"],["teacher","Teacher Schedule"],["room","Room Utilization"]].map(([k,l])=>(
            <button key={k} onClick={()=>setSubTab(k)}
              className={`rounded-md px-3.5 py-2 text-sm font-medium ${subTab===k?"bg-brand text-white":"text-slate-600 hover:bg-slate-50"}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
          {/* timetable grid */}
          <section className="card overflow-x-auto p-0">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="w-32 border-b border-r border-slate-200 py-3 px-3 text-left text-xs font-semibold text-slate-500">PERIOD / TIME</th>
                  {DAYS.map((d, i) => (
                    <th key={d} className="border-b border-l border-slate-200 py-3 px-2 text-left text-xs font-semibold text-slate-700">
                      {d}<br /><span className="text-[10px] font-normal text-slate-400">{DAY_SLOTS[i]} slots</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((p, idx) => {
                  if (p.break) return (
                    <tr key={`break-${idx}`} className="bg-indigo-50/80">
                      <td className="border-y border-slate-200 py-2 px-3 text-xs font-semibold text-indigo-700">
                        <span className="inline-flex items-center gap-1.5"><Utensils size={13} /> {p.label}</span>
                      </td>
                      <td colSpan={5} className="border-y border-slate-200 py-2 px-2 text-xs text-slate-500">
                        {p.note} <span className="ml-4 text-slate-400">{p.time}</span>
                      </td>
                    </tr>
                  );
                  return (
                    <tr key={`period-${p.n}`}>
                      <td className="border-r border-b border-slate-200 py-2 px-3 align-top">
                        <p className="text-xs font-semibold text-slate-700">Period {p.n}</p>
                        <p className="text-[11px] text-brand font-medium">{p.start} – {p.end}</p>
                        <p className="text-[10px] text-slate-400">{p.note}</p>
                      </td>
                      {DAYS.map((d) => (
                        <td key={d} className="border-l border-b border-slate-200 p-1.5 align-top">
                          <Cell slot={GRID[d]?.[p.n]} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* right panel */}
          <aside className="flex flex-col gap-4">
            <section className="card">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Unallocated Periods Queue</h2>
                <button className="icon-btn text-brand" onClick={() => toast("Filtering periods...")} aria-label="Filter periods"><Settings2 size={15} /></button>
              </div>
              <div className="mb-3 rounded-xl bg-indigo-50/80 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold">Weekly Load Allocated (85%)</span>
                  <span className="text-xs font-bold text-brand">34/40 Periods</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 mb-1"><div className="h-full rounded-full bg-brand" style={{ width: "85%" }} /></div>
                <p className="text-xs text-slate-500">6 slots pending assignment</p>
                <p className="text-xs text-slate-400">Target: 100% (40)</p>
              </div>
              <input className="input mb-3 py-2 text-xs" placeholder="Filter subject pool or faculty" />
              {[
                { tag:"DOUBLE PERIOD REQUIRED", tc:"bg-indigo-100 text-indigo-700", name:"Chemistry Practical", teacher:"Mr. Danjuma (2 of 4 Left)", room:"Chemistry Lab", urgency:"Priority High", uc:"text-red-600" },
                { tag:"SINGLE SLOT", tc:"bg-slate-100 text-slate-700", name:"Technical Drawing / CAD", teacher:"Arc. Balogun (1 Period Rem.)", room:"CAD Studio Rm 3", urgency:"Technical", uc:"text-slate-500" },
                { tag:"MORAL CORE", tc:"bg-amber-100 text-amber-700", name:"Civic & Moral Instruction", teacher:"Mr. Bello (1 Period Rem.)", room:"Rm 14", urgency:"General", uc:"text-slate-500" },
                { tag:"OUTDOOR PRACTICUM", tc:"bg-green-100 text-green-700", name:"Agricultural Science Practicum", teacher:"Mr. Yakubu (2 Periods Rem.)", room:"School Farm Plot", urgency:"Double Preferred", uc:"text-orange-600" },
              ].map((u) => (
                <div key={u.name} className="mb-2 rounded-xl border border-slate-200 p-2.5">
                  <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold mb-1 ${u.tc}`}>{u.tag}</span>
                  <p className="text-xs font-semibold">{u.name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500"><UserRoundCheck size={11} /> {u.teacher}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin size={10} /> {u.room}</span>
                    <span className={`text-[11px] font-semibold ${u.uc}`}>{u.urgency}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="card">
              <h2 className="mb-3 text-sm font-semibold">Faculty Workload Meters <span className="text-xs font-normal text-slate-400">Max 28/wk</span></h2>
              {[
                { name: "Mr. Okon (Math)", load: 24, max: 28, pct: 86 },
                { name: "Mrs. Okafor (English)", load: 22, max: 28, pct: 79 },
                { name: "Dr. Alabi (Physics)", load: 18, max: 24, pct: 75 },
              ].map((f) => (
                <div key={f.name} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{f.name}</span>
                    <span className="font-bold">{f.load}/{f.max} Periods ({f.pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${f.pct > 90 ? "bg-red-500" : f.pct > 75 ? "bg-green-500" : "bg-blue-400"}`} style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs">
                <p className="font-semibold mb-0.5">Room Utilization</p>
                <p className="text-slate-500">Rm 14: 92% • Labs: 78%</p>
                <button className="mt-1.5 w-full rounded-md bg-red-100 py-1.5 text-center text-[11px] font-semibold text-red-700 hover:bg-red-200"
                  onClick={() => toast("Running clash detector...")}>
                  <span className="inline-flex items-center gap-1"><AlertTriangle size={12}/> Run Automated Clash Detector</span>
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
      <StatusFooter />
    </div>
  );
}