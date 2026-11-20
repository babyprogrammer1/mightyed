import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import LayoutNoSidebar from "./components/LayoutNoSidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import Enroll from "./pages/Enroll.jsx";
import Enrollment from "./pages/Enrollment.jsx";
import Staff from "./pages/Staff.jsx";
import AddStaff from "./pages/AddStaff.jsx";
import RoleAccess from "./pages/RoleAccess.jsx";
import FeeOverview from "./pages/FeeOverview.jsx";
import FeeStructure from "./pages/FeeStructure.jsx";
import InvoiceDefaulters from "./pages/InvoiceDefaulters.jsx";
import TransactionHistory from "./pages/TransactionHistory.jsx";
import TimetableManager from "./pages/TimetableManager.jsx";
import ExamReportCard from "./pages/ExamReportCard.jsx";
import BroadcastAnnouncements from "./pages/BroadcastAnnouncements.jsx";
import DocumentBuilder from "./pages/DocumentBuilder.jsx";
import CreateTimetable from "./pages/CreateTimetable.jsx";
import Placeholder from "./pages/Placeholder.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="enrollment" element={<Enrollment />} />
        <Route path="staff" element={<Staff />} />
        <Route path="role-access" element={<RoleAccess />} />
        <Route path="access-control" element={<RoleAccess />} />
        <Route path="fee-management" element={<FeeOverview />} />
        <Route path="fee-overview" element={<FeeOverview />} />
        <Route path="fee-structure" element={<FeeStructure />} />
        <Route path="invoices" element={<InvoiceDefaulters />} />
        <Route path="transactions" element={<TransactionHistory />} />
        <Route path="timetable" element={<TimetableManager />} />
        <Route path="report-cards" element={<ExamReportCard />} />
        <Route path="broadcast" element={<BroadcastAnnouncements />} />
        <Route path="documents" element={<DocumentBuilder />} />
        <Route path=":slug" element={<Placeholder />} />
      </Route>
      <Route element={<LayoutNoSidebar />}>
        <Route path="enroll" element={<Enroll />} />
        <Route path="add-staff" element={<AddStaff />} />
        <Route path="create-timetable" element={<CreateTimetable />} />
      </Route>
    </Routes>
  );
}