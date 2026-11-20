import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Phone, Download, AlertTriangle, ClipboardList, HeartPulse, UsersRound,
  GraduationCap, CalendarCheck2, WalletCards, ShieldCheck, Mail,
  FileText, ReceiptText, Link2, RefreshCw, BadgeCheck, PhoneCall,
  MessageCircle, MapPin,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import Avatar from "../components/Avatar.jsx";
import { useApp, useToast } from "../context/AppContext.jsx";
import { idToSlug } from "../data/students.js";

const EXT = {
  "MIS/2024/0142": {
    fullName: "Samuel Oluwaseun Adebayo", dob: "12 April 2010", age: 15,
    bloodGroup: "O+", genotype: "AA", boarding: "Hall 3B", house: "Niger House",
    role: "Class Prefect", enrolled: "Sept. 2024",
    religion: "Christianity / English, Yoruba",
    address: "Plot 14, Admiralty Way, Lekki Phase 1, Lagos State, Nigeria",
    classTeacher: "Mr. D. Okon (Senior Mathematics)",
    houseCoCurriculars: "STEM & Robotics (VP) • Niger House",
    enrollmentModel: "Day Student — Authorized Bus Route 4 (Lekki / Ikoyi Toll Corridor)",
    gpa: 3.85, gpaMax: 4.0, gpaRank: "Ranked 3rd of 42",
    attendance: 96.4, attendanceDays: "58 of 60 Days Present",
    bursaryBalance: 0, bursaryLabel: "100% Cleared (Term 3)",
    discipline: 0, disciplineLabel: "Exemplary Grade A+",
    allergyAlert: "Severe Peanut / Legume Allergy",
    allergyNote: "Strict anaphylaxis protocol active. Do not permit unmonitored confectionery during school meal service or bake sales.",
    emergencyDoctor: "Dr. Kunle Adebayo (Father) • +234 803 123 4567 • Consultant Physician, LUTH",
    sickBayNote: "Student carries personal EpiPen inside school backpack (Lock Box #14 in Sick Bay annex). Approved for athletic participation under regular hydration supervision.",
    guardians: [
      {
        initials: "KA", name: "Dr. Kunle Adebayo", role: "Father • Primary",
        title: "Senior Medical Officer / Consultant Surgeon, LUTH",
        phone: "+234 803 123 4567", email: "k.adebayo@gmail.com",
        tags: ["Primary Billing Sponsor", "SMS Alerts Active", "Portal Account Verified"],
        tagColors: ["bg-green-100 text-green-700", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700"],
      },
      {
        initials: "YA", name: "Mrs. Yewande Folake Adebayo", role: "Mother",
        title: "Legal Practitioner / Managing Partner, Adebayo & Co.",
        phone: "+234 802 998 7654", email: "yewande.a@gmail.com",
        tags: ["Emergency Contact #2", "Portal Account Active", "Report Card Receiver"],
        tagColors: ["bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700", "bg-indigo-100 text-indigo-700"],
      },
    ],
    transcript: [
      { subject: "Mathematics",     ca1: 18, ca2: 19, exam: 54, total: 91, grade: "A+", gLabel: "Distinction", remarks: "Outstanding analytical skills & proofs",             teacher: "Mr. D. Okon"   },
      { subject: "English Language", ca1: 16, ca2: 17, exam: 48, total: 81, grade: "A",  gLabel: "Distinction", remarks: "Articulate essay structure & speech delivery",        teacher: "Mrs. E. Okafor" },
      { subject: "Physics",          ca1: 15, ca2: 18, exam: 51, total: 84, grade: "A",  gLabel: "Distinction", remarks: "Exceptional laboratory practicals & lab safety",     teacher: "Dr. B. Alabi"   },
      { subject: "Chemistry",        ca1: 14, ca2: 16, exam: 45, total: 75, grade: "B",  gLabel: "Very Good",   remarks: "Consistent organic chemistry stoichiometry",          teacher: "Mr. C. Chukwu"  },
      { subject: "Biology",          ca1: 17, ca2: 18, exam: 50, total: 85, grade: "A",  gLabel: "Distinction", remarks: "High aptitude in biological taxonomy",                teacher: "Mrs. A. Balogun"},
      { subject: "Civic Education",  ca1: 19, ca2: 18, exam: 52, total: 89, grade: "A",  gLabel: "Distinction", remarks: "Active class governance debate lead",                 teacher: "Mr. T. Danjuma" },
    ],
    gpaHistory: [
      { label: "JSS 1", gpa: 3.42 }, { label: "JSS 2", gpa: 3.55 }, { label: "JSS 3", gpa: 3.68 },
      { label: "SSS 1.1", gpa: 3.78 }, { label: "SSS 2.1", gpa: 3.80 }, { label: "SSS 2.2", gpa: 3.82 }, { label: "SSS 2.3", gpa: 3.85 },
    ],
    attendanceWeeks: [
      { week: "Week 1 (Oct 02)",              days: ["07:44", "07:39", "07:40", "07:44", "07:41"] },
      { week: "Week 4 (Oct 23)",              days: ["07:46", "07:40", "07:41", "07:42", "07:39"] },
      { week: "Week 8 (Nov 20 – Term Final)", days: ["08:12", "07:44", "07:38", "07:45", "07:42"] },
    ],
    invoices: [
      { date: "10 Sept, 2025", ref: "INV-2025-0891", desc: "Term 3 Tuition, STEM Lab & ICT Levy — Secondary Standard Academic Bundle",           amount: 350000, gateway: "Monnify Card",         receipt: "REC-8841.pdf" },
      { date: "12 Sept, 2025", ref: "INV-2026-0940", desc: "SSS 2 Textbooks, Uniforms & Locker Fee — Curriculum pack & locker slot #14",          amount: 100000, gateway: "Zenith NIBSS Direct", receipt: "REC-8902.pdf" },
    ],
  },
};

const GRADE_BG = { "A+": "bg-green-100 text-green-700", "A": "bg-green-50 text-green-600", "B": "bg-blue-100 text-blue-700", "C": "bg-yellow-100 text-yellow-700" };
const TABS = [
  ["Overview & Personal Info", "overview"],
  ["Linked Parent / Guardian", "guardians"],
  ["Transcripts & Gradebook", "transcripts"],
  ["Attendance History", "attendance"],
];

function StatCol({ label, value, sub, subColor, pct, barColor }) {
  return (
    <div className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold leading-tight">{value}</p>
      <p className={`mt-0.5 text-xs ${subColor}`}>{sub}</p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}

export default function StudentProfile() {
  // Page flow: load one student's records, switch between detail sections, and expose guardian and billing actions.
  const slug = useParams().id;
  const { students } = useApp();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const s = students.find((x) => idToSlug(x.id) === slug);
  const e = EXT[s?.id] ?? {};

  if (!s) return (
    <div className="card flex flex-col items-center gap-4 py-16 text-center">
      <h2 className="text-xl font-semibold">Student not found</h2>
      <Link className="btn btn-primary" to="/students">Back to directory</Link>
    </div>
  );

  return (
    <div className="-m-4 sm:-m-6">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label: "Student Records Management" }, { label: "Student Directory & Roster", to: "/students" }, { label: "Student Profile & Academic History" }]} />
      </div>

      <div className="min-h-screen bg-indigo-50/70 p-6">
        <h1 className="mb-5 text-xl font-bold">Student Profile & Academic History</h1>

        {/* header card */}
        <div className="mb-5 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-wrap items-start gap-5 border-b border-slate-100 p-5">
            <Avatar student={s} size={80} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{s.name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700"><BadgeCheck size={12} /> Verified</span>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">Admission No: {s.id} • Enrolled: {e.enrolled ?? "N/A"}</p>
              {e.house && <p className="text-sm text-slate-500">Academic House: {e.house} ({e.boarding})</p>}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-brand">{s.cls} - Senior</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">{s.gender} • {s.age} yrs</span>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">● Active Enrollee</span>
                {e.role && <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700"><ShieldCheck size={12} /> {e.role}</span>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-100 lg:grid-cols-4">
            <StatCol label="Overall GPA" value={`${e.gpa ?? "—"}/4.0`} sub={e.gpaRank ?? ""} subColor="text-slate-600" pct={e.gpa ? (e.gpa / 4) * 100 : 0} barColor="bg-brand" />
            <StatCol label="Attendance" value={e.attendance ? `${e.attendance}%` : "—"} sub={e.attendanceDays ?? ""} subColor="text-slate-500" pct={e.attendance ?? 0} barColor="bg-blue-500" />
            <StatCol label="Bursary Standing" value={`₦${(e.bursaryBalance ?? 0).toLocaleString()}.00 Due`} sub={e.bursaryLabel ?? ""} subColor="text-green-600" pct={100} barColor="bg-green-500" />
            <StatCol label="Discipline" value={`${e.discipline ?? 0} Alerts`} sub={e.disciplineLabel ?? ""} subColor="text-green-600" pct={100} barColor="bg-brand" />
          </div>
        </div>

        {/* tabs */}
        <div className="mb-5 flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
          {TABS.map(([label, id]) => {
            const Icon = id === "overview" ? ClipboardList : id === "guardians" ? UsersRound : id === "transcripts" ? GraduationCap : CalendarCheck2;
            return (
            <a key={id} href={`#${id}`} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition ${activeTab === id ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>
              <Icon size={14} />
              {label}
              {label.includes("Guardian") && <span className="rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] text-white">2 Verified</span>}
              {label.includes("Transcript") && <span className="text-xs text-slate-400">Term 3 Final</span>}
              {label.includes("Attendance") && <span className="text-xs text-slate-400">96.4%</span>}
            </a>
            );
          })}
        </div>

        {/* Tab 0: Overview */}
        <div id="overview" className="scroll-mt-24 grid gap-5 lg:grid-cols-2">
            <section className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold"><ClipboardList size={16} className="text-brand" /> Personal & Academic Demographics</h2>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">VERIFIED BIO</span>
              </div>
              <dl className="grid gap-3.5 text-sm">
                {[
                  ["Full Legal Name",           e.fullName ?? s.name],
                  ["Date of Birth & Age",        e.dob ? `${e.dob} (${e.age} Years Old)` : "—"],
                  ["Blood Group & Genotype",     e.bloodGroup ? `${e.bloodGroup}  •  ${e.genotype}` : "—"],
                  ["Religion / Languages",       e.religion ?? "—"],
                  ["Residential Address",        e.address ?? "—"],
                  ["Assigned Class Teacher",     e.classTeacher ?? "—"],
                  ["House & Co-Curriculars",     e.houseCoCurriculars ?? "—"],
                  ["Enrollment & Boarding Model",e.enrollmentModel ?? "—"],
                ].map(([l, v]) => (
                  <div key={l} className="grid gap-0.5">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{l}</dt>
                    <dd className="font-medium leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold"><HeartPulse size={16} className="text-red-500" /> Medical Records & Sick Bay</h2>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">HIGH ATTENTION</span>
              </div>
              {e.allergyAlert && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600"><AlertTriangle size={14} /> Allergy Alert: {e.allergyAlert}</p>
                  <p className="mt-1 text-xs text-slate-700">{e.allergyNote}</p>
                </div>
              )}
              {e.emergencyDoctor && (
                <div className="mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Emergency Physician Contact</p>
                  <p className="mt-1 text-sm font-medium">{e.emergencyDoctor}</p>
                </div>
              )}
              {e.sickBayNote && (
                <div className="mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">School Sick Bay Protocol & Notes</p>
                  <p className="mt-1 text-sm text-slate-600">{e.sickBayNote}</p>
                </div>
              )}
              <div className="rounded-xl bg-green-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Immunization Card</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="font-semibold text-green-700">Fully Vaccinated / Cleared</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">✓ Verified 14 Jan 2026</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-400">✓ Compliant with National Educational Health Privacy Regulation</p>
            </section>
        </div>

        {/* Tab 1: Guardians */}
        <div id="guardians" className="scroll-mt-24 mt-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold"><UsersRound size={16} className="text-brand" /> Linked Parent / Guardian Accounts</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => toast("Opening link guardian form...")}>+ Link New Guardian</button>
            </div>
            {e.guardians ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {e.guardians.map((g) => (
                  <div key={g.name} className="card">
                    <div className="flex items-start gap-3">
                      <span className="grid size-11 flex-none place-items-center rounded-full bg-indigo-100 font-bold text-brand">{g.initials}</span>
                      <div className="min-w-0">
                        <p className="font-bold">{g.name}</p>
                        <p className="text-xs text-slate-500">{g.role}</p>
                        <p className="text-xs text-slate-400">{g.title}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5 text-sm">
                      <p className="flex items-center gap-2 text-xs"><Phone size={12} className="text-slate-400" />{g.phone}</p>
                      <p className="flex items-center gap-2 text-xs"><Mail size={12} className="text-slate-400" />{g.email}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {g.tags.map((t, i) => (
                        <span key={t} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${g.tagColors[i]}`}>{t}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      <button className="btn btn-ghost btn-sm" onClick={() => toast("Opening WhatsApp...")}><MessageCircle size={12} /> WhatsApp</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast("Reset PIN sent")}><RefreshCw size={12} /> Reset PIN</button>
                      <button className="btn btn-primary btn-sm" onClick={() => toast(`Calling ${g.name}...`)}><PhoneCall size={12} /> Call</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-white p-6 text-slate-500">No guardian data available for this student.</p>
            )}
        </div>

        {/* Tab 2: Transcripts */}
        <div id="transcripts" className="scroll-mt-24 mt-5 flex flex-col gap-5">
            <section className="card overflow-hidden">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-semibold"><FileText size={16} className="text-brand" /> Academic Transcript & Terminal Gradebook</h2>
                  <p className="text-xs text-slate-500">Validated Senior Secondary terminal scores recorded under National Unified Curriculum</p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="input py-1.5 text-xs"><option>2025/2026 Academic Session — Term 3 (Final)</option></select>
                  <button className="btn btn-primary btn-sm" onClick={() => toast("Downloading transcript...")}>
                    <Download size={13} /> Download Full Transcript
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {["SUBJECT", "CA 1 (20)", "CA 2 (20)", "EXAM (60)", "TOTAL (100)", "GRADE", "TEACHER REMARKS", "FACULTY MEMBER"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {e.transcript ? e.transcript.map((r) => (
                      <tr key={r.subject} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-3 font-medium">{r.subject}</td>
                        <td className="px-3 py-3 text-center">{r.ca1}</td>
                        <td className="px-3 py-3 text-center">{r.ca2}</td>
                        <td className="px-3 py-3 text-center">{r.exam}</td>
                        <td className="px-3 py-3 text-center font-bold">{r.total}%</td>
                        <td className="px-3 py-3">
                          <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${GRADE_BG[r.grade] ?? "bg-slate-100"}`}>
                            {r.grade} ({r.gLabel})
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600">{r.remarks}</td>
                        <td className="px-3 py-3 text-xs text-slate-600">{r.teacher}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={8} className="py-6 text-center text-slate-500">No transcript data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {e.gpaHistory && (
              <section className="card">
                <h2 className="mb-1 flex items-center gap-2 font-semibold"><GraduationCap size={16} className="text-brand" /> Multi-Year GPA Trajectory</h2>
                <p className="mb-0.5 text-sm font-semibold">Cumulative GPA Progression (JSS 1 to SSS 2)</p>
                <p className="mb-1 text-xs text-slate-500">Continuous upward delta of +0.43 grade points across 7 consecutive academic assessment cycles.</p>
                <p className="mb-4 text-xs font-semibold text-brand">↗ Current SSS 2 Standing: {e.gpa} GPA</p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={e.gpaHistory} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                      <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis domain={[3.3, 4.0]} fontSize={11} tickLine={false} axisLine={false} width={35} tickFormatter={(v) => v.toFixed(2)} />
                      <Tooltip formatter={(v) => [`${v} GPA`, "GPA"]} />
                      <Line type="monotone" dataKey="gpa" stroke="#b44cf5" strokeWidth={2.5} dot={{ r: 4, fill: "#b44cf5" }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
        </div>

        {/* Tab 3: Attendance */}
        <div id="attendance" className="scroll-mt-24 mt-5 flex flex-col gap-5">
            <section className="card">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="flex items-center gap-2 font-semibold"><CalendarCheck2 size={16} className="text-brand" /> Attendance Telemetry & Punctuality Record</h2>
                  <p className="text-xs text-slate-500">Biometric turnstile check-ins monitored via Main Campus North Gate</p>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-green-500" /> On-Time (58)</span>
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-pink-400" /> Late (2)</span>
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-slate-400" /> Absent (0)</span>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[["Total Session Days", "60 Days"], ["Days Present", "58 Days (96.7%)"], ["Days Late (Logged)", "2 Days"], ["Unexcused Absences", "0 Days"]].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs text-slate-500">{l}</p>
                    <p className="mt-1 text-lg font-bold">{v}</p>
                  </div>
                ))}
              </div>
              {(e.attendanceWeeks ?? []).map((w) => (
                <div key={w.week} className="mb-5">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{w.week}</p>
                  <div className="grid grid-cols-5 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => {
                      const time = w.days[i];
                      const isLate = time > "08:00";
                      return (
                        <div key={d} className={`rounded-lg p-2.5 text-center ${isLate ? "bg-pink-100" : "bg-green-100"}`}>
                          <p className="text-[10px] text-slate-500">{d}</p>
                          <p className={`font-mono text-xs font-semibold ${isLate ? "text-pink-800" : "text-green-800"}`}>{time}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>

            {e.invoices && (
              <section className="card overflow-hidden">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="flex items-center gap-2 font-semibold"><ReceiptText size={16} className="text-brand" /> Bursary Fee Ledger & Settlement History</h2>
                    <p className="text-xs text-slate-500">Real-time payment logs synchronized with MightyEd Financial Core</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">✓ Bursary Cleared: ₦0.00 Outstanding</span>
                </div>
                <div className="mb-5 grid grid-cols-3 gap-4">
                  {[
                    ["Total Invoiced (Term 3)", "₦450,000.00", "2 Invoices Rendered"],
                    ["Total Payments Received", "₦450,000.00", "100% Fully Settled"],
                    ["Unsettled Balance", "₦0.00", "Examination Docket Issued"],
                  ].map(([l, v, s]) => (
                    <div key={l}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{l}</p>
                      <p className="mt-1 text-xl font-bold">{v}</p>
                      <p className="text-xs text-slate-500">{s}</p>
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        {["Billing Date", "Invoice Ref", "Fee Description", "Amount (₦)", "Payment Gateway", "Receipt Reference", "Status"].map((h) => (
                          <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {e.invoices.map((inv) => (
                        <tr key={inv.ref} className="border-t border-slate-100">
                          <td className="px-3 py-2.5 text-xs">{inv.date}</td>
                          <td className="px-3 py-2.5 font-mono text-xs font-semibold text-brand">{inv.ref}</td>
                          <td className="px-3 py-2.5 text-xs text-slate-600">{inv.desc}</td>
                          <td className="px-3 py-2.5 font-semibold">₦{inv.amount.toLocaleString()}.00</td>
                          <td className="px-3 py-2.5 text-xs">{inv.gateway}</td>
                          <td className="px-3 py-2.5">
                            <button className="font-mono text-xs font-semibold text-brand hover:underline" onClick={() => toast(`Opening ${inv.receipt}...`)}>{inv.receipt}</button>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Paid</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
        </div>
      </div>
    </div>
  );
}