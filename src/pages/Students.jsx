import { useEffect, useRef, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { Upload, Download, UserPlus, Search, Users, Percent, FileText, UserCheck, ChevronDown, Pencil, MoreVertical, Award, Check, Minus } from "lucide-react";
import Badge from "../components/Badge.jsx";
import Avatar from "../components/Avatar.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import StatCard, { Trend } from "../components/StatCard.jsx";
import StudentForm from "../components/StudentForm.jsx";
import { useApp } from "../context/AppContext.jsx";
import { idToSlug, levelOf, nextIds } from "../data/students.js";
import { downloadCSV, parseCSV } from "../utils.js";
import { PeopleIcon, RoleBasedIcon } from "../components/icons.jsx";

const feeTone = (f) => (f === "Paid" ? "green" : f.startsWith("Partial") ? "blue" : f === "Defaulter" ? "red" : "purple");
const CHK = "size-[18px] cursor-pointer appearance-none rounded-[5px] border border-slate-500 bg-white checked:border-brand checked:bg-brand";
function Checkbox({ checked, indeterminate = false, onChange, label }) {
  const partial = indeterminate && !checked;
  return (
    <label className="relative inline-grid size-[18px] cursor-pointer place-items-center" onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" aria-label={label} checked={checked} onChange={onChange}
        className={`${CHK} ${partial ? "border-brand bg-brand" : ""}`} />
      {(checked || partial) && (
        <span className="pointer-events-none absolute text-white">
          {partial ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
        </span>
      )}
    </label>
  );
}
function initials(n) {
  return n.split(" ").map((w) => w[0]).join("");
}
const toCsv = (rows) => rows.map((s) => ({ ID: s.id, Name: s.name, Class: s.cls, Gender: s.gender, Age: s.age, Guardian: s.parent, Phone: s.phone, Fee: s.fee, Status: s.status }));

const nameFilter = (r, _c, v) =>
  (r.original.name + r.original.id + r.original.parent).toLowerCase().includes(v.toLowerCase());

function Filter({ label, value, onChange, options, plain }) {
  return (
    <label className={`relative flex items-center gap-1.5 rounded-lg py-2.5 pl-3.5 pr-8 ${plain ? "border border-neutral-100 bg-neutral-50" : "border border-gray-300 bg-white"}`}>
      <span className="text-slate-600">{label}:</span>
      <select className={`appearance-none bg-transparent pr-1 font-medium outline-none ${plain ? "text-ink" : "text-brand"}`} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5" />
    </label>
  );
}

const feeStyle = (f) => (f === "Paid" ? "bg-blue-100 text-green-700" : f.startsWith("Partial") ? "bg-blue-100 text-blue-700" : f === "Defaulter" ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-900");
const FeeChip = ({ fee }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${feeStyle(fee)}`}>
    {fee === "Scholarship" ? <Award size={12} /> : <i className="size-1.5 rounded-full bg-current" />}{fee}
  </span>
);
const StatusChip = ({ v }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${v === "Active" ? "bg-indigo-50 text-ink" : "bg-red-100 font-semibold text-red-600"}`}>
    <i className={`size-1.5 rounded-full ${v === "Active" ? "bg-green-600" : "bg-red-600"}`} />{v}
  </span>
);

export default function Students() {
  const { students, addStudents, updateStudent, deleteStudent, toast } = useApp();
  const [params] = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState(params.get("q") || "");
  const urlQuery = params.get("q") || "";
  useEffect(() => setGlobalFilter(urlQuery), [urlQuery]);
  const [fee, setFee] = useState("All Statuses");
  const [gender, setGender] = useState("All");
  const [klass, setKlass] = useState("All");
  const [arm, setArm] = useState("All");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({ "MIS/2024/0142": true, "MIS/2024/0188": true, "MIS/2024/0091": true });
  const [form, setForm] = useState(null); // null | "new" | student
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const closeOnOutsidePointer = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenu(null);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  const data = useMemo(() => students.filter((s) =>
    (gender === "All" || s.gender === gender) &&
    (klass === "All" || s.cls.startsWith(klass)) &&
    (arm === "All" || s.cls.endsWith(arm))), [students, gender, klass, arm]);

  const columns = [
    { id: "select", enableSorting: false,
      header: ({ table }) => <Checkbox label="Select all" checked={table.getIsAllPageRowsSelected()} indeterminate={table.getIsSomePageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />,
      cell: ({ row }) => <Checkbox label={`Select ${row.original.name}`} checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} /> },
    { accessorKey: "name", header: "STUDENT NAME & ID",
      cell: ({ row }) => { const s = row.original; return (
        <div className="flex items-center gap-2.5">
          <Avatar student={s} selected={row.getIsSelected()} />
          <div>
            <Link to={`/students/${idToSlug(s.id)}`} className={`block font-medium hover:underline ${row.getIsSelected() ? "text-brand" : ""}`}>{s.name}</Link>
            <code className="font-mono text-[11px] font-semibold text-slate-500">{s.id}</code>
          </div>
        </div>); } },
    { accessorKey: "cls", header: "CLASS / ARMS", cell: ({ row: { original: s } }) => <><strong className="block">{s.cls}</strong><small className="text-xs text-slate-500">{s.lvl}</small></> },
    { accessorKey: "age", header: "GENDER / AGE", cell: ({ row: { original: s } }) => `${s.gender}, ${s.age} yrs` },
    { accessorKey: "parent", header: "PARENT / GUARDIAN", cell: ({ row: { original: s } }) => <><strong className="block">{s.parent}</strong><small className="text-xs text-slate-500">{s.phone}</small></> },
    { id: "fee", accessorKey: "fee", header: "FEE STATUS", filterFn: (r, id, v) => r.original.fee.startsWith(v),
      cell: ({ getValue }) => <FeeChip fee={getValue()} /> },
    { accessorKey: "status", header: "STATUS",
      cell: ({ getValue }) => <StatusChip v={getValue()} /> },
    { id: "actions", header: "ACTIONS", enableSorting: false,
      cell: ({ row: { original: s } }) => (
        <div className="flex items-center justify-end gap-1 text-slate-500">
          <button className="icon-btn" aria-label={`Edit ${s.name}`} onClick={() => setForm(s)}><Pencil size={14} /></button>
          <div ref={menu === s.id ? menuRef : null} className="relative">
            <button className="icon-btn" aria-label="More actions" onClick={() => setMenu(menu === s.id ? null : s.id)}><MoreVertical size={14} /></button>
            {menu === s.id && (
              <div className="pop min-w-40 text-ink">
                <Link className="pop-item" to={`/students/${idToSlug(s.id)}`}>View profile</Link>
                <button className="pop-item" onClick={() => { navigator.clipboard?.writeText(s.id); setMenu(null); toast(`Copied ${s.id}`); }}>Copy ID</button>
                <button className="pop-item text-red-600" onClick={() => { setMenu(null); if (window.confirm(`Delete ${s.name}?`)) { deleteStudent(s.id); toast("Student deleted"); } }}>Delete</button>
              </div>
            )}
          </div>
        </div>) },
  ];

  const columnFilters = useMemo(
  () => (fee !== "All Statuses" ? [{ id: "fee", value: fee }] : []),
  [fee]
);

  const table = useReactTable({
    data, columns,
    state: { globalFilter, sorting, rowSelection, columnFilters },
    getRowId: (r) => r.id,
    initialState: { pagination: { pageSize: 5 } },
    onGlobalFilterChange: setGlobalFilter, onSortingChange: setSorting, onRowSelectionChange: setRowSelection,
    globalFilterFn: nameFilter,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => { table.setPageIndex(0); }, [globalFilter, fee, gender, klass, arm]);
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const picked = table.getSelectedRowModel().rows.map((r) => r.original);
  const reset = () => { setGlobalFilter(""); setFee("All Statuses"); setGender("All"); setKlass("All"); setArm("All"); };

  const save = (f) => {
    if (form === "new") { addStudents([{ ...f, id: nextIds(students, 1)[0], lvl: levelOf(f.cls) }]); toast("Student enrolled"); }
    else { updateStudent(form.id, { ...f, lvl: levelOf(f.cls) }); toast("Student updated"); }
    setForm(null);
  };
  const onImport = async (e) => {
    const file = e.target.files[0]; e.target.value = "";
    if (!file) return;
    const rows = parseCSV(await file.text()).filter((r) => r.name);
    if (!rows.length) return toast("No valid rows. Expected columns: name, class, gender, age, parent, phone");
    const ids = nextIds(students, rows.length);
    addStudents(rows.map((r, i) => { const cls = r.class || "JSS 1A"; return { id: ids[i], name: r.name, cls, lvl: levelOf(cls), gender: r.gender || "Male", age: Number(r.age) || 12, parent: r.parent || "—", phone: r.phone || "—", fee: r.fee || "Paid", status: "Active" }; }));
    toast(`Imported ${rows.length} students`);
  };

  return (
    <div className="-m-4 sm:-m-6">
      {form && <StudentForm student={form === "new" ? null : form} onSave={save} onClose={() => setForm(null)} />}
      <div className="bg-white px-4 py-4 sm:px-6"><Breadcrumb trail={[{ label: "Student Records Management" }, { label: "Student Directory & Roster" }]} /></div>
      <div className="min-h-screen bg-indigo-50/80 p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[17px] font-semibold">Student Directory & Roster</h1>
          <p className="mt-1.5 max-w-lg text-slate-500">Manage master student enrollment records, class arm distribution, guardian billing channels, and batch cohort actions across Term 3.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <input ref={fileRef} type="file" accept=".csv" hidden onChange={onImport} />
          <button className="btn btn-ghost" onClick={() => fileRef.current.click()}><Upload size={14} /> Import Roaster</button>
          <button className="btn btn-ghost" onClick={() => { downloadCSV("students.csv", toCsv(table.getFilteredRowModel().rows.map((r) => r.original))); toast("Roster exported"); }}><Download size={14} /> Export CSV/Excel</button>
          <button className="btn btn-primary" onClick={() => setForm("new")}><UserPlus size={14} /> Enroll New Student</button>
        </div>
      </div>

      <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" icon={PeopleIcon} value="1,781" footer={<small className="text-xs text-slate-500">612 Boys / 636 Girls</small>} />
        <StatCard label="In-Session Ratio" icon={Percent} value="1,275" footer={<small className="text-xs font-medium text-green-600">97.4% Attendance</small>} />
        <StatCard label="Fee Clearance (Term 3)" icon={RoleBasedIcon} value={<>88.2% <span className="text-xs font-normal text-slate-500">₦142.8M Cleared</span></>} footer={<small className="text-xs text-red-600">142 Defaulters</small>} />
        <StatCard label="New Intake (Term 3)" icon={UserCheck} value={<>+34 <span className="text-xs font-normal text-slate-500">Enrolled this month</span></>} footer={<Trend />} />
      </div>

      <section className="flex flex-col gap-3">
        <div className="rounded-2xl bg-white p-4">
        <label className="flex items-center gap-3 rounded-xl border-[1.5px] border-slate-500 bg-white px-4 py-3.5 text-slate-500">
          <Search size={16} />
          <input className="flex-1 bg-transparent text-ink outline-none" placeholder="Search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} aria-label="Search students" />
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Filter plain label="Session" value="2026/2027" onChange={() => {}} options={["2026/2027"]} />
          <Filter label="Class" value={klass} onChange={setKlass} options={["All", "JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"]} />
          <Filter label="Arms" value={arm} onChange={setArm} options={["All", "A", "B", "C"]} />
          <Filter label="Fee Status" value={fee} onChange={setFee} options={["All Statuses", "Paid", "Partial", "Defaulter", "Scholarship"]} />
          <Filter label="Gender" value={gender} onChange={setGender} options={["All", "Male", "Female"]} />
          <Badge tone="purple">Term 3 • Week 7 active</Badge>
          <button className="link ml-auto" onClick={reset}>Reset All Filters</button>
        </div>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-indigo-50/80">
                  {hg.headers.map((h) => (
                    <th key={h.id} onClick={h.column.getToggleSortingHandler()}
                      className={`px-3 py-3.5 ${h.column.id === "actions" ? "text-right" : "text-left"} text-[11px] font-semibold tracking-wide text-slate-600 ${h.column.getCanSort() ? "cursor-pointer select-none" : ""}`}>
                      {flexRender(h.column.columnDef.header, h.getContext())}{{ asc: " ▲", desc: " ▼" }[h.column.getIsSorted()]}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={`cursor-pointer border-t border-slate-100 ${row.getIsSelected() ? "bg-blue-50" : ""}`}
                  onClick={(e) => { if (!e.target.closest("a,button,input,label,select")) row.toggleSelected(); }}>
                  {row.getVisibleCells().map((c) => <td key={c.id} className="px-3 py-3 align-middle">{flexRender(c.column.columnDef.cell, c.getContext())}</td>)}
                </tr>
              ))}
              {total === 0 && <tr><td colSpan="8" className="py-8 text-center text-slate-500">No students match these filters. Try resetting them.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Showing {total ? pageIndex * pageSize + 1 : 0}-{Math.min(total, (pageIndex + 1) * pageSize)} of {total} students</span>
            <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5" value={pageSize} onChange={(e) => table.setPageSize(Number(e.target.value))}>
              {[5, 10, 25].map((n) => <option key={n} value={n}>{n} per page</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="rounded-md bg-slate-100 px-3 py-1.5 disabled:opacity-50" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Previous</button>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button key={i} onClick={() => table.setPageIndex(i)} className={`rounded-md px-3 py-1.5 ${pageIndex === i ? "bg-brand text-white" : "bg-slate-100"}`}>{i + 1}</button>
            ))}
            <button className="rounded-md bg-slate-100 px-3 py-1.5 disabled:opacity-50" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next</button>
          </div>
        </div>
        </div>
      </section>
      </div>
    </div>
  );
}
