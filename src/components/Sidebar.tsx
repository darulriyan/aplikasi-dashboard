import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  open: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "flex items-center gap-3 px-4 py-2 rounded-md text-sm " +
    (isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100");

  return (
    <>
      {/* Overlay mobile */}
      <div
        onClick={() => onClose && onClose()}
        className={`fixed inset-0 bg-black/30 z-30 lg:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      />

      <aside
        className={`
          w-64 bg-white border-r h-screen
          fixed lg:fixed top-0 left-0 z-40
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full lg:-translate-x-full"}
        `}
      >
        <div className="p-5 border-b">
          <div className="text-lg font-bold">Aplikasi Dashboard</div>
          <div className="text-xs text-slate-400 mt-1">Admin Panel</div>
        </div>

        <nav className="p-3 space-y-1">
          <NavLink to="/dashboard" className={linkClass}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z"
                fill="currentColor"
              />
            </svg>
            <span>Overview</span>
          </NavLink>

          <NavLink to="/users" className={linkClass}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0H4z"
                fill="currentColor"
              />
            </svg>
            <span>Users</span>
          </NavLink>

          <NavLink to="/reports" className={linkClass}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"
                fill="currentColor"
              />
            </svg>
            <span>Reports</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
