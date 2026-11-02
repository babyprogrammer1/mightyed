import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  DashboardIcon, PeopleIcon, EnrollmentIcon, RoleBasedIcon, FeeStructureIcon, InvoiceIcon, TermFeeIcon,
  ClassManagerIcon, BroadcastIcon, CertificateIcon, HelpIcon,
} from "./icons.jsx";

const groups = [
  { title: "Overview", items: [{ to: "/", label: "Dashboard", icon: DashboardIcon }] },
  { title: "Student Records Management", items: [
    { to: "/students", label: "Student Directory & Roster", icon: PeopleIcon },
    { to: "/enrollment", label: "Enrollment & Class Promotion", icon: EnrollmentIcon },
  ]},
  { title: "Staff Management", items: [
    { to: "/staff", label: "Staff Directory & Roles", icon: PeopleIcon },
    { to: "/access-control", label: "Role-Based Access Control", icon: RoleBasedIcon },
  ]},
  { title: "Fee Management & Financials", items: [
    { to: "/fee-management", label: "Fee Management Overview", icon: DashboardIcon },
    { to: "/fee-structure", label: "Fee Structure & Billing Setup", icon: FeeStructureIcon },
    { to: "/invoices", label: "Invoice & Defaulters Mgt.", icon: InvoiceIcon },
    { to: "/transactions", label: "Transaction History & Gateway", icon: RoleBasedIcon },
  ]},
  { title: "Academic & Exam Oversight", items: [
    { to: "/timetable", label: "Class & Timetable Manager", icon: ClassManagerIcon },
    { to: "/report-cards", label: "Exam & Report Card Generator", icon: EnrollmentIcon },
  ]},
  { title: "Communication & Administration", items: [
    { to: "/broadcast", label: "Broadcast & Announcements", icon: BroadcastIcon },
    { to: "/documents", label: "Document & Certificate Builder", icon: CertificateIcon },
  ]},
];

const link = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] hover:bg-slate-50 ${isActive ? "bg-indigo-50 font-semibold text-[#3f01ad]" : "text-[#45464d]"}`;

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[272px] flex-none flex-col overflow-y-auto bg-white p-4 lg:flex print:hidden">
      <div className="flex items-center gap-2.5 px-1 pb-4">
        <img src={logo} alt="Xentra" className="size-10" />
        <div className="leading-tight"><strong className="block text-lg">MightyEd</strong><span className="text-xs text-slate-500">Admin Portal</span></div>
      </div>
      <nav>
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mx-3 mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-[#45464d]">{g.title}</p>
            {g.items.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === "/"} className={link}>
                <span className="grid w-5 flex-none place-items-center"><Icon /></span> {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="-mx-4 -mb-4 mt-auto bg-indigo-50 p-4">
        <NavLink to="/help" className={link}><span className="grid w-5 flex-none place-items-center"><HelpIcon /></span> Help & Support Center</NavLink>
        <div className="mt-2 flex justify-between rounded-lg bg-white p-3 text-xs">System Core <b className="text-indigo-700">MightyEd v3.4</b></div>
      </div>
    </aside>
  );
}
