"use client";

import { useState } from "react";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import PassengerTable from "@/components/admin/PassengerTable";

export default function PassengersPage() {
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

          <PassengerTable />

        </main>

      </div>

    </div>
  );
}