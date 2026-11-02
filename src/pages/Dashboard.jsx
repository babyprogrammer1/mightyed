import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Download, Wallet, GraduationCap, ListChecks, ClipboardList, UserPlus, FileText,
  Megaphone, TrendingUp, AlertTriangle, Zap, MessageSquare, Radio, CalendarDays,
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import Badge from "../components/Badge.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { TermFeeIcon, StaffRosterIcon } from "../components/icons.jsx";
import { useToast } from "../context/AppContext.jsx";
import { downloadCSV } from "../utils.js";

const toRows = (a) => a.map(([name, outstanding, exempt, collected]) => ({ name, outstanding, exempt, collected }));
const sets = [
  toRows([["Pri 1-3", 38, 24, 38], ["Pri 4-6", 28, 24, 48], ["JSS 1", 30, 26, 44], ["JSS 2", 36, 18, 46], ["JSS 3", 28, 20, 52], ["SS 1-2", 38, 16, 30], ["SS 3", 40, 22, 36]]),
  toRows([["Term 1", 15, 10, 75], ["Term 2", 22, 12, 66], ["Term 3", 30, 14, 56]]),
  toRows([["Sep", 60, 10, 30], ["Oct", 45, 12, 43], ["Nov", 35, 12, 53], ["Dec", 28, 14, 58], ["Jan", 22, 14, 64]]),
];
const tabNames = ["By Class Level", "By Term Trend", "Monthly Recovery"];

const quickOps = [
  { label: "New Student", sub: "Admit & Assign Arm", icon: UserPlus, to: "/students" },
  { label: "Issue Invoice", sub: "Tuition & Levies", icon: FileText, to: "/invoices" },
  { label: "Broadcast SMS", sub: "Parent Notification", icon: Megaphone, to: "/broadcast" },
  { label: "Class Transfer", sub: "Promotion Matrix", icon: TrendingUp, to: "/enrollment" },
];
const absentees = [
  { i: "CE", name: "Chinedu Eze", info: "JSS 2B • Engr. Eze (+234 803 *** 4412)", tag: "SMS Queued", tone: "blue" },
  { i: "AB", name: "Aisha Bello", info: "SSS 1A • Hajia Bello (Medical Note)", tag: "Documented", tone: "gray" },
  { i: "OD", name: "Oluwaseun Davies", info: "Pri 5C • Dr. Davies (+234 802 ***8821)", tag: "Call Required", tone: "red" },
  { i: "FA", name: "Fatima Al-Hassan", info: "JSS 3C • School Bus Route 4 (Traffic)", tag: "In Transit", tone: "gray" },
];
const activity = [
  { t: <>Parent of Adebayo Samuel paid <b className="font-semibold text-brand">₦150,000</b> for Term 3 Tuition.</>, m: "5 mins ago", tag: "Monnify Gateway", p: true, dot: "bg-brand" },
  { t: "Mrs. Okafor (HOD) submitted JSS3 Mathematics CA scores.", m: "28 mins ago", tag: "Academics", bold: true, dot: "bg-brand" },
  { t: "Grade 4B morning attendance finalized by Mr. Emeka Okafor.", m: "1 hr ago", tag: "Operations", dot: "bg-slate-600" },
  { t: "New Bursar role permissions updated by Principal Admin (Dr. Folashade).", m: "3 hrs ago", tag: "Security", dot: "bg-slate-500" },
  { t: "₦25,000 sibling discount applied to Kalu family (Pri 2 & Pri 4).", m: "4 hrs ago", tag: "Approved", p: true, bold: true, dot: "bg-brand" },
];

