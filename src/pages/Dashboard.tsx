import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";
import SummaryCards from "../components/SummaryCards";
import { useNavigate } from "react-router-dom";

/** Small animated counter (no external lib) */
function AnimatedNumber({
  value,
  duration = 800,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(0);
  const toRef = useRef<number>(value);

  useEffect(() => {
    fromRef.current = display;
    toRef.current = value;
    startRef.current = null;

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const current = Math.round(
        fromRef.current + (toRef.current - fromRef.current) * t
      );
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
}

function ActivityItem({
  title,
  time,
  type = "info",
}: {
  title: string;
  time: string;
  type?: string;
}) {
  const color =
    type === "success"
      ? "bg-green-100 text-green-700"
      : type === "warn"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";
  return (
    <li className="flex items-start gap-3 p-3 rounded-md hover:bg-slate-50 transition">
      <div
        className={`flex-none w-9 h-9 rounded-full flex items-center justify-center ${color}`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 6v6l4 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-800">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{time}</div>
      </div>
      <div className="text-xs text-slate-400">Now</div>
    </li>
  );
}

export default function Dashboard({ onLogout }: { onLogout?: () => void }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState(210);
  const [orders, setOrders] = useState(76);
  const [revenue, setRevenue] = useState(2350000);

  // STATE FOR SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.title = "Selamat Datang di Dashboard";
    const t = setTimeout(() => {
      setUsers((u) => u + 12);
      setOrders((o) => o + 4);
      setRevenue((r) => r + 250000);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    if (onLogout) onLogout();
    else navigate("/login");
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <HeaderBar
          onLogout={handleLogout}
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        <main className="p-6 overflow-y-auto">
          {/* Top summary + action row */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <div className="flex gap-3 items-center">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-md border border-slate-200 shadow-sm hover:shadow-md transition"
                title="Quick filter"
              >
                <svg
                  className="w-4 h-4 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 5h18M6 12h12M10 19h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Filters
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition transform active:scale-[0.98] shadow">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                New Report
              </button>
            </div>
          </div>

          {/* Summary cards (pakai SummaryCards component) */}
          <div className="mb-6">
            <SummaryCards users={users} orders={orders} revenue={revenue} />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <div className="text-xs text-slate-400">
                    Showing last 7 days
                  </div>
                </div>

                <ul className="divide-y divide-slate-100">
                  <ActivityItem
                    title="User Ahmad signed up"
                    time="2 hours ago"
                    type="success"
                  />
                  <ActivityItem
                    title="Monthly backup completed"
                    time="4 hours ago"
                    type="info"
                  />
                  <ActivityItem
                    title="Payment failed for order #234"
                    time="1 day ago"
                    type="warn"
                  />
                  <ActivityItem
                    title="New report exported"
                    time="2 days ago"
                    type="info"
                  />
                </ul>

                <div className="mt-4 text-right">
                  <button className="text-sm text-blue-600 hover:underline">
                    View all activity
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm">
                    Add user
                  </button>
                  <button className="px-4 py-2 border rounded-md hover:bg-slate-50 transition">
                    Import
                  </button>
                  <button className="px-4 py-2 border rounded-md hover:bg-slate-50 transition">
                    Export
                  </button>
                  <button className="px-4 py-2 border rounded-md hover:bg-slate-50 transition">
                    Run backup
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-semibold mb-3">Usage Summary</h3>
                <div className="text-sm text-slate-500 mb-3">
                  Active users this week
                </div>
                <div className="h-28 flex items-center justify-center text-sm text-slate-400">
                  <div className="text-xs">
                    [Chart placeholder — add Recharts for real graph]
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-semibold mb-3">Notifications</h3>
                <ul className="text-sm space-y-2">
                  <li className="px-2 py-1 rounded-md bg-amber-50 text-amber-800">
                    Scheduled maintenance on Sat
                  </li>
                  <li className="px-2 py-1 rounded-md bg-green-50 text-green-800">
                    New integration available
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
