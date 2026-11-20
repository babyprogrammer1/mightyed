import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../context/AppContext.jsx";

export default function Placeholder() {
  // Page flow: provide a useful mock workspace for routes whose backend module is not connected yet.
  const { slug } = useParams();
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  const title = slug.replace(/-/g, " ");
  const isHelp = slug === "help";
  const isSettings = slug === "settings";
  return (
    <div className="card mx-auto flex max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold capitalize">{isHelp ? "Help & Support Center" : isSettings ? "Account Settings" : title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {isHelp ? "Find quick answers and contact the MightyEd support team." : isSettings ? "Manage the current administrator profile and notification preferences." : "This workspace is ready for local demo data and actions."}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(isHelp
          ? [["Getting started", "Review the dashboard cards and use the sidebar to move between modules."], ["Contact support", "Support desk: support@mightyschool.edu.ng"]]
          : [["Profile", "Jenny Wilson • Chief Bursar & Administrator"], ["Notifications", "Email and in-app notifications are enabled"]]
        ).map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold">{label}</p>
            <p className="mt-1 text-xs text-slate-500">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={() => { setSaved(true); toast(isHelp ? "Support request opened" : "Settings saved"); }}>
          {saved ? "Saved ✓" : isHelp ? "Contact Support" : "Save Settings"}
        </button>
        <Link className="btn btn-ghost" to="/">Back to dashboard</Link>
      </div>
    </div>
  );
}
