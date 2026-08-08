"use client";

import { useState } from "react";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import DashboardCards from "@/components/admin/DashboardCards";
import PassengerTable from "@/components/admin/PassengerTable";
import ExportExcel from "@/components/admin/ExportExcel";
import PrintButton from "@/components/admin/PrintButton";

import "./print.css";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-orange-50">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1">

        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-6">

          <DashboardCards />

          <div className="mt-8">

            <div className="mb-5 flex flex-wrap items-center flex-col sm:flex-row gap-3">

              <PrintButton />

              <ExportExcel />

            </div>

            <PassengerTable />

          </div>

        </main>

      </div>

    </div>
  );
}