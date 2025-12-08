import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  onLogout?: () => void;
  toggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

export default function HeaderBar({
  onLogout,
  toggleSidebar,
  sidebarOpen,
}: Props) {
  const navigate = useNavigate();
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const user = stored ? JSON.parse(stored) : null;

  const logout = () => {
    localStorage.removeItem("authUser");
    if (onLogout) onLogout();
    else navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger button */}
        <button
          onClick={() => toggleSidebar && toggleSidebar()}
          className="p-2 rounded-md hover:bg-slate-100 transition"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg
            className="w-6 h-6 text-slate-600"
            viewBox="0 0 24 24"
            fill="none"
          >
            {sidebarOpen ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>

        <div>
          <h2 className="text-lg font-semibold">Overview</h2>
          <div className="text-sm text-slate-500">
            Selamat Pagi{user ? `, ${user.email}` : ""}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium">{user?.email ?? "Guest"}</div>
            <div className="text-xs text-slate-400">Administrator</div>
          </div>

          <button
            onClick={logout}
            className="
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
              bg-red-500 text-white border border-transparent
              hover:bg-white hover:text-red-500 hover:border-red-500
              transition-all shadow-sm active:scale-[0.98]
            "
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
