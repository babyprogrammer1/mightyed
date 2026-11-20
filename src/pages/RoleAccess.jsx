import { useState } from "react";
import {
  Download, ChevronDown, ChevronRight, Shield, Clock, Wifi, Key, Landmark,
  BriefcaseBusiness, GraduationCap, Monitor, FolderOpen, RotateCcw,
  Search, Pencil, UsersRound, LockKeyhole,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useToast } from "../context/AppContext.jsx";

const ROLES = [
  { label: "System Administrator", count: 4, icon: Shield },
  { label: "Bursar / Finance Officer", count: "3 Members", icon: Landmark, active: true },
  { label: "Vice Principal / Sub-Admin", count: 2, icon: BriefcaseBusiness },
  { label: "Form / Subject Teacher", count: 58, icon: GraduationCap },
  { label: "Front Desk / Reception", count: null, icon: Monitor },
];

const ROLE_DETAILS = {
  "System Administrator": {
    scope: "System-wide Administration", assigned: 4, icon: Shield, classification: "Critical",
    capabilities: "32 / 34", activePercent: 94,
    description: "Unrestricted oversight of school operations, user access, security policies, academic records, financial controls, and system configuration.",
    staff: [
      { initials: "ED", name: "Engr. Emeka Danjuma", role: "Lead IT Admin", id: "EMP/2022/112", badge: "Lead", bc: "bg-indigo-100 text-indigo-700" },
    ],
  },
  "Bursar / Finance Officer": {
    scope: "Finance & Billing", assigned: 3, icon: Landmark, classification: "Medium-High",
    capabilities: "18 / 34", activePercent: 52,
    description: "Full administrative oversight of institutional financial ledgers, customizable tuition structures, student billing reconciliation, online payment processing gateways, and delinquent accounts. Restricted strictly from academic grade sheet modifications, disciplinary mark entries, and human resources wage approvals.",
    staff: [
      { initials: "BL", name: "Mr. Babatunde Lawal", role: "Senior Bursar", id: "EMP/2020/008", badge: "Lead", bc: "bg-indigo-100 text-indigo-700" },
      { initials: "FA", name: "Mrs. Folashade Adeyemi", role: "Accounts Officer", id: "EMP/2022/031", badge: "Active", bc: "bg-green-100 text-green-700" },
      { initials: "CE", name: "Mr. Chuka Eze", role: "Billing Specialist", id: "EMP/2023/119", badge: "Active", bc: "bg-green-100 text-green-700" },
    ],
  },
  "Vice Principal / Sub-Admin": {
    scope: "Academic & Operations", assigned: 2, icon: BriefcaseBusiness, classification: "High",
    capabilities: "25 / 34", activePercent: 74,
    description: "Coordinates academic operations, staff supervision, student records, communication workflows, and delegated administrative approvals.",
    staff: [
      { initials: "NO", name: "Mrs. Ngozi Okoye", role: "Vice Principal", id: "EMP/2018/004", badge: "Lead", bc: "bg-indigo-100 text-indigo-700" },
      { initials: "KA", name: "Mr. Kelechi Azu", role: "Sub-Administrator", id: "EMP/2021/027", badge: "Active", bc: "bg-green-100 text-green-700" },
    ],
  },
  "Form / Subject Teacher": {
    scope: "Teaching & Student Records", assigned: 58, icon: GraduationCap, classification: "Standard",
    capabilities: "14 / 34", activePercent: 41,
    description: "Provides access to assigned classes, subject gradebooks, attendance records, student communications, and teaching resources.",
    staff: [
      { initials: "CO", name: "Mrs. Chioma Okafor", role: "Form Teacher", id: "EMP/2021/042", badge: "Lead", bc: "bg-indigo-100 text-indigo-700" },
    ],
  },
  "Front Desk / Reception": {
    scope: "Front Office & Visitor Services", assigned: 0, icon: Monitor, classification: "Restricted",
    capabilities: "8 / 34", activePercent: 24,
    description: "Supports visitor management, basic student lookup, attendance enquiries, appointment scheduling, and approved front-office communications.",
    staff: [],
  },
};

const COMPLIANCE = [
  { icon: Shield, label: "Dual-Factor Auth (2FA)", sub: "Enforced for all role logins", on: true },
  { icon: Clock, label: "Inactivity Timeout", sub: "15 Minutes auto-lockout active", on: true },
  { icon: Wifi, label: "IP Subnet Whitelisting", sub: "Disabled (Any Authorized Network)", on: false },
  { icon: Key, label: "Password Expiration", sub: "Enforced every 90 days", on: true },
];

