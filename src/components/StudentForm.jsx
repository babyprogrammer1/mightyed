import { useState } from "react";
import Modal from "./Modal.jsx";
import { CLASSES } from "../data/students.js";

const blank = { name: "", cls: "SSS 2A", gender: "Male", age: 15, parent: "", phone: "", fee: "Paid", status: "Active" };

export default function StudentForm({ student, onSave, onClose }) {
  const [f, setF] = useState(student || blank);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const input = (k, label, extra = {}) => <label className="grid gap-1 text-xs font-medium text-slate-600">{label}<input className="input" value={f[k]} onChange={set(k)} required {...extra} /></label>;
  const select = (k, label, opts) => <label className="grid gap-1 text-xs font-medium text-slate-600">{label}<select className="input" value={f[k]} onChange={set(k)}>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>;
  return (
    <Modal title={student ? "Edit student" : "Enroll new student"} onClose={onClose}>
      <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave({ ...f, age: Number(f.age) }); }}>
        {input("name", "Full name")}
        {select("cls", "Class / Arm", CLASSES)}
        {select("gender", "Gender", ["Male", "Female"])}
        {input("age", "Age", { type: "number", min: 4, max: 25 })}
        {input("parent", "Parent / Guardian")}
        {input("phone", "Guardian phone", { type: "tel" })}
        {select("fee", "Fee status", ["Paid", "Partial (₦50k)", "Defaulter", "Scholarship"])}
        {select("status", "Status", ["Active", "Suspended"])}
        <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">{student ? "Save changes" : "Enroll student"}</button>
        </div>
      </form>
    </Modal>
  );
}
