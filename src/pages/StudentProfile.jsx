import { useParams, Link } from "react-router-dom";
import Avatar from "../components/Avatar.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import Badge from "../components/Badge.jsx";
import { useApp } from "../context/AppContext.jsx";
import { idToSlug } from "../data/students.js";

const Field = ({ label, children }) => (
  <div><small className="text-xs text-slate-500">{label}</small><strong className="mt-1 block">{children}</strong></div>
);

export default function StudentProfile() {
  const slug = useParams().id;
  const s = useApp().students.find((x) => idToSlug(x.id) === slug);
  if (!s) return (
    <div className="card flex flex-col items-center gap-3 py-16"><h2 className="text-xl font-semibold">Student not found</h2>
      <Link className="btn btn-primary" to="/students">Back to directory</Link></div>
  );
  const tone = s.fee === "Paid" ? "green" : s.fee === "Defaulter" ? "red" : s.fee.startsWith("Partial") ? "blue" : "purple";
  return (
    <>
      <div className="mb-5"><Breadcrumb trail={[{ label: "Student Records Management" }, { label: "Student Directory", to: "/students" }, { label: s.name }]} /></div>
      <section className="card flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar student={s} size={64} />
          <div><h1 className="text-lg font-semibold">{s.name}</h1><code className="text-xs text-slate-500">{s.id}</code></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Class / Arm">{s.cls} · {s.lvl}</Field>
          <Field label="Gender / Age">{s.gender}, {s.age} yrs</Field>
          <Field label="Parent / Guardian">{s.parent}</Field>
          <Field label="Phone">{s.phone}</Field>
          <Field label="Fee Status"><Badge tone={tone}>{s.fee}</Badge></Field>
          <Field label="Status">{s.status}</Field>
        </div>
      </section>
    </>
  );
}
