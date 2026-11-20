import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Upload, UserPlus, BookOpen, Paperclip } from "lucide-react";
import { useToast } from "../context/AppContext.jsx";

const STEPS = [
  { n: 1, label: "Personal & contact" },
  { n: 2, label: "Employment details" },
  { n: 3, label: "Qualifications & experience" },
  { n: 4, label: "Emergency contact" },
  { n: 5, label: "Employment documents" },
];

function Section({ n, title, sub, children }) {
  return (
    <section id={`staff-step-${n}`} className="scroll-mt-24 rounded-2xl bg-white p-6">
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

function FInput({ label, required, optional, type = "text", placeholder }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-brand"> *</span>}
        {optional && <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>}
      </span>
      <input type={type} placeholder={placeholder} className="input h-11" required={required} />
    </label>
  );
}

function FSelect({ label, required, optional, placeholder, options = [] }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-brand"> *</span>}
        {optional && <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>}
      </span>
      <select className="input h-11 text-slate-700">
        <option value="" disabled selected>{placeholder}</option>
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
      <div className="mx-auto mb-2.5 flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
        <Upload size={18} className="text-brand" />
      </div>
      <p className="text-sm">
        <button type="button" className="font-semibold text-brand" onClick={() => ref.current.click()}>
          Click to upload
        </button>{" "}or drag and drop.
      </p>
      <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
      <p className="mt-1 text-xs text-slate-400">{fileName ?? "No file selected"}</p>
    </div>
  );
}

