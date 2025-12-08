import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  status: "active" | "inactive";
};

type SortConfig = {
  key: keyof User;
  direction: "asc" | "desc";
};

export default function Users({ onLogout }: { onLogout?: () => void }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "asc",
  });
  const itemsPerPage = 10;

  // === SET PAGE TITLE ===
  useEffect(() => {
    const prev = document.title;
    document.title = "Halaman Users";
    return () => {
      document.title = prev;
    };
  }, []);

  // Sample data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      createdAt: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      createdAt: "2024-01-16",
      status: "active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Editor",
      createdAt: "2024-01-17",
      status: "inactive",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "User",
      createdAt: "2024-01-18",
      status: "active",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "Admin",
      createdAt: "2024-01-19",
      status: "active",
    },
    {
      id: 6,
      name: "Diana Miller",
      email: "diana@example.com",
      role: "User",
      createdAt: "2024-01-20",
      status: "inactive",
    },
    {
      id: 7,
      name: "Edward Davis",
      email: "edward@example.com",
      role: "Editor",
      createdAt: "2024-01-21",
      status: "active",
    },
    {
      id: 8,
      name: "Fiona Garcia",
      email: "fiona@example.com",
      role: "User",
      createdAt: "2024-01-22",
      status: "active",
    },
    {
      id: 9,
      name: "George Martinez",
      email: "george@example.com",
      role: "Admin",
      createdAt: "2024-01-23",
      status: "inactive",
    },
    {
      id: 10,
      name: "Hannah Lee",
      email: "hannah@example.com",
      role: "User",
      createdAt: "2024-01-24",
      status: "active",
    },
    {
      id: 11,
      name: "Ian Taylor",
      email: "ian@example.com",
      role: "Editor",
      createdAt: "2024-01-25",
      status: "active",
    },
    {
      id: 12,
      name: "Julia Clark",
      email: "julia@example.com",
      role: "User",
      createdAt: "2024-01-26",
      status: "active",
    },
    {
      id: 13,
      name: "Kevin Lewis",
      email: "kevin@example.com",
      role: "User",
      createdAt: "2024-01-27",
      status: "inactive",
    },
    {
      id: 14,
      name: "Lisa Walker",
      email: "lisa@example.com",
      role: "Admin",
      createdAt: "2024-01-28",
      status: "active",
    },
    {
      id: 15,
      name: "Mike Hall",
      email: "mike@example.com",
      role: "User",
      createdAt: "2024-01-29",
      status: "active",
    },
  ]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authUser");
    if (onLogout) onLogout();
    else navigate("/login");
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Handle sort
  const handleSort = (key: keyof User) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q)
    );

    // Sorting
    filtered.sort((a, b) => {
      const av = a[sortConfig.key];
      const bv = b[sortConfig.key];

      if (sortConfig.key === "createdAt") {
        const ad = new Date(String(av)).getTime();
        const bd = new Date(String(bv)).getTime();
        return sortConfig.direction === "asc" ? ad - bd : bd - ad;
      }

      // fallback to string compare
      if (String(av) < String(bv))
        return sortConfig.direction === "asc" ? -1 : 1;
      if (String(av) > String(bv))
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedUsers.length / itemsPerPage)
  );
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Render sort icon
  const getSortIcon = (key: keyof User) => {
    if (sortConfig.key !== key) {
      return (
        <svg
          className="w-4 h-4 ml-1 opacity-50"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 15l5 5 5-5M7 9l5-5 5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 15l7-7 7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
        <path
          d="M19 9l-7 7-7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
          {/* Search and Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search users by name, email, or role..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Filter
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    {[
                      { key: "id", label: "ID" },
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "role", label: "Role" },
                      { key: "createdAt", label: "Created At" },
                      { key: "status", label: "Status" },
                    ].map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition"
                        onClick={() => handleSort(column.key as keyof User)}
                      >
                        <div className="flex items-center">
                          {column.label}
                          {getSortIcon(column.key as keyof User)}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          #{user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="text-blue-600 text-xs font-medium">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "Admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "Editor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <div className="flex gap-2">
                            <button
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="text-slate-400">
                          <svg
                            className="w-12 h-12 mx-auto mb-3 opacity-50"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-sm mt-1">
                            Try adjusting your search or filter
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAndSortedUsers.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredAndSortedUsers.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredAndSortedUsers.length}
                  </span>{" "}
                  results
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 19l-7-7 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-md text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
