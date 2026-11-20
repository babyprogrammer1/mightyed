import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Search, Calendar, ChevronDown, Bell } from "lucide-react";
import profile from "../assets/profile.png";
import logo from "../assets/logo.png";
import { useToast } from "../context/AppContext.jsx";

const SESSIONS = [
  "2026/2027 Academic Session - Term 3",
  "2026/2027 Academic Session - Term 2",
  "2026/2027 Academic Session - Term 1",
  "2025/2026 Academic Session - Term 3",
];

function SimpleTopbar() {
  const nav = useNavigate();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [session, setSession] = useState(SESSIONS[0]);
  const [open, setOpen] = useState(null);
  // Only one popover is visible at a time; clicking the same trigger closes it.
  const toggle = (k) => setOpen(open === k ? null : k);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-100 bg-white px-4 py-3.5 sm:px-6 print:hidden">
      {/* The backdrop closes an open popover without affecting the page below it. */}
      {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(null)} />}
      <div className="flex items-center gap-2 mr-2">
        <img src={logo} alt="Xentra" className="size-8" />
        <span className="text-lg font-bold text-ink">MightyEd</span>
      </div>
      {/* Search is intentionally local to this compact header and routes to the student directory. */}
      <form className="flex max-w-xs flex-1 items-center gap-2 rounded-xl border border-gray-300 px-3.5 py-2.5 text-slate-500"
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) { nav(`/students?q=${encodeURIComponent(q.trim())}`); setQ(""); } }}>
        <Search size={16} />
        <input className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>
      {/* Standalone workflows still share the active academic-session selector. */}
      <div className="relative mx-auto hidden md:block">
        <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
          onClick={() => toggle("session")}>
          <Calendar size={15} /> {session} <ChevronDown size={15} />
        </button>
        {open === "session" && (
          <div className="pop left-0 right-auto">
            {SESSIONS.map((s) => (
              <button key={s} className={`pop-item ${s === session ? "bg-brand-light font-semibold text-brand" : ""}`}
                onClick={() => { setSession(s); setOpen(null); toast(`Switched to ${s}`); }}>{s}</button>
            ))}
          </div>
        )}
      </div>
      {/* Account and notification controls stay aligned to the right on every screen size. */}
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <button className="relative grid size-11 place-items-center rounded-full bg-indigo-50" onClick={() => toggle("bell")}>
            <Bell size={20} />
            <i className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-slate-700 text-[10px] not-italic text-white">3</i>
          </button>
          {open === "bell" && (
            <div className="pop">
              <p className="px-3 py-2 text-sm">Mock WAEC/NECO registration closes in 8 days</p>
              <button className="pop-item font-semibold text-brand" onClick={() => setOpen(null)}>Mark all as read</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <img src={profile} alt="Jenny Wilson" className="size-10 rounded-full object-cover" />
          <div className="hidden leading-tight sm:block">
            <strong className="block text-sm">Jenny Wilson</strong>
            <span className="text-xs text-slate-500">Chief Bursar & Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function LayoutNoSidebar() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SimpleTopbar />
      {/* Enroll, staff creation, and timetable creation use a focused layout without navigation. */}
      <main className="min-w-0 overflow-x-hidden"><Outlet /></main>
    </div>
  );
}