const AUDIT = [
  { dot: "bg-brand", text: <><b className="text-brand">Super Admin Samuel</b> updated permissions for this role</>, time: "12 Aug 2026, 14:22 PM" },
  { dot: "bg-slate-500", text: "2FA policy enforced for this role by Principal Admin", time: "28 Jul 2026, 09:15 AM" },
  { dot: "bg-slate-500", text: "Role assignment updated by Principal Admin", time: "10 Jul 2026, 11:04 AM" },
];

const initMods = [
  {
    id: "fee", icon: FolderOpen, name: "Fee Management & Bursary Operations",
    badge: "4 Functions Active", summary: "4/4 Full Privileges", sc: "text-green-600",
    expanded: true,
    subs: [
      { name: "Fee Structure Setup", desc: "Configure term tuition rates, levy breakdowns, and discount brackets", p: { full: true, view: true, create: true, edit: true, delete: true, export: true } },
      { name: "Invoicing & Payment Tracking", desc: "Generate invoices, record split payments, and adjust ledger items", modified: true, p: { full: false, view: true, create: true, edit: true, delete: false, export: true } },
      { name: "Defaulters List & Payment Reminders", desc: "Trigger batch SMS/Email reminders and gate exam card clearances", p: { full: false, view: true, create: true, edit: true, delete: false, export: true } },
      { name: "Payment Gateway Reconciliation Logs", desc: "Direct API logs from Paystack, Flutterwave, and Monnify feeds", p: { full: false, view: true, create: false, edit: false, delete: false, export: true } },
    ],
  },
  {
    id: "students", icon: FolderOpen, name: "Student Records & Enrollment Profiles",
    badge: "6 Sub-permissions", summary: "Partial (Read & Export)", sc: "text-blue-600",
    expanded: false, subs: [],
  },
  {
    id: "exams", icon: FolderOpen, name: "Examination & Gradebook Oversight",
    badge: "8 Sub-permissions", summary: "Restricted / Blocked", sc: "text-red-600",
    expanded: false, subs: [],
  },
  {
    id: "comms", icon: FolderOpen, name: "System Communication & Global Configuration",
    badge: "2 Functions", summary: "1 Active Privilege", sc: "text-slate-600",
    expanded: true,
    subs: [
      { name: "Broadcast Billing Announcements to Parents", desc: "Send financial notices via SMS, WhatsApp, and parent mobile portal", p: { full: false, view: true, create: true, edit: false, delete: false, export: false } },
      { name: "Audit Logs & Staff RBAC Matrix", desc: "System activity trail and permission granting authority", superAdmin: true, p: { full: false, view: false, create: false, edit: false, delete: false, export: false } },
    ],
  },
];

const PERM_KEYS = ["full", "view", "create", "edit", "delete", "export"];
const PERM_LABELS = ["FULL ACCESS", "VIEW", "CREATE", "EDIT", "DELETE", "EXPORT"];

