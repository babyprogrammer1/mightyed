import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, ChevronDown, Bell } from "lucide-react";
import profile from "../assets/profile.png";
import { useToast } from "../context/AppContext.jsx";

const sessions = ["2026/2027 Academic Session - Term 3", "2026/2027 Academic Session - Term 2", "2026/2027 Academic Session - Term 1", "2025/2026 Academic Session - Term 3"];
const initialNotes = ["Mock WAEC/NECO registration closes in 8 days", "12 fee adjustments await bursar sign-off", "SMS batch to parents was delivered"];

export default function Topbar() {
  const nav = useNavigate();
  const toast = useToast();
  const headerRef = useRef(null);
  const [q, setQ] = useState("");
  const [session, setSession] = useState(sessions[0]);
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState(initialNotes);
  const toggle = (k) => setOpen(open === k ? null : k);

  useEffect(() => {
    const closeOnOutsidePointer = (e) => {
      if (!headerRef.current?.contains(e.target)) setOpen(null);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-30 flex items-center gap-4 bg-white px-4 py-3.5 sm:px-6 print:hidden">
      <form className="flex w-full max-w-sm items-center gap-2 rounded-xl border-[1.5px] border-slate-500 px-3.5 py-2.5 text-slate-500"
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) { nav(`/students?q=${encodeURIComponent(q.trim())}`); setQ(""); } }}>
        <Search size={16} />
        <input className="min-w-0 flex-1 bg-transparent text-ink outline-none" placeholder="Search" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>

      <div className="relative mx-auto hidden md:block">
        <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5" onClick={() => toggle("session")}>
          <Calendar size={16} /> {session} <ChevronDown size={16} />
        </button>
        {open === "session" && (
          <div className="pop left-0 right-auto">
            {sessions.map((s) => (
              <button key={s} className={`pop-item ${s === session ? "bg-brand-light font-semibold text-brand" : ""}`}
                onClick={() => { setSession(s); setOpen(null); toast(`Switched to ${s}`); }}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <button className="relative grid size-11 place-items-center rounded-full bg-indigo-50" aria-label="Notifications" onClick={() => toggle("bell")}>
            <Bell size={20} />
            {notes.length > 0 && <i className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-slate-700 text-[10px] not-italic text-white">{notes.length}</i>}
          </button>
          {open === "bell" && (
            <div className="pop">
              {notes.length ? notes.map((n) => <p key={n} className="px-3 py-2">{n}</p>) : <p className="px-3 py-2 text-slate-500">You're all caught up.</p>}
              {notes.length > 0 && <button className="pop-item font-semibold text-brand" onClick={() => { setNotes([]); setOpen(null); }}>Mark all as read</button>}
            </div>
          )}
        </div>
        <div className="relative">
          <button className="flex items-center gap-2.5 text-left" onClick={() => toggle("user")}>
            <img src={profile} alt="Jenny Wilson" className="size-10 rounded-full object-cover" />
            <div className="hidden leading-tight sm:block"><strong className="block">Jenny Wilson</strong><span className="text-xs text-slate-500">Chief Bursar & Administrator</span></div>
          </button>
          {open === "user" && (
            <div className="pop">
              <button className="pop-item" onClick={() => { setOpen(null); nav("/settings"); }}>Account settings</button>
              <button className="pop-item" onClick={() => { setOpen(null); toast("Signed out (demo only, no backend yet)"); }}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