function FeeChart() {
  const [tab, setTab] = useState(0);
  return (
    <section className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-semibold">Fee Collection & Revenue Analytics</h2>
          <p className="mt-2 text-slate-500">Term 3 recovery progress across academic sections and grade tiers</p>
        </div>
        <div className="flex rounded-xl bg-indigo-50 p-1">
          {tabNames.map((n, i) => (
            <button key={n} onClick={() => setTab(i)} className={`rounded-lg px-2.5 py-2 text-xs ${tab === i ? "bg-white font-semibold text-brand" : "text-slate-600"}`}>{n}</button>
          ))}
        </div>
        <Link to="/invoices" className="link">View Defaulters →</Link>
      </div>
      <div className="mb-2 mt-5 h-64 rounded-2xl p-2 pt-4 ring-1 ring-slate-200">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sets[tab]} barSize={42} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis hide />
            <Tooltip cursor={{ fill: "#f6ecfe" }} formatter={(v, n) => [`${v}%`, n]} />
            <Bar dataKey="collected" name="Collected" stackId="a" fill="#b44cf5" />
            <Bar dataKey="exempt" name="Exemptions" stackId="a" fill="#f1e0fb" />
            <Bar dataKey="outstanding" name="Outstanding" stackId="a" fill="#4200b0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        {[["#b44cf5", "Collected (₦37.8M)"], ["#4200b0", "Outstanding / Due (₦10.6M)"], ["#f1e0fb", "Exemptions (₦1.2M)"]].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm" style={{ background: c }} />{l}</span>
        ))}
      </div>
      <p className="mt-2 text-xs">Next settlement batch: <b>Tomorrow, 12:00 PM</b></p>
      <div className="mt-3.5 flex gap-2 rounded-md bg-slate-100 px-3 py-2.5 text-xs text-brand">
        <Zap size={14} className="mt-0.5 flex-none" /> SSS 3 Examination Clearances: WAEC payment clearances have accelerated fee completion by +14% compared to the mid-term projection baseline.
      </div>
    </section>
  );
}

function Attendance() {
  const toast = useToast();
  return (
    <section className="card min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0"><h2 className="text-[17px] font-semibold">Attendance & Student Demographics</h2><p className="mt-2 text-slate-500">Real-time gate check-in telemetry and absentee triage</p></div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs text-indigo-700"><Radio size={12} /> Gate Terminals Active</span>
      </div>
      <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col items-center gap-3.5 rounded-xl bg-indigo-50/70 p-4 sm:p-5">
          <div className="relative size-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ v: 94.2 }, { v: 5.8 }]} dataKey="v" innerRadius={52} outerRadius={70} startAngle={90} endAngle={-270} stroke="none">
                  <Cell fill="#565e78" /><Cell fill="#e3e5ec" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><b className="text-xl">94.2%</b><small className="text-xs text-slate-500">1,187 Checked In</small></div>
          </div>
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <span><i className="mr-1.5 inline-block size-2.5 rounded-sm bg-blue-600" />Present: 1,187</span>
            <span><i className="mr-1.5 inline-block size-2.5 rounded-sm bg-gray-500" />Late: 33 (2.6%)</span>
            <span><i className="mr-1.5 inline-block size-2.5 rounded-sm bg-gray-500" />Excused: 14 (1.1%)</span>
            <span className="text-red-600"><i className="mr-1.5 inline-block size-2.5 rounded-sm bg-red-600" />Unexcused: 14 (1.1%)</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Today's Absentee Watchlist (14)</h3>
            <button className="btn btn-primary btn-sm" onClick={() => toast("SMS queued for 14 parents")}><MessageSquare size={14} /> SMS All Parents</button>
          </div>
          {absentees.map((a) => (
            <div key={a.name} className="my-2.5 flex min-w-0 items-start gap-3 rounded-lg bg-indigo-50/70 px-3 py-2.5">
              <span className="grid size-9 flex-none place-items-center rounded-full bg-pink-100 text-xs font-semibold text-pink-800">{a.i}</span>
              <div className="min-w-0 flex-1"><strong className="block">{a.name}</strong><small className="block truncate text-xs text-slate-500">{a.info}</small></div>
              <Badge tone={a.tone}>{a.tag}</Badge>
            </div>
          ))}
          <Link to="/students" className="link text-xs">View All 14 Absentee Details →</Link>
        </div>
      </div>
    </section>
  );
}

