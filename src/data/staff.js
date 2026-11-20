import { studentPhotos } from "./students.js";

export const staffList = [
  {
    id: "EMP/2021/042", name: "Mrs. Chioma Okafor", initials: "CO",
    role: "Form Teacher (Academic)", roleTone: "academic", dept: "Humanities Dept.",
    subjects: "English Lang. (SS 1–3)", arm: "Class: SS 2B",
    email: "c.okafor@mightyschool.edu.ng", portal: "Active 2FA", portalVerified: true,
    status: "Active", category: "Academic/Teaching",
    allocations: ["SSS 2 Gold • Form Teacher", "English • SSS 1 Gold & Diamond", "English • SSS 2 Gold"],
  },
  {
    id: "EMP/2019/015", name: "Dr. Femi Alat", initials: "FA",
    role: "HOD (Academic)", roleTone: "academic", dept: "Sciences Dept.",
    subjects: "Physics (SS 2 & 3)", arm: "Lab Superintendent",
    email: "f.alabi@mightyschool.edu.ng", portal: "Active 2FA", portalVerified: true,
    status: "Active", category: "Academic/Teaching", allocations: [],
  },
  {
    id: "EMP/2020/008", name: "Mr. Babatunde Lawal", initials: "BL",
    role: "Senior Bursar (Admin)", roleTone: "bursar", dept: "Bursary Unit",
    subjects: "Institutional Accounts", arm: "Fee Reconciliation",
    email: "b.lawal@mightyschool.edu.ng", portal: "Bursar Level Access", portalVerified: false,
    status: "Active", category: "Admin", allocations: [],
  },
  {
    id: "EMP/2023/094", name: "Ms. Grace Ekwueme", initials: "GE",
    role: "Subject Teacher", roleTone: "teacher", dept: "Sciences Dept.",
    subjects: "Biology (JSS 1–3)", arm: "Relief: Mr K. Adeleke",
    email: "g.ekwueme@mightyschool.edu.ng", portal: "Active 2FA", portalVerified: true,
    status: "Leave: Nov 12", category: "Academic/Teaching", allocations: [],
  },
  {
    id: "EMP/2022/112", name: "Engr. Emeka Danjuma", initials: "ED",
    role: "Lead IT Admin", roleTone: "it", dept: "ICT Services",
    subjects: "ICT & Comp. Studies (All)", arm: "Network Operations",
    email: "e.danjuma@mightyschool.edu.ng", portal: "Super Admin Access", portalVerified: false,
    status: "Active", category: "Admin", allocations: [],
  },
  {
    id: "EMP/2024/003", name: "Mrs. Amina Bello", initials: "AB",
    role: "Faculty Lead", roleTone: "faculty", dept: "Primary Section",
    subjects: "Basic Science & Maths", arm: "Class: Primary 5A",
    email: "a.bello@mightyschool.edu.ng", portal: "Active 2FA", portalVerified: true,
    status: "Active", category: "Academic/Teaching", allocations: [],
  },
];

staffList.forEach((staff, index) => {
  staff.photo = studentPhotos[index % studentPhotos.length];
});

export const ROLE_BADGE = {
  academic: "bg-blue-100 text-blue-700",
  bursar:   "bg-orange-100 text-orange-800",
  teacher:  "bg-purple-100 text-purple-700",
  it:       "bg-gray-900 text-white",
  faculty:  "bg-green-100 text-green-700",
};