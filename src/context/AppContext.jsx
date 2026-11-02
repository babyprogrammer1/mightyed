import { createContext, useContext, useState, useCallback } from "react";
import { initial } from "../data/students.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
export const useToast = () => useApp().toast;

export function AppProvider({ children }) {
  const [students, setStudents] = useState(initial);
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg) => {
    const id = Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);
  const value = {
    students, toast,
    addStudents: (list) => setStudents((s) => [...list, ...s]),
    updateStudent: (id, patch) => setStudents((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    deleteStudent: (id) => setStudents((s) => s.filter((x) => x.id !== id)),
  };
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] grid gap-2 print:hidden" role="status">{toasts.map((t) => <div key={t.id} className="rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{t.msg}</div>)}</div>
    </Ctx.Provider>
  );
}