export default function RoleAccess() {
  // Page flow: choose a role, edit module permissions, review security context, and commit the permission matrix.
  const toast = useToast();
  const [activeRole, setActiveRole] = useState("Bursar / Finance Officer");
  const [modules, setModules] = useState(initMods);
  const [changes, setChanges] = useState(3);
  const [q, setQ] = useState("");
  const [action, setAction] = useState("");
  const role = ROLE_DETAILS[activeRole];

  const toggleExpand = (id) =>
    setModules(modules.map((m) => m.id === id ? { ...m, expanded: !m.expanded } : m));

  const togglePerm = (modId, subName, key) => {
    setModules(modules.map((m) =>
      m.id === modId
        ? { ...m, subs: m.subs.map((s) => s.name === subName ? { ...s, modified: true, p: { ...s.p, [key]: !s.p[key] } } : s) }
        : m
    ));
    setChanges((c) => c + 1);
  };

  const setPermissionForAll = (keys, value, message) => {
    setModules((current) => current.map((module) => ({
      ...module,
      subs: module.subs.map((sub) => sub.superAdmin ? sub : {
        ...sub,
        modified: true,
        p: { ...sub.p, ...Object.fromEntries(keys.map((key) => [key, value])) },
      }),
    })));
    setChanges((c) => c + 1);
    toast(message);
  };

  const resetMatrix = () => {
    setModules(initMods);
    setChanges(0);
    setAction("Permission matrix reset to defaults");
  };

  const searchTerm = q.trim().toLowerCase();
  const visibleModules = modules
    .map((module) => {
      const moduleMatches = module.name.toLowerCase().includes(searchTerm);
      return moduleMatches ? module : {
        ...module,
        subs: module.subs.filter((sub) =>
          `${sub.name} ${sub.desc}`.toLowerCase().includes(searchTerm)
        ),
      };
    })
    .filter((module) => module.name.toLowerCase().includes(searchTerm) || module.subs.length > 0);

  return (
    <div className="-m-4 min-w-0 sm:-m-6">
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label: "Staff Management" }, { label: "Role-Based Access Control" }]} />
      </div>

      <div className="min-h-screen bg-indigo-50/70 p-4 pb-24 sm:p-6 sm:pb-24">
        {/* header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Role-Based Access Control</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Configure system roles, set granular module-level permissions, and manage security access for school administrators, bursars, and teaching staff.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button className="btn btn-ghost" onClick={resetMatrix}><RotateCcw size={14}/> Reset to Default Matrix</button>
            <button className="btn btn-ghost" onClick={() => { setAction("Security audit log ready to export"); toast("Exporting audit log..."); }}><Download size={15} /> Export Security Audit Log</button>
            <button className="btn btn-primary" onClick={() => { setAction("Custom role creator opened"); toast("Opening custom role creator..."); }}>+ Create Custom Role</button>
          </div>
        </div>

        {/* role tabs */}
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ROLES.map((r) => (
            <button key={r.label} onClick={() => { setActiveRole(r.label); toast(`Viewing ${r.label}`); }}
              className={`flex flex-none items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors
                ${activeRole === r.label ? "bg-brand text-white shadow" : "text-slate-600 hover:bg-slate-50"}`}>
              <r.icon size={15}/>
              {r.label}
              {r.count && (
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold
                  ${activeRole === r.label ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {r.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* main grid */}
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* left */}
          <div className="flex flex-col gap-4">
            {/* role info */}
            <section className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 flex-none place-items-center rounded-xl bg-blue-100 text-brand"><role.icon size={22}/></span>
                  <div>
                    <h2 className="text-lg font-bold">{activeRole}</h2>
                    <p className="text-xs">
                      <span className="font-semibold text-brand">Scope: {role.scope}</span>
                      <span className="mx-2 text-slate-300">|</span>
                      <span className="text-slate-500">Assigned: {role.assigned} Staff</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">Last modified: 14 Aug 2026, 11:32 AM by Super Admin (Lawal A.)</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => { setAction(`Editing scope for ${activeRole}`); toast("Opening role scope editor..."); }}><Pencil size={12}/> Edit Role Scope</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setAction(`${role.staff.length} staff assigned to ${activeRole}`); toast("Showing staff in this role..."); }}>View Staff ({role.staff.length}) →</button>
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
                {role.description}
              </p>
            </section>

            {/* permissions matrix */}
            <section className="card overflow-hidden p-0">
              {/* toolbar */}
              <div className="flex flex-wrap items-center gap-3 p-4">
                <label className="flex flex-1 min-w-48 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-500">
                  <Search size={15} className="text-slate-400"/>
                  <input className="flex-1 bg-transparent text-sm text-ink outline-none" placeholder="Search by"
                    value={q} onChange={(e) => setQ(e.target.value)} />
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {changes > 0 && (
                    <span className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      <span className="size-2 rounded-full bg-orange-500" /> {changes} Unsaved Modifications
                    </span>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={resetMatrix}>Discard</button>
                  <button className="btn btn-primary btn-sm" onClick={() => { setChanges(0); setAction("Permission changes saved"); toast("Changes saved!"); }}>Save Changes</button>
                </div>
              </div>
              <div className="flex gap-4 border-b border-slate-200 px-4 pb-3 text-xs">
                <button className="font-medium text-brand hover:underline" onClick={() => setPermissionForAll(["view"], true, "All read permissions selected")}>Select All Read</button>
                <button className="font-medium text-slate-600 hover:underline" onClick={() => setPermissionForAll(["full", "create", "edit", "delete"], false, "All write permissions cleared")}>Clear All Write</button>
                <button className="font-medium text-slate-600 hover:underline"
                  onClick={() => setModules(modules.map((m) => ({ ...m, expanded: false })))}>
                  Collapse All
                </button>
              </div>

              {/* table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="py-3 pl-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 w-1/2">
                        Module & Functional Capability
                      </th>
                      {PERM_LABELS.map((l) => (
                        <th key={l} className="px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">{l}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleModules.map((mod) => (
                      <>
                        {/* module row */}
                        <tr key={mod.id} className="cursor-pointer border-t border-slate-200 bg-indigo-50/80 hover:bg-indigo-100/60"
                          onClick={() => toggleExpand(mod.id)}>
                          <td className="py-3 pl-4 font-semibold text-sm" colSpan={1}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-slate-400 text-xs">
                                {mod.expanded ? <ChevronDown size={15} className="text-brand" /> : <ChevronRight size={15} />}
                              </span>
                              <mod.icon size={14}/>
                              {mod.name}
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">{mod.badge}</span>
                            </div>
                          </td>
                          <td colSpan={6}>
                            <div className="flex justify-end pr-4">
                              <span className={`text-xs font-semibold ${mod.sc}`}>{mod.summary}</span>
                            </div>
                          </td>
                        </tr>

                        {/* sub rows */}
                        {mod.expanded && mod.subs.map((sub) => (
                          <tr key={sub.name} className={`border-t border-slate-100 text-sm ${sub.superAdmin ? "bg-slate-50/80 opacity-70" : ""}`}>
                            <td className="py-3 pl-10 pr-4">
                              <div className="flex items-start gap-2">
                                {sub.superAdmin && <LockKeyhole size={12} className="mt-0.5 text-slate-400"/>}
                                <div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <p className="font-medium">{sub.name}</p>
                                    {sub.modified && <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">Modified</span>}
                                    {sub.superAdmin && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">Requires Super Admin</span>}
                                  </div>
                                  <p className="mt-0.5 text-xs text-slate-500">{sub.desc}</p>
                                </div>
                              </div>
                            </td>
                            {PERM_KEYS.map((k) => (
                              <td key={k} className="px-2 py-3 text-center">
                                {sub.superAdmin
                                  ? <span className="text-slate-300 text-lg">—</span>
                                  : <input type="checkbox" className="size-4 accent-brand cursor-pointer"
                                    checked={sub.p[k]} onChange={() => togglePerm(mod.id, sub.name, k)} />
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* right panel */}
          <aside className="flex flex-col gap-4">
            {/* security classification */}
            <section className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Security Classification</p>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">⚡ {role.classification}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative size-20 flex-none">
                  <svg viewBox="0 0 80 80" className="size-20 -rotate-90">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#b44cf5" strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 30 * (role.activePercent / 100)} ${2 * Math.PI * 30}`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
                    <span className="text-base font-bold">{role.activePercent}%</span>
                    <span className="text-[9px] text-slate-500 uppercase">Active</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none">{role.capabilities}</p>
                  <p className="mt-1 text-xs text-slate-500">Capabilities Enabled</p>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    Meets the baseline guidelines for this role's access requirements.
                  </p>
                </div>
              </div>
            </section>

            {/* compliance rules */}
            <section className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role Compliance Rules</p>
                <Shield size={14} className="text-slate-400" />
              </div>
              <div className="flex flex-col gap-2">
                {COMPLIANCE.map((c) => (
                  <div key={c.label} className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-2.5">
                    <span className={`mt-1 size-2 flex-none rounded-full ${c.on ? "bg-brand" : "bg-slate-400"}`} />
                    <div>
                      <p className="text-sm font-medium">{c.label}</p>
                      <p className="text-xs text-slate-500">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* assigned staff */}
            <section className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Assigned Staff <span className="text-ink font-bold ml-1">{role.staff.length}</span>
                </p>
                <button className="link text-xs" onClick={() => { setAction(`Assigning staff to ${activeRole}`); toast("Opening staff assignment..."); }}>+ Assign Staff</button>
              </div>
              <div className="flex flex-col gap-2">
                {role.staff.map((s) => (
                  <div key={s.id} className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-2.5">
                    <span className="grid size-9 flex-none place-items-center rounded-full bg-indigo-100 text-xs font-bold text-brand">{s.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.role} • {s.id}</p>
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${s.bc}`}>{s.badge}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* audit trail */}
            <section className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role Audit Trail</p>
                <span className="text-slate-400 text-sm">🕐</span>
              </div>
              <ul className="relative flex flex-col gap-4 pl-5 before:absolute before:bottom-2 before:left-2 before:top-1 before:w-0.5 before:bg-slate-200">
                {AUDIT.map((a, i) => (
                  <li key={i} className="relative">
                    <span className={`absolute -left-5 top-1 size-2.5 rounded-full ring-2 ring-white ${a.dot}`} />
                    <p className="text-xs leading-relaxed">{a.text}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{a.time}</p>
                  </li>
                ))}
              </ul>
              <button className="mt-3 w-full text-center text-xs font-semibold text-brand hover:underline"
                onClick={() => { setAction("Full role audit trail opened"); toast("Opening full audit trail..."); }}>
                View Full Audit Trail →
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* sticky footer */}
      <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-4 shadow-lg sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-white"><role.icon size={16}/></span>
          <div className="min-w-0">
          <p className="text-sm font-semibold">Editing {activeRole} Role</p>
            <p className="text-xs text-slate-500">{changes} modifications pending commit to active database</p>
          </div>
        </div>
        <div className="flex w-full gap-2.5 sm:w-auto">
          <button className="btn btn-ghost flex-1 justify-center sm:flex-none" onClick={resetMatrix}>Discard Changes</button>
          <button className="btn btn-primary flex-1 justify-center sm:flex-none" onClick={() => { setChanges(0); setAction("Permission changes saved"); toast("Permission changes saved!"); }}>✓ Save Permission Changes</button>
        </div>
      </div>
      {action && <p className="fixed bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">{action}</p>}
    </div>
  );
}