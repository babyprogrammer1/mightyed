import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Upload, UserPlus, UsersRound } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { useApp } from "../context/AppContext.jsx";
import { CLASSES, levelOf, nextIds } from "../data/students.js";

const STEPS = [
  { n: 1, label: "Personal details" },
  { n: 2, label: "Admission & class" },
  { n: 3, label: "Parent / guardian" },
  { n: 4, label: "Home address" },
  { n: 5, label: "Supporting documents" },
];

function Section({ n, title, sub, children }) {
  return (
    <section id={`step-${n}`} className="scroll-mt-24 rounded-2xl bg-white p-6">
      <div className="mb-5 flex items-start gap-4">
        <span className="grid size-8 flex-none place-items-center rounded-full bg-brand text-sm font-bold text-white">{n}</span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function FInput({ label, required, type = "text", placeholder, value, onChange }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">
        {label}{required && <span className="ml-0.5 text-brand"> *</span>}
      </span>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="input h-11" required={required} />
    </label>
  );
}

function FSelect({ label, required, placeholder, options = [], value, onChange }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">
        {label}{required && <span className="ml-0.5 text-brand"> *</span>}
        {!required && <span className="ml-1 text-xs text-slate-400">(optional)</span>}
      </span>
      <select className="input h-11 text-slate-700" value={value ?? ""} onChange={onChange}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function UploadBox({ sub }) {
  const [fileName, setFileName] = useState(null);
  const ref = useRef();
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center">
      <input ref={ref} type="file" hidden onChange={(e) => setFileName(e.target.files[0]?.name)} />
      <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
        <Upload size={18} className="text-brand" />
      </div>
      <p className="text-sm">
        <button type="button" className="font-semibold text-brand" onClick={() => ref.current.click()}>
          Click to upload
        </button>{" "}or drag and drop
      </p>
      <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
      <p className="mt-1 text-xs text-slate-400">{fileName ?? "No file selected"}</p>
    </div>
  );
}

export default function Enroll() {
  // Page flow: capture a new student's required records, validate the confirmation step, and add the student to the roster.
  const nav = useNavigate();
  const { students, addStudents, toast } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [f, setF] = useState({
    firstName: "", middleName: "", lastName: "", gender: "", cls: "",
    parent: "", phone: "", email: "", relationship: "", emergency: false,
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const handleEnroll = (ev) => {
    ev.preventDefault();
    if (!confirmed) { toast("Please confirm the information is accurate"); return; }
    const name = [f.firstName, f.middleName, f.lastName].filter(Boolean).join(" ");
    if (!name.trim() || !f.cls) { toast("Please fill all required fields"); return; }
    addStudents([{
      id: nextIds(students, 1)[0], name, cls: f.cls,
      lvl: levelOf(f.cls), gender: f.gender || "Male", age: 11,
      parent: f.parent || "—", phone: f.phone || "—", fee: "Paid", status: "Active",
    }]);
    toast("Student enrolled successfully!");
    nav("/students");
  };

  return (
    <div>
      <div className="bg-white px-6 py-4">
        <Breadcrumb trail={[{ label: "Students", to: "/students" }, { label: "Enrollment", to: "/enrollment" }, { label: "New student" }]} />
      </div>
      <div className="bg-indigo-50/70 p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Enroll new student</h1>
            <p className="mt-1 text-sm text-slate-500">Create a student record and assign their class. Complete the details below to get started.</p>
          </div>
          <span className="text-xs text-brand">* Required fields</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* sidebar */}
          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Enrollment Details</p>
            <div className="rounded-2xl bg-white p-2">
              {STEPS.map((s) => (
                <a key={s.n} href={`#step-${s.n}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-indigo-50">
                  <span className="grid size-6 flex-none place-items-center rounded-full bg-brand text-xs font-bold text-white">{s.n}</span>
                  <span className="text-sm font-medium">{s.label}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="flex items-center gap-1.5 font-semibold text-sm"><span className="text-brand">ℹ</span> Before you begin</p>
              <p className="mt-1.5 text-xs text-slate-500">Have the student's personal details, guardian contact information and birth certificate ready.</p>
              <p className="mt-2 text-xs text-slate-500">Not ready to enroll? Save a draft and return to it later.</p>
            </div>
          </aside>

          {/* form */}
          <form onSubmit={handleEnroll} className="flex flex-col gap-5">
            <Section n={1} title="Student personal details" sub="Enter the student's details as they appear on official documents.">
              <div className="grid gap-4 sm:grid-cols-3">
                <FInput label="First name" required placeholder="Enter first name" value={f.firstName} onChange={set("firstName")} />
                <FInput label="Middle name" placeholder="Enter middle name" value={f.middleName} onChange={set("middleName")} />
                <FInput label="Last name" required placeholder="Enter last name" value={f.lastName} onChange={set("lastName")} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium">Date of birth <span className="text-brand">*</span></span>
                  <div className="relative">
                    <input type="date" className="input h-11 w-full" required />
                    <Calendar size={15} className="pointer-events-none absolute right-3 top-3.5 text-slate-400" />
                  </div>
                </label>
                <FSelect label="Gender" required placeholder="Select gender" options={["Male", "Female"]} value={f.gender} onChange={set("gender")} />
                <FSelect label="Nationality" required placeholder="Select nationality" options={["Nigerian", "Ghanaian", "British", "American", "Other"]} />
              </div>
            </Section>

            <Section n={2} title="Admission & class placement" sub="Choose the academic session and the student's starting class.">
              <div className="grid gap-4 sm:grid-cols-3">
                <FSelect label="Academic session" required placeholder="Select session" options={["2026/2027", "2025/2026"]} />
                <FSelect label="Entry term" required placeholder="Select term" options={["Term 1", "Term 2", "Term 3"]} />
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium">Admission date <span className="text-brand">*</span></span>
                  <div className="relative">
                    <input type="date" className="input h-11 w-full" required />
                    <Calendar size={15} className="pointer-events-none absolute right-3 top-3.5 text-slate-400" />
                  </div>
                </label>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <FSelect label="Class / grade" required placeholder="Select class" options={CLASSES} value={f.cls} onChange={set("cls")} />
                <FSelect label="Class arm" placeholder="Select arm" options={["Gold", "Diamond", "Silver"]} />
                <FInput label="Previous school" placeholder="Enter previous school" />
              </div>
              <p className="mt-3 text-xs text-slate-400">An admission number will be generated automatically when the student is enrolled.</p>
            </Section>

            <Section n={3} title="Parent / guardian contact" sub="Add the primary contact for school communications and billing.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FInput label="Full name" required placeholder="Enter parent or guardian's full name" value={f.parent} onChange={set("parent")} />
                <FSelect label="Relationship to student" required placeholder="Select relationship"
                  options={["Father", "Mother", "Guardian", "Sibling", "Other"]}
                  value={f.relationship} onChange={set("relationship")} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <FInput label="Phone number" required type="tel" placeholder="e.g. +234 800 000 0000" value={f.phone} onChange={set("phone")} />
                <FInput label="Email address" required type="email" placeholder="name@example.com" value={f.email} onChange={set("email")} />
                <FInput label="Alternate phone" type="tel" placeholder="Enter alternate phone number" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" className="size-4 accent-brand" checked={f.emergency} onChange={set("emergency")} />
                  Also use as the emergency contact
                </label>
                <button type="button" className="link flex items-center gap-1 text-sm" onClick={() => toast("Additional guardian fields can be added after the primary contact is saved")}><UsersRound size={14} /> Add another guardian</button>
              </div>
            </Section>

            <Section n={4} title="Home address" sub="Provide the student's current residential address.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FInput label="Street address" required placeholder="House number and street name" />
                <FInput label="Apartment / unit" placeholder="Apartment, suite or unit" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <FInput label="City / town" required placeholder="Enter city or town" />
                <FSelect label="State / province" required placeholder="Select state or province"
                  options={["Lagos", "Abuja", "Kano", "Rivers", "Ogun", "Kwara", "Other"]} />
                <FInput label="Postal code" placeholder="Enter postal code" />
              </div>
              <div className="mt-4">
                <FSelect label="Country" required placeholder="Select country"
                  options={["Nigeria", "Ghana", "United Kingdom", "United States", "Other"]} />
              </div>
            </Section>

            <Section n={5} title="Supporting documents" sub="Upload clear, readable copies. PDF, JPG or PNG. Maximum 5 MB per file.">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="mb-2 text-sm font-medium">Birth certificate <span className="text-brand">*</span></p>
                  <UploadBox sub="Proof of birth and student identity" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Previous school report <span className="text-xs font-normal text-slate-400">(optional)</span></p>
                  <UploadBox sub="Most recent academic report" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Student photograph <span className="text-xs font-normal text-slate-400">(optional)</span></p>
                  <UploadBox sub="Recent passport-style photograph" />
                </div>
              </div>
              <button type="button" className="mt-4 flex items-center gap-2 text-sm text-slate-600 hover:text-brand" onClick={() => toast("Additional document upload ready")}>
                <Upload size={15} /> Add another document <span className="text-xs text-slate-400">(optional)</span>
              </button>
            </Section>

            {/* confirm */}
            <div className="rounded-2xl bg-white p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" className="mt-0.5 size-4 flex-none accent-brand" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                <div>
                  <span className="text-sm font-medium">I confirm the information provided is accurate and complete. <span className="text-brand">*</span></span>
                  <p className="mt-0.5 text-xs text-slate-500">Enrolling creates an active student record in the selected academic session and class.</p>
                </div>
              </label>
            </div>

            {/* sticky footer */}
            <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-sm">
              <Link to="/students" className="btn btn-ghost">Cancel</Link>
              <div className="flex gap-2.5">
                <button type="button" className="btn btn-ghost" onClick={() => toast("Draft saved")}>Save as draft</button>
                <button type="submit" className="btn btn-primary"><UserPlus size={15} /> Enroll New Student</button>
              </div>
            </div>
            <p className="pb-4 text-center text-xs text-slate-400">Student information is accessible only to authorized school staff.</p>
          </form>
        </div>
      </div>
    </div>
  );
}