import Papa from "papaparse";

export function downloadCSV(name, rows) {
  const blob = new Blob([Papa.unparse(rows)], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
export const parseCSV = (text) =>
  Papa.parse(text, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim().toLowerCase() }).data;