function RightColumn() {
  const toast = useToast();
  const [done, setDone] = useState({});
  const review = (k, msg) => { setDone({ ...done, [k]: true }); toast(msg); };
  const left = 2 - Object.keys(done).length;
  return (
    <aside className="flex min-w-0 flex-col gap-5">
      <section className="card">
        <h2 className="text-[17px] font-semibold">Quick Operations Hub</h2>
        <div className="mt-3.5 grid grid-cols-2 gap-3">
          {quickOps.map(({ label, sub, icon: Icon, to }) => (
            <Link key={label} to={to} className="flex min-h-24 flex-col gap-1 rounded-xl bg-slate-100 p-3.5 hover:bg-indigo-100">
              <Icon size={18} className="mb-2 text-brand" /><strong>{label}</strong><small className="text-xs text-slate-500">{sub}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-[17px] font-semibold"><AlertTriangle size={16} /> Pending Approvals</h2>
          <Badge tone={left ? "purple" : "green"}>{left ? `${left} Action Required` : "All reviewed"}</Badge>
        </div>
        <div className="mt-3 rounded-lg bg-slate-100 p-3">
          <div className="flex justify-between"><strong>12 Fee Adjustments</strong><small className="text-xs text-slate-500">Bursary</small></div>
          <p className="my-1.5 mb-2.5 text-[13px] text-slate-500">Sibling discount and scholarship fee revisions awaiting bursar sign-off.</p>
          <button className="btn btn-ghost btn-sm" disabled={done.fees} onClick={() => review("fees", "12 fee adjustments approved")}>{done.fees ? "Approved ✓" : "Review Requests"}</button>
        </div>
        <div className="mt-3 rounded-lg bg-slate-100 p-3">
          <div className="flex justify-between"><strong>Term Report Cards</strong><small className="text-xs text-brand">3 Classes</small></div>
          <p className="my-1.5 mb-2.5 text-[13px] text-slate-500">JSS 1B, SSS 2 Science, Primary 3 Gold submitted master grades.</p>
          <button className="btn btn-primary btn-sm" disabled={done.cards} onClick={() => review("cards", "Report cards signed")}>{done.cards ? "Signed ✓" : "Review & Sign"}</button>
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between"><h2 className="text-[17px] font-semibold">Live System Activity</h2><Link className="link" to="/transactions">View All (142) →</Link></div>
        <ul className="relative mt-5 flex flex-col gap-5 before:absolute before:bottom-2 before:left-[4px] before:top-2 before:w-0.5 before:bg-purple-200">
          {activity.map((a, i) => (
            <li key={i} className="relative pl-6">
              <span className={`absolute left-0 top-1.5 size-2.5 rounded-full ring-2 ring-white ${a.dot}`} />
              <p className={`text-[15px] leading-snug ${a.bold ? "font-semibold" : ""}`}>{a.t}</p>
              <small className="mt-1 flex items-center gap-2 text-xs text-slate-500">{a.m}<span>•</span><span className={a.p ? "font-medium text-brand" : ""}>{a.tag}</span></small>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="flex items-center justify-between"><h4 className="text-[11px] font-semibold tracking-wide text-slate-600">UPCOMING KEY MILESTONES</h4><CalendarDays size={14} className="text-brand" /></div>
        <div className="mt-2.5 flex justify-between rounded-md bg-slate-100 px-3 py-2.5 text-[13px]"><span>Term 3 Mid-Term Break</span><b>Nov 3 - 7, 2025</b></div>
        <div className="mt-2.5 flex justify-between rounded-md bg-slate-100 px-3 py-2.5 text-[13px]"><span>Mock WAEC/NECO Registration</span><b className="text-red-600">Closes in 8 days</b></div>
        <div className="mt-2.5 flex justify-between rounded-md bg-indigo-50/70 px-3 py-2.5 text-[11px]"><span><i className="mr-1 inline-block size-1.5 rounded-full bg-brand" />Paystack & Monnify Active</span><b className="text-brand">99.9% Uptime</b></div>
      </section>
    </aside>
  );
}

export default function Dashboard() {
  const toast = useToast();
  const ledger = () => {
    downloadCSV("daily-ledger.csv", [
      { Item: "Collected", Amount: "₦37.8M" }, { Item: "Outstanding", Amount: "₦10.6M" },
      { Item: "Exemptions", Amount: "₦1.2M" }, { Item: "Term fee collection", Amount: "₦48,506,000" },
    ]);
    toast("Daily ledger downloaded");
  };
  return (
    <>
      <div className="mb-5"><Breadcrumb trail={[{ label: "Dashboard & Analytics" }, { label: "Overview" }]} /></div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="mb-2 text-[17px] font-semibold">Dashboard Overview</h1><Badge tone="purple">● Term 3 • Week 7 active</Badge></div>
        <div className="flex flex-wrap gap-2.5 print:hidden">
          <button className="btn btn-ghost" onClick={() => window.print()}><Download size={14} /> Export Report (PDF)</button>
          <button className="btn btn-primary" onClick={ledger}><Wallet size={14} /> Generate Daily Ledger</button>
        </div>
      </div>
      <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Enrollment" value="1,781" icon={GraduationCap} />
        <StatCard label="Term Fee Collection" value="₦48,506,000" icon={TermFeeIcon} />
        <StatCard label="Daily Attendance" value="94.2%" icon={ListChecks} />
        <StatCard label="Staff Roster & Faculty" value="86 Total Staff" icon={StaffRosterIcon} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-5"><FeeChart /><Attendance /></div>
        <RightColumn />
      </div>
    </>
  );
}
