import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "../context/AppContext.jsx";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

const SUBJECT_COLORS = {
  Mathematics:"bg-purple-100 text-purple-800 border-purple-200",
  English:"bg-blue-100 text-blue-800 border-blue-200",
  "Basic Science":"bg-green-100 text-green-800 border-green-200",
  ICT:"bg-cyan-100 text-cyan-800 border-cyan-200",
  "Social Studies":"bg-orange-100 text-orange-800 border-orange-200",
  "Creative Arts":"bg-pink-100 text-pink-800 border-pink-200",
};

const initGrid = {
  Monday:    {1:{s:"Mathematics",t:"A. Okafor"},2:{s:"English",t:"S. Bello"},3:{s:"Basic Science",t:"T. Adeyemi"},4:{s:"ICT",t:"I. Eze"},5:null},
  Tuesday:   {1:{s:"English",t:"S. Bello"},2:{s:"Mathematics",t:"A. Okafor"},3:{s:"Social Studies",t:"R. Musa"},4:{s:"Basic Science",t:"T. Adeyemi"},5:null},
  Wednesday: {1:{s:"Basic Science",t:"T. Adeyemi"},2:{s:"Mathematics",t:"A. Okafor"},3:{s:"English",t:"S. Bello"},4:{s:"Social Studies",t:"S. Bello"},5:{s:"Creative Arts",t:"K. Thomas"}},
  Thursday:  {1:{s:"Mathematics",t:"A. Okafor"},2:{s:"Basic Science",t:"T. Adeyemi"},3:{s:"ICT",t:"I. Eze"},4:null,5:null},
  Friday:    {1:{s:"English",t:"S. Bello"},2:{s:"Basic Science",t:"T. Adeyemi"},3:{s:"Mathematics",t:"A. Okafor"},4:{s:"Creative Arts",t:"K. Thomas"},5:null},
};

const SUBJECTS_REQ = [
  {name:"Mathematics",required:6},{name:"English",required:5},{name:"Basic Science",required:5},
  {name:"Social Studies",required:3},{name:"ICT",required:3},{name:"Creative Arts",required:3},
];

const TIMES = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00"];

const PERIOD_TIMES = {1:"08:00–09:00",2:"09:00–10:00",3:"10:30–11:30",4:"11:30–12:30",5:"12:30–13:30"};

