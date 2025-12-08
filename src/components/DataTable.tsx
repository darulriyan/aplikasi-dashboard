import React, { useMemo, useState } from "react";

type Row = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string; // ISO date string
};

type SortConfig = {
  key: keyof Row | null;
  direction: "asc" | "desc";
};

export default function DataTable({ data }: { data: Row[] }) {
  // ---- UI state ----
  const [query, setQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ---- Filtering (search) ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) =>
      [
        String(r.id),
        r.name,
        r.email,
        r.role,
        new Date(r.createdAt).toLocaleString(),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [data, query]);

  // ---- Sorting ----
  const sorted = useMemo(() => {
    const { key, direction } = sortConfig;
    if (!key) return filtered;
    const sortedArr = [...filtered].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      // numeric
      if (typeof av === "number" && typeof bv === "number")
        return direction === "asc" ? av - bv : bv - av;
      // date
      if (key === "createdAt") {
        const ad = new Date(String(av)).getTime();
        const bd = new Date(String(bv)).getTime();
        return direction === "asc" ? ad - bd : bd - ad;
      }
      // string fallback
      return direction === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return sortedArr;
  }, [filtered, sortConfig]);

  // ---- Pagination ----
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (current - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, current, perPage]);

  // ---- Handlers ----
  const toggleSort = (key: keyof Row) => {
    setPage(1); // reset page when sorting
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const onSearchChange = (v: string) => {
    setPage(1);
    setQuery(v);
  };

  const changePerPage = (n: number) => {
    setPerPage(n);
    setPage(1);
  };

  // ---- Render helpers ----
  const SortIcon = ({ column }: { column: keyof Row }) => {
    if (sortConfig.key !== column) {
      return <span className="opacity-40">↕</span>;
    }
    return sortConfig.direction === "asc" ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
        <div className="flex items-center gap-3">
          <input
            aria-label="Search table"
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, role..."
            className="px-3 py-2 border rounded-md w-64 focus:ring-2 focus:ring-blue-300 outline-none"
          />
          <div className="text-sm text-slate-500">Results: {total}</div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-500">Rows</label>
          <select
            value={perPage}
            onChange={(e) => changePerPage(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("id")}
              >
                <div className="flex items-center gap-2">
                  <span>ID</span>
                  <SortIcon column="id" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-2">
                  <span>Name</span>
                  <SortIcon column="name" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("email")}
              >
                <div className="flex items-center gap-2">
                  <span>Email</span>
                  <SortIcon column="email" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("role")}
              >
                <div className="flex items-center gap-2">
                  <span>Role</span>
                  <SortIcon column="role" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  <span>Created at</span>
                  <SortIcon column="createdAt" />
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-b-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 rounded text-xs bg-slate-100 text-slate-800">
                      {row.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between gap-3 p-4 border-t">
        <div className="text-sm text-slate-600">
          Showing <strong>{(current - 1) * perPage + 1}</strong> to{" "}
          <strong>{Math.min(current * perPage, total)}</strong> of{" "}
          <strong>{total}</strong> entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={current === 1}
            className="px-3 py-1 rounded border bg-white disabled:opacity-40"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            className="px-3 py-1 rounded border bg-white disabled:opacity-40"
          >
            {"<"}
          </button>

          <div className="px-3 py-1 border rounded">
            Page{" "}
            <input
              value={current}
              onChange={(e) => {
                const v = Number(e.target.value || 1);
                if (!Number.isNaN(v))
                  setPage(Math.min(Math.max(1, v), totalPages));
              }}
              className="w-12 text-center outline-none"
            />{" "}
            / {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current === totalPages}
            className="px-3 py-1 rounded border bg-white disabled:opacity-40"
          >
            {">"}
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={current === totalPages}
            className="px-3 py-1 rounded border bg-white disabled:opacity-40"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
