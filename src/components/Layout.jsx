import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 1024);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateSidebar = (event) => setSidebarOpen(event.matches);
    mediaQuery.addEventListener("change", updateSidebar);
    return () => mediaQuery.removeEventListener("change", updateSidebar);
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <div className={`min-w-0 transition-[margin] duration-200 ${sidebarOpen ? "lg:ml-[272px]" : ""}`}>
        <Topbar sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className="p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