export default function CreateTimetable() {
  // Page flow: choose a timetable slot, add lessons until the required hours are planned, then commit the schedule.
  const nav = useNavigate();
  const toast = useToast();
  const [grid, setGrid] = useState(initGrid);
  const [selectedSlot, setSelectedSlot] = useState({day:"Thursday",period:4});
  const [form, setForm] = useState({subject:"English",teacher:"S. Bello",startTime:"11:30",endTime:"12:30",room:"Classroom 1A"});
  const [name, setName] = useState("JSS 1A - Term 3 (draft)");
  const [session, setSession] = useState("2026/2027");
  const [term, setTerm] = useState("Term 3");
  const [cls, setCls] = useState("JSS 1");
  const [arm, setArm] = useState("A");
  const [date, setDate] = useState("2027-04-27");
  const [dayStart, setDayStart] = useState("08:00");
  const [dayEnd, setDayEnd] = useState("13:30");
  const [duration, setDuration] = useState("60");

  const counts = useMemo(()=>{
    const c={};
    Object.values(grid).forEach(day=>Object.values(day).forEach(slot=>{if(slot)c[slot.s]=(c[slot.s]||0)+1}));
    return c;
  },[grid]);

  const totalScheduled = Object.values(counts).reduce((a,b)=>a+b,0);
  const totalRequired = SUBJECTS_REQ.reduce((a,s)=>a+s.required,0);
  const remaining = totalRequired - totalScheduled;

  const isSelected = (day,period) => selectedSlot?.day===day && selectedSlot?.period===period;
  const selectSlot = (day,period) => {
    if(!grid[day][period]) setSelectedSlot({day,period});
  };

  const addLesson = () => {
    if(!form.subject||!form.teacher) return toast("Fill in subject and teacher");
    const updated = {...grid};
    if(!updated[selectedSlot.day]) return;
    updated[selectedSlot.day] = {...updated[selectedSlot.day], [selectedSlot.period]:{s:form.subject,t:form.teacher}};
    setGrid(updated);
    // move selection to next open slot
    setSelectedSlot(null);
    toast(`Added ${form.subject} to ${selectedSlot.day} Period ${selectedSlot.period}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* simple breadcrumb (no sidebar) */}
      <div className="border-b border-slate-100 bg-white px-6 py-3">
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <span>Administration</span><span className="text-slate-300">›</span>
          <Link to="/timetable" className="hover:text-brand">Class & Timetable Manager</Link>
          <span className="text-slate-300">›</span>
          <b className="text-ink">Create New Timetable</b>
        </nav>
      </div>

      <div className="p-6 sm:p-8">
        {/* header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Create New Timetable</h1>
            <p className="mt-1 text-sm text-slate-500">Set your school day, assign lessons and balance weekly subject hours.</p>
          </div>
          <span className="rounded-xl bg-brand-light px-3.5 py-2 text-sm font-semibold text-brand">Draft · Example timetable</span>
        </div>

        {/* alert */}
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 flex-none text-indigo-500"/>
          <p className="text-sm text-indigo-700">Illustrative draft only. Lesson assignments, hours and school-day settings below are examples, not live school data or school policy.</p>
        </div>

        {/* timetable details */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Timetable details</h2>
              <p className="text-xs text-slate-500">Choose the class and define the weekly schedule. All fields marked * are required.</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">01 / SETUP</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <label className="lg:col-span-2 grid gap-1.5 text-sm font-medium">
              Timetable name <span className="text-brand">*</span>
              <input className="input h-11" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. JSS 1A - Term 3"/>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Academic session <span className="text-brand">*</span>
              <select className="input h-11" value={session} onChange={e=>setSession(e.target.value)}>
                <option>2026/2027</option><option>2025/2026</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Term <span className="text-brand">*</span>
              <select className="input h-11" value={term} onChange={e=>setTerm(e.target.value)}>
                <option>Term 1</option><option>Term 2</option><option>Term 3</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-sm font-medium">
                Class <span className="text-brand">*</span>
                <select className="input h-11" value={cls} onChange={e=>setCls(e.target.value)}>
                  <option>JSS 1</option><option>JSS 2</option><option>JSS 3</option><option>SSS 1</option><option>SSS 2</option><option>SSS 3</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Arm <span className="text-brand">*</span>
                <select className="input h-11" value={arm} onChange={e=>setArm(e.target.value)}>
                  <option>A</option><option>B</option><option>C</option><option>Gold</option><option>Diamond</option>
                </select>
              </label>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1.5 text-sm font-medium">
              Effective date <span className="text-brand">*</span>
              <div className="relative"><input type="date" className="input h-11 w-full" value={date} onChange={e=>setDate(e.target.value)}/></div>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              School-day start <span className="text-brand">*</span>
              <div className="relative"><input type="time" className="input h-11 w-full" value={dayStart} onChange={e=>setDayStart(e.target.value)}/><Clock size={14} className="pointer-events-none absolute right-3 top-3.5 text-slate-400"/></div>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              School-day end <span className="text-brand">*</span>
              <div className="relative"><input type="time" className="input h-11 w-full" value={dayEnd} onChange={e=>setDayEnd(e.target.value)}/><Clock size={14} className="pointer-events-none absolute right-3 top-3.5 text-slate-400"/></div>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Period duration <span className="text-brand">*</span>
              <select className="input h-11" value={duration} onChange={e=>setDuration(e.target.value)}>
                <option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
            <span>Monday–Friday · 5 periods per day · 25 weekly slots</span>
            <span>Example break: 10:00–10:30 daily · Excluded from lesson hours</span>
          </div>
        </section>

        {/* weekly timetable + add lesson panel */}
        <div className="mb-6 grid gap-5 xl:grid-cols-[1fr_320px]">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold">Weekly timetable</h2>
                <p className="text-xs text-slate-500">{cls} {arm} · Arm A · Monday–Friday</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-brand">{totalScheduled} lessons · {remaining} open</span>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-brand"/>Lesson</span>
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-orange-400"/>Break</span>
                </div>
              </div>
            </div>
            <p className="mb-3 text-xs text-slate-400">Choose an open period; then assign a lesson in the editor.</p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr>
                    <th className="w-24 py-2 pr-3 text-left text-xs font-semibold text-slate-500">TIME</th>
                    {DAYS.map(d=><th key={d} className="py-2 px-2 text-left text-xs font-semibold text-slate-700">{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[1,2,"break",3,4,5].map((p)=>{
                    if(p==="break") return (
                      <tr key="break">
                        <td className="py-2 pr-3 text-xs text-slate-500 align-middle">10:00–10:30</td>
                        <td colSpan={5} className="py-1.5">
                          <div className="rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-xs text-orange-700 font-medium">
                            Morning break · All classes · 30 min
                          </div>
                        </td>
                      </tr>
                    );
                    const pTime = {1:"08:00\n09:00",2:"09:00\n10:00",3:"10:30\n11:30",4:"11:30\n12:30",5:"12:30\n13:30"}[p];
                    return (
                      <tr key={p}>
                        <td className="py-1.5 pr-3 align-top">
                          <p className="text-xs font-medium text-slate-700 whitespace-pre">{pTime}</p>
                          <p className="text-[10px] text-slate-400">Period {p}</p>
                        </td>
                        {DAYS.map(d=>{
                          const slot = grid[d]?.[p];
                          const sel = isSelected(d,p);
                          if(slot) return (
                            <td key={d} className="p-1">
                              <div className={`rounded-lg border p-2 text-xs cursor-pointer ${SUBJECT_COLORS[slot.s]??"bg-slate-100 text-slate-700 border-slate-200"}`}>
                                <p className="font-semibold leading-tight">{slot.s}</p>
                                <p className="text-[11px] opacity-70">{slot.t}</p>
                                <p className="text-[10px] opacity-60">60 min</p>
                              </div>
                            </td>
                          );
                          return (
                            <td key={d} className="p-1">
                              <button onClick={()=>selectSlot(d,p)}
                                className={`w-full rounded-lg border-2 border-dashed p-2 text-xs text-left transition-all hover:border-brand hover:bg-brand-light ${sel?"border-brand bg-brand-light text-brand":"border-slate-200 text-slate-400"}`}>
                                {sel ? <><span className="font-semibold">+ Open period</span><br/><span className="text-[10px]">Selected for new lesson</span></> : <><span>+ Open period</span><br/><span className="text-[10px]">Available · 60 min</span></>}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-400">{totalScheduled} h scheduled / {totalRequired} h teaching capacity. Breaks: 2 h 30 min per week. All lessons are 60 min.</p>
          </section>

          {/* add lesson panel */}
          <aside>
            {selectedSlot ? (
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="font-semibold mb-0.5">Add a lesson</h2>
                <p className="text-xs text-slate-500 mb-4">Assign a subject to the selected open period.</p>

                <div className="rounded-xl bg-brand-light px-3 py-2.5 mb-4">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Selected Open Period</p>
                  <p className="font-bold text-brand">{selectedSlot.day} · {PERIOD_TIMES[selectedSlot.period]}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="grid gap-1.5 text-sm font-medium">
                    Subject <span className="text-brand">*</span>
                    <select className="input h-11" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                      {Object.keys(SUBJECT_COLORS).map(s=><option key={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Teacher <span className="text-brand">*</span>
                    <select className="input h-11" value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})}>
                      {["A. Okafor","S. Bello","T. Adeyemi","I. Eze","R. Musa","K. Thomas"].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Day <span className="text-brand">*</span>
                    <select className="input h-11" value={selectedSlot.day} disabled><option>{selectedSlot.day}</option></select>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1.5 text-sm font-medium">
                      Start time <span className="text-brand">*</span>
                      <div className="relative"><input type="time" className="input h-11 w-full" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})}/><Clock size={14} className="pointer-events-none absolute right-2.5 top-3.5 text-slate-400"/></div>
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium">
                      End time <span className="text-brand">*</span>
                      <div className="relative"><input type="time" className="input h-11 w-full" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})}/><Clock size={14} className="pointer-events-none absolute right-2.5 top-3.5 text-slate-400"/></div>
                    </label>
                  </div>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Room (optional)
                    <input className="input h-11" value={form.room} onChange={e=>setForm({...form,room:e.target.value})} placeholder="e.g. Classroom 1A"/>
                  </label>
                </div>
                <p className="mt-2 text-xs text-slate-500">60 min · Adds 1 h to {form.subject} when added. This pending lesson is not in the totals.</p>
                <button className="btn btn-primary mt-3 w-full justify-center" onClick={addLesson}>+ Add lesson</button>

                <div className="mt-4 rounded-xl border border-slate-200 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"><AlertCircle size={13}/> Check for time clashes</p>
                  <p className="mt-1 text-xs text-slate-500">Before creating, compare teacher availability across classes. A teacher or class cannot have overlapping lessons; breaks must stay clear.</p>
                  <p className="mt-2 text-xs text-orange-600">Class grid: no overlaps in this example. Teacher availability has not been checked.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center">
                <p className="font-medium text-slate-600">Add a lesson</p>
                <p className="mt-1 text-sm text-slate-400">Click an open period in the grid to assign a subject.</p>
              </div>
            )}
          </aside>
        </div>

        {/* subject-hour planning */}
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Subject-hour planning</h2>
              <p className="text-xs text-slate-500">Example weekly targets. Count only lessons already in the grid.</p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${remaining>0?"text-orange-500":"text-green-600"}`}>{remaining} h remaining</p>
              <p className="text-xs text-slate-500">{totalScheduled}/{totalRequired} h scheduled</p>
            </div>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-slate-200">
              {["SUBJECT","Required / week","Scheduled","Remaining","Allocation"].map(h=>(
                <th key={h} className="py-2.5 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {SUBJECTS_REQ.map((s)=>{
                const sched = counts[s.name]||0;
                const rem = s.required - sched;
                const met = rem<=0;
                return (
                  <tr key={s.name} className="border-t border-slate-100">
                    <td className="py-3 pr-4 font-medium">{s.name}</td>
                    <td className="py-3 pr-4 text-slate-500">{s.required} h</td>
                    <td className="py-3 pr-4">{sched} h</td>
                    <td className={`py-3 pr-4 font-semibold ${met?"text-green-600":rem===1?"text-orange-500":"text-red-500"}`}>
                      {met ? "0 h · Met" : `${rem} h`}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                        <div className={`h-full rounded-full ${met?"bg-green-500":"bg-brand"}`} style={{width:`${Math.min(100,(sched/s.required)*100)}%`}}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-slate-200 font-semibold">
                <td className="py-3 pr-4">Weekly total</td>
                <td className="py-3 pr-4">{totalRequired} h</td>
                <td className="py-3 pr-4">{totalScheduled} h</td>
                <td className={`py-3 pr-4 ${remaining>0?"text-orange-500":"text-green-600"}`}>{remaining} h</td>
                <td className="py-3 pr-4 text-xs text-slate-500">{remaining} open periods</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* bottom warning */}
        {remaining > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
            <span className="size-2 flex-none rounded-full bg-orange-500"/>
            <p className="text-sm font-semibold text-orange-700">{remaining} subject hours still to plan</p>
            <p className="text-sm text-orange-600">Fill the remaining periods and check teacher availability before creating. You can save an incomplete draft.</p>
          </div>
        )}
      </div>

      {/* sticky footer */}
      <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shadow-lg">
        <Link to="/timetable" className="btn btn-ghost text-sm">Cancel</Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">Draft only · Not yet created</span>
          <button className="btn btn-ghost text-sm" onClick={()=>toast("Draft saved — "+name)}>Save draft</button>
          <button className="btn btn-primary text-sm" disabled={remaining>0}
            onClick={()=>{if(remaining>0){toast(remaining+" subject hours still unplanned");return;}toast("Timetable created: "+name+"!");nav("/timetable");}}>
            Create timetable
          </button>
        </div>
      </div>
    </div>
  );
}