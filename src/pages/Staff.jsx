import { useState, useMemo } from "react";
import { Download, UserPlus, Search, ChevronDown, Pencil, MoreVertical, Users, Zap, Calendar, Shield, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";
import { downloadCSV } from "../utils.js";
import { staffList, ROLE_BADGE } from "../data/staff.js";
import StaffDrawer from "../components/StaffDrawer.jsx";
import Avatar from "../components/Avatar.jsx";

function StatCard({ label, value, sub, badge, badgeColor, icon: Icon }) {
  return (
    <div className="card">
      <div className="mb-3 flex justify-between text-slate-600">
        <span className="text-sm">{label}</span>
        <Icon size={20} className="text-brand" />
      </div>
      <div className="mb-2 text-3xl font-medium leading-none">{value}</div>
      <div className="flex flex-wrap items-center gap-2">
        <small className="text-xs text-slate-500">{sub}</small>
        {badge && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}>{badge}</span>}
      </div>
    </div>
  );
}

function RoleBadge({ tone, children }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${ROLE_BADGE[tone] ?? "bg-gray-100 text-gray-700"}`}>
      {children}
    </span>
  );
}

function PortalBadge({ portal, verified }) {
  if (portal === "Active 2FA") return (
    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
      <span className="size-2 rounded-full bg-green-500" /> Active 2FA
    </span>
  );
  if (portal === "Bursar Level Access") return <span className="text-xs font-semibold text-blue-600">{portal}</span>;
  if (portal === "Super Admin Access") return <span className="text-xs font-bold text-gray-900">{portal}</span>;
  return <span className="text-xs text-slate-500">{portal}</span>;
}

function StatusChip({ status }) {
  const isLeave = status.startsWith("Leave");
  return (
    <span className={`flex items-center gap-1.5 text-sm ${isLeave ? "text-orange-600" : "text-ink"}`}>
      <i className={`size-2 rounded-full ${isLeave ? "bg-orange-400" : "bg-green-500"}`} />
      {status}
    </span>
  );
}

function FFilter({ value, onChange, options }) {
  return (
    <label className="relative flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <select className="appearance-none bg-transparent pr-5 text-sm text-slate-700 outline-none"
        value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-slate-400" />
    </label>
  );
}

export default function Staff() {
  // Page flow: filter the staff roster, open a staff assignment drawer, and manage teaching or access actions.
  const nav = useNavigate();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Academic/Teaching");
  const [dept, setDept] = useState("All Departments");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("Status: Active");
  const [drawer, setDrawer] = useState(null);
  const [menu, setMenu] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const rows = useMemo(() => staffList.filter((s) =>
    (s.name + s.id + s.email).toLowerCase().includes(q.toLowerCase()) &&
    (category === "All" || s.category === category) &&
    (dept === "All Departments" || s.dept.includes(dept.replace(" Department", ""))) &&
    (roleFilter === "All Roles" || s.role.includes(roleFilter)) &&
    (statusFilter === "All" || (statusFilter === "Status: Active" ? s.status === "Active" : s.status.includes("Leave")))
  ), [q, category, dept, roleFilter, statusFilter]);

  const openDrawer = (s) => {
    setDrawer(s);
    setSelected(new Set([s.id]));
  };

  const closeDrawer = () => {
    setDrawer(null);
    setSelected(new Set());
  };

  const toggleRow = (s) => {
    if (selected.has(s.id)) { closeDrawer(); }
    else { openDrawer(s); }
  };

  return (
    <>
      {menu && <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />}
      <div className="-m-4 sm:-m-6">
        <div className="bg-white px-6 py-4">
          <Breadcrumb trail={[{ label: "Staff Management" }, { label: "Staff Directory & Roles" }]} />
        </div>

        <div className="min-h-screen bg-indigo-50/70 p-6">
          {/* page header */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">Staff Directory & Roles</h1>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                Manage academic and non-academic staff profiles, class/subject assignments, employment status, and access roles.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button className="btn btn-ghost" onClick={() => toast("Opening bulk subject assignment...")}>
                <BookOpen size={15} /> Assign Bulk Subjects
              </button>
              <button className="btn btn-ghost" onClick={() => {
                downloadCSV("staff-roster.csv", staffList.map((s) => ({ ID: s.id, Name: s.name, Role: s.role, Department: s.dept, Email: s.email, Status: s.status })));
                toast("Staff roster exported");
              }}>
                <Download size={15} /> Export Staff Roster
              </button>
              <button className="btn btn-primary" onClick={() => nav("/add-staff")}>
                <UserPlus size={15} /> Add New Staff
              </button>
            </div>
          </div>

          {/* stat cards */}
          <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Headcount" value="86 Total Staff" sub="64 Academic / 22 Admin" badge="+4 new session" badgeColor="bg-green-100 text-green-700" icon={Users} />
            <StatCard label="Instructional Coverage" value="58 Assigned" sub="36 Senior / 22 Junior Sec" badge="100% Covered" badgeColor="bg-green-100 text-green-700" icon={Zap} />
            <StatCard label="Leave & Sabbatical" value="3 On Leave" sub="2 Medical / 1 Maternity" badge="Relief Assigned" badgeColor="bg-blue-100 text-blue-700" icon={Calendar} />
            <StatCard label="LMS Access & 2FA" value="84 Active" sub="2 Pending Activation" badge="98% 2FA Active" badgeColor="bg-purple-100 text-purple-700" icon={Shield} />
          </div>

          {/* search + filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="flex flex-1 min-w-56 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-500">
              <Search size={16} />
              <input className="flex-1 bg-transparent text-sm text-ink outline-none" placeholder="Search by"
                value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <FFilter value={category} onChange={setCategory} options={["Academic/Teaching", "Admin", "All"]} />
            <FFilter value={dept} onChange={setDept} options={["All Departments", "Humanities", "Sciences", "Bursary", "ICT Services", "Primary Section"]} />
            <FFilter value={roleFilter} onChange={setRoleFilter} options={["All Roles", "Form Teacher", "HOD", "Subject Teacher", "Admin"]} />
            <FFilter value={statusFilter} onChange={setStatusFilter} options={["Status: Active", "All", "On Leave"]} />
          </div>

          {/* staff table */}
          <div>
            <div className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-indigo-50/80">
                      <th className="py-3.5 pl-4">
                        <input type="checkbox" className="size-4 accent-brand"
                          checked={selected.size === rows.length && rows.length > 0}
                          onChange={() => setSelected(selected.size === rows.length ? new Set() : new Set(rows.map((staff) => staff.id)))} />
                      </th>
                      {["STAFF MEMBER", "ROLE & COHORT", "SUBJECTS/ARMS", "CONTACT & PORTAL", "STATUS", "ACTIONS"].map((h) => (
                        <th key={h} className="py-3.5 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((s) => (
                      <tr key={s.id} onClick={() => toggleRow(s)}
                        className={`cursor-pointer border-t border-slate-100 ${selected.has(s.id) ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                        <td className="py-3.5 pl-4" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="size-4 accent-brand"
                            checked={selected.has(s.id)}
                            onChange={() => toggleRow(s)} />
                        </td>
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar student={s} size={36} selected={selected.has(s.id)} />
                            <div>
                              <p className={`font-semibold ${selected.has(s.id) ? "text-brand" : ""}`}>{s.name}</p>
                              <code className="text-[11px] text-slate-500">{s.id}</code>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-3">
                          <RoleBadge tone={s.roleTone}>{s.role}</RoleBadge>
                          <p className="mt-1 text-xs text-slate-500">{s.dept}</p>
                        </td>
                        <td className="py-3.5 pr-3">
                          <p className="text-sm">{s.subjects}</p>
                          <p className="text-xs text-slate-500">{s.arm}</p>
                        </td>
                        <td className="py-3.5 pr-3">
                          <p className="text-sm text-slate-700">{s.email}</p>
                          <PortalBadge portal={s.portal} verified={s.portalVerified} />
                        </td>
                        <td className="py-3.5 pr-3">
                          <StatusChip status={s.status} />
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center justify-end gap-1 pr-3 text-slate-500"
                            onClick={(e) => e.stopPropagation()}>
                            <button className="icon-btn" onClick={() => toast(`Editing ${s.name}`)}>
                              <Pencil size={14} />
                            </button>
                            <div className="relative">
                              <button className="icon-btn" onClick={() => setMenu(menu === s.id ? null : s.id)}>
                                <MoreVertical size={14} />
                              </button>
                              {menu === s.id && (
                                <div className="pop min-w-44 text-ink">
                                  <button className="pop-item" onClick={() => { setMenu(null); openDrawer(s); }}>View allocation</button>
                                  <button className="pop-item" onClick={() => { setMenu(null); toast("Opening full dossier..."); }}>Full staff dossier</button>
                                  <button className="pop-item text-red-600" onClick={() => { setMenu(null); if (window.confirm(`Mark ${s.name} inactive?`)) toast("Marked inactive"); }}>Mark inactive</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4">
                <span className="text-sm text-slate-500">Showing 1–{rows.length} of 1,248 students</span>
                <div className="flex items-center gap-2">
                  <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm">
                    <option>10 per page</option><option>25 per page</option>
                  </select>
                  <div className="flex gap-1.5">
                    {["Previous", "1", "2", "3", "...", "125", "Next"].map((p) => (
                      <button key={p} className={`rounded-md px-3 py-1.5 text-sm ${p === "1" ? "bg-brand text-white" : "bg-slate-100 hover:bg-slate-200"}`}
                        onClick={() => toast(`Page ${p}`)}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* drawer overlay */}
      {drawer && (
        <>
          <div className="fixed inset-x-0 bottom-0 top-36 z-30" onClick={closeDrawer} />
          <StaffDrawer staff={drawer} onClose={closeDrawer} />
        </>
      )}
    </>
  );
}