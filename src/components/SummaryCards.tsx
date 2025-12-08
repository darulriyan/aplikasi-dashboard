import React from "react";

type Props = {
  users?: number;
  orders?: number;
  revenue?: number;
};

export default function SummaryCards({
  users = 128,
  orders = 54,
  revenue = 1250000,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        className="bg-white p-5 rounded-xl shadow-sm border border-slate-100
                hover:shadow-md hover:translate-y-[-2px] transition-all cursor-pointer"
      >
        <div className="text-sm text-slate-500">Jumlah Pengguna</div>
        <div className="text-2xl font-bold mt-2">{users}</div>
      </div>

      <div
        className="bg-white p-5 rounded-xl shadow-sm border border-slate-100
                hover:shadow-md hover:translate-y-[-2px] transition-all cursor-pointer"
      >
        <div className="text-sm text-slate-500">Pesanan</div>
        <div className="text-2xl font-bold mt-2">{orders}</div>
      </div>

      <div
        className="bg-white p-5 rounded-xl shadow-sm border border-slate-100
                hover:shadow-md hover:translate-y-[-2px] transition-all cursor-pointer"
      >
        <div className="text-sm text-slate-500">Pendapatan</div>
        <div className="text-2xl font-bold mt-2">
          Rp {revenue.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