export default function AddStaff() {
  // Page flow: collect staff identity, employment, access, and document details before saving to the staff directory.
  const nav = useNavigate();
  const toast = useToast();
  const [category, setCategory] = useState("Teaching");

  return (
    <div>
      {/* breadcrumb */}
      <div className="border-b border-slate-100 bg-white px-6 py-3">
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <Link to="/staff" className="hover:text-brand">Staff</Link>
          <span className="text-slate-300">›</span>
          <Link to="/staff" className="hover:text-brand">Staff Directory & Roles</Link>
          <span className="text-slate-300">›</span>
          <b className="text-ink">Add New Staff</b>
        </nav>
      </div>

      <div className="p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Add New Staff</h1>
            <p className="mt-1 text-sm text-slate-500">Create an employee record for teaching, other academic or non-academic staff.</p>
          </div>
          <span className="text-xs text-brand">* Required fields</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* step sidebar */}
          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Staff Details</p>
            <div className="rounded-2xl bg-white p-2">
              {STEPS.map((s) => (
                <a key={s.n} href={`#staff-step-${s.n}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-indigo-50">
                  <span className="grid size-6 flex-none place-items-center rounded-full bg-brand text-xs font-bold text-white">{s.n}</span>
                  <span className="text-sm font-medium text-slate-700">{s.label}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold"><span className="text-brand">ℹ</span> Before you begin</p>
              <p className="mt-1.5 text-xs text-slate-500">Have the staff member's contact details, employment terms and supporting documents ready.</p>
              <p className="mt-2 text-xs text-slate-500">Missing some information? Save a draft and complete the record later.</p>
            </div>
          </aside>

          {/* form */}
          <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); toast("Staff member added!"); nav("/staff"); }}>

            <Section n={1} title="Personal information & contacts" sub="Enter the staff member's details as they appear on official documents.">
              <div className="grid gap-4 sm:grid-cols-3">
                <FInput label="First name" required placeholder="Enter first name" />
                <FInput label="Middle name" optional placeholder="Enter middle name" />
                <FInput label="Last name" required placeholder="Enter last name" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium">Date of birth <span className="text-xs text-slate-400 font-normal">(optional)</span></span>
                  <div className="relative">
                    <input type="date" className="input h-11 w-full" />
                    <Calendar size={14} className="pointer-events-none absolute right-3 top-3.5 text-slate-400" />
                  </div>
                </label>
                <FSelect label="Gender" optional placeholder="Select gender" options={["Male", "Female", "Prefer not to say"]} />
                <FSelect label="Nationality" optional placeholder="Select nationality" options={["Nigerian", "Ghanaian", "British", "American", "Other"]} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <FInput label="Email address" required type="email" placeholder="name@example.com" />
                <FInput label="Phone number" required type="tel" placeholder="e.g. +234 800 000 0000" />
                <FInput label="Alternate phone" optional type="tel" placeholder="Enter alternate phone number" />
              </div>
              <div className="mt-4">
                <FInput label="Residential address" required placeholder="House number, street, city and state" />
              </div>
            </Section>

            <Section n={2} title="Employment details" sub="Set the staff category, role and agreed employment terms.">
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium">Staff category <span className="text-brand">*</span></p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { v: "Teaching", sub: "Teachers & classroom educators" },
                    { v: "Other academic", sub: "Library, laboratory & learning support" },
                    { v: "Non-academic", sub: "Administration, operations & support" },
                  ].map(({ v, sub }) => (
                    <label key={v} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border-2 p-3 ${category === v ? "border-brand bg-brand-light" : "border-slate-200"}`}>
                      <input type="radio" name="category" value={v} checked={category === v}
                        onChange={() => setCategory(v)} className="mt-0.5 accent-brand" />
                      <div>
                        <p className="text-sm font-medium">{v}</p>
                        <p className="text-xs text-slate-500">{sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FInput label="Job title / role" required placeholder="Enter job title or role" />
                <FSelect label="Department" required placeholder="Select department"
                  options={["Humanities", "Sciences", "Bursary Unit", "ICT Services", "Primary Section", "Administration"]} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FSelect label="Employment type" required placeholder="Select employment type"
                  options={["Full-time", "Part-time", "Contract", "Visiting"]} />
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium">Start date <span className="text-brand">*</span></span>
                  <div className="relative">
                    <input type="date" className="input h-11 w-full" required />
                    <Calendar size={14} className="pointer-events-none absolute right-3 top-3.5 text-slate-400" />
                  </div>
                </label>
              </div>
              {category === "Teaching" && (
                <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/80 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-brand"><BookOpen size={14} /> Teaching assignments</p>
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand">Teaching only</span>
                  </div>
                  <p className="mb-3 text-xs text-slate-500">Shown only when Teaching is selected. Assign subjects and classes now or later.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FSelect label="Subjects" optional placeholder="Select one or more subjects"
                      options={["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Civic Education", "ICT", "Agricultural Science"]} />
                    <FSelect label="Class assignments" optional placeholder="Select classes / class arms"
                      options={["SSS 1 Gold", "SSS 2 Gold", "SSS 2 Diamond", "JSS 1 A", "JSS 1 B", "Primary 5A"]} />
                  </div>
                </div>
              )}
              <p className="mt-3 text-xs text-slate-400">A staff ID will be generated automatically when the employee record is created.</p>
            </Section>

            <Section n={3} title="Qualifications & relevant experience" sub="Record qualifications and experience relevant to the staff member's role.">
              <div className="grid gap-4 sm:grid-cols-3">
                <FSelect label="Highest qualification" optional placeholder="Select qualification"
                  options={["SSCE / WAEC", "OND", "HND", "B.Sc / B.A", "M.Sc / M.A", "PhD", "PGDE", "NCE"]} />
                <FInput label="Institution" optional placeholder="Enter institution name" />
                <FInput label="Year completed" optional placeholder="YYYY" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FInput label="Professional certification" optional placeholder="Enter certification or licence" />
                <FInput label="Years of relevant experience" optional placeholder="Enter number of years" />
              </div>
              <div className="mt-4">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium">Relevant experience <span className="text-xs text-slate-400 font-normal">(optional)</span></span>
                  <textarea rows={4} placeholder="Summarize previous roles, responsibilities and areas of expertise"
                    className="input resize-none py-2.5" />
                </label>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Paperclip size={13}/> Attach certificates and any role-specific professional licence in Employment documents.</span>
              </p>
            </Section>

            <Section n={4} title="Emergency contact" sub="Provide someone the school can contact in an emergency.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FInput label="Full name" required placeholder="Enter contact's full name" />
                <FSelect label="Relationship to staff member" required placeholder="Select relationship"
                  options={["Spouse", "Parent", "Sibling", "Colleague", "Friend", "Other"]} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <FInput label="Phone number" required type="tel" placeholder="e.g. +234 800 000 0000" />
                <FInput label="Alternate phone" optional type="tel" placeholder="Enter alternate phone number" />
                <FInput label="Email address" optional type="email" placeholder="name@example.com" />
              </div>
            </Section>

            <Section n={5} title="Employment documents" sub="Upload readable copies for the employee's personnel file. PDF, JPG or PNG. Maximum 5 MB per file.">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="mb-2 text-sm font-medium">Signed offer / contract <span className="text-brand">*</span></p>
                  <UploadBox sub="Agreed terms of employment" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Proof of identity <span className="text-brand">*</span></p>
                  <UploadBox sub="Government-issued identification" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Qualification certificates <span className="text-xs font-normal text-slate-400">(optional)</span></p>
                  <UploadBox sub="Certificates or professional licence" />
                </div>
              </div>
              <button type="button" className="mt-4 flex items-center gap-2 text-sm text-slate-600 hover:text-brand" onClick={() => toast("Additional document upload ready")}>
                <Upload size={14} /> Add another document <span className="text-xs text-slate-400">(optional)</span>
              </button>
              <p className="mt-2 text-xs text-slate-400">Add references, a CV or clearance documents if required by school policy. Missing documents can be saved in a draft.</p>
            </Section>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm font-medium">Review the details before adding this staff member.</p>
              <p className="mt-1 text-xs text-slate-500">Add New Staff creates an employee record. Portal access and permissions can be configured separately.</p>
            </div>

            {/* sticky footer */}
            <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-sm">
              <Link to="/staff" className="btn btn-ghost">Cancel</Link>
              <div className="flex gap-2.5">
                <button type="button" className="btn btn-ghost" onClick={() => toast("Draft saved")}>Save draft</button>
                <button type="submit" className="btn btn-primary"><UserPlus size={15} /> Add New Staff</button>
              </div>
            </div>
            <p className="pb-4 text-center text-xs text-slate-400">Staff information and employment documents are accessible only to authorized school administrators.</p>
          </form>
        </div>
      </div>
    </div>
  );
}