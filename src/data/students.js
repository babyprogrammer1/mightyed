import p1 from "../assets/students/1.png";
import p2 from "../assets/students/2.png";
import p3 from "../assets/students/3.png";
import p4 from "../assets/students/4.png";
import p5 from "../assets/students/5.png";
import p6 from "../assets/students/6.png";
export const initial = [
  { id: "MIS/2024/0142", name: "Adebayo Samuel", cls: "SSS 2B", lvl: "Senior Secondary", gender: "Male", age: 15, parent: "Dr. Kunle Adebayo", phone: "0803 123 4567", fee: "Paid", status: "Active" },
  { id: "MIS/2024/0188", name: "Okonkwo Chidimma", cls: "SSS 2A", lvl: "Senior Secondary", gender: "Female", age: 16, parent: "Mrs. Grace Okonkwo", phone: "0802 987 6543", fee: "Partial (₦50k)", status: "Active" },
  { id: "MIS/2024/0091", name: "Abubakar Ibrahim", cls: "JSS 3C", lvl: "Junior Secondary", gender: "Male", age: 13, parent: "Mallam Yusuf Abubakar", phone: "0805 444 1122", fee: "Defaulter", status: "Active" },
  { id: "MIS/2023/0401", name: "Ekaette Blessing", cls: "JSS 1B", lvl: "Junior Secondary", gender: "Female", age: 11, parent: "Mr. Bassey Ekaette", phone: "0807 555 8899", fee: "Paid", status: "Suspended" },
  { id: "MIS/2024/0312", name: "Danjuma Fatima", cls: "SSS 3B", lvl: "Senior Secondary", gender: "Female", age: 17, parent: "Col. Aliyu Danjuma", phone: "0809 333 7711", fee: "Scholarship", status: "Active" },
  { id: "MIS/2023/0219", name: "Balogun Tunde", cls: "JSS 2B", lvl: "Junior Secondary", gender: "Male", age: 12, parent: "Alhaja Simbiat Balogun", phone: "0812 666 4321", fee: "Paid", status: "Active" },
];

export const idToSlug = (id) => id.replaceAll("/", "-");
export const findStudent = (slug) => initial.find((s) => idToSlug(s.id) === slug);

export const CLASSES = ["JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B", "JSS 3A", "JSS 3B", "JSS 3C", "SSS 1A", "SSS 2A", "SSS 2B", "SSS 3A", "SSS 3B"];
export const levelOf = (c) => (c.startsWith("JSS") ? "Junior Secondary" : c.startsWith("SSS") ? "Senior Secondary" : "Primary");
export const nextIds = (list, n) => {
  const max = Math.max(0, ...list.filter((s) => s.id.startsWith("MIS/2026/")).map((s) => Number(s.id.split("/")[2])));
  return Array.from({ length: n }, (_, i) => `MIS/2026/${String(max + i + 1).padStart(4, "0")}`);
};

const photos = [p1, p2, p3, p4, p5, p6];
initial.forEach((s, i) => { s.photo = photos[i]; });
