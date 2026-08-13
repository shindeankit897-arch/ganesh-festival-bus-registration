"use client";

import { useState } from "react";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import DashboardCards, {
  type DashboardFilter,
} from "@/components/admin/DashboardCards";
import PassengerTable from "@/components/admin/PassengerTable";
import ExportExcel from "@/components/admin/ExportExcel";
import PrintButton from "@/components/admin/PrintButton";

import "./print.css";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<DashboardFilter>({ type: "all" });

  return (
    <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden bg-orange-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-w-0 overflow-x-hidden p-3 sm:p-6">
          <DashboardCards
            selectedFilter={filter}
            onFilterChange={setFilter}
          />

          <div className="mt-6 min-w-0 sm:mt-8">
            <div className="mb-5 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
              <PrintButton filter={filter} />
              <ExportExcel filter={filter} />

              {filter.type !== "all" && (
                <button
                  type="button"
                  onClick={() => setFilter({ type: "all" })}
                  className="w-full rounded-lg border border-orange-400 bg-white px-5 py-3 text-center font-semibold text-orange-600 hover:bg-orange-50 sm:w-auto"
                >
                  ↩ All Data
                </button>
              )}
            </div>

            <PassengerTable filter={filter} />
          </div>
        </main>
      </div>
    </div>
  );
}
