"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "@/lib/supabase";
import type { DashboardFilter } from "./DashboardCards";

type Passenger = {
  id?: string;
  name?: string;
  mobile?: string;
  age?: number | null;
  gender?: string | null;
  relation?: string | null;
  aadhaar?: string;
  voter_id?: string;
  address?: string;
  destination?: string;
  ward?: string;
  created_at?: string;
};

type Props = {
  filter: DashboardFilter;
};

function isToday(dateString?: string) {
  if (!dateString) return false;

  return (
    new Date(dateString).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    }) ===
    new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    })
  );
}

function matchesFilter(passenger: Passenger, filter: DashboardFilter) {
  if (filter.type === "all") return true;

  if (filter.type === "today") {
    return isToday(passenger.created_at);
  }

  if (filter.type === "destination") {
    return (
      String(passenger.destination || "").toLowerCase() ===
      filter.value.toLowerCase()
    );
  }

  return (
    String(passenger.ward || "").toLowerCase() === filter.value.toLowerCase()
  );
}

export default function ExportExcel({ filter }: Props) {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      const { data, error } = await supabase
        .from("passengers")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Unable to load export count:", error);
        setCount(0);
        return;
      }

      const filtered = ((data || []) as Passenger[]).filter((p) =>
        matchesFilter(p, filter)
      );

      setCount(filtered.length);
    }

    loadCount();

    return () => {
      cancelled = true;
    };
  }, [filter]);

  async function handleExport() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("passengers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const passengers = ((data || []) as Passenger[]).filter((p) =>
        matchesFilter(p, filter)
      );

      if (passengers.length === 0) {
        alert("No passenger data available for export.");
        return;
      }

      const rows = passengers.map((p, index) => ({
        "Sr. No.": index + 1,
        Name: p.name || "",
        Mobile: p.mobile || "",
        Age: p.age ?? "",
        Gender: p.gender || "",
        Relation: p.relation || "self",
        Aadhaar: p.aadhaar || "",
        "Voter ID": p.voter_id || "NA",
        Address: p.address || "",
        Destination: p.destination || "",
        Ward: p.ward || "",
        "Registration Date": p.created_at
          ? new Date(p.created_at).toLocaleString("en-IN")
          : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 25 },
        { wch: 15 },
        { wch: 10 },
        { wch: 12 },
        { wch: 18 },
        { wch: 18 },
        { wch: 35 },
        { wch: 18 },
        { wch: 12 },
        { wch: 24 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Passengers");

      const buffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      let filename = "all-passengers.xlsx";

      if (filter.type === "today") {
        filename = "todays-registrations.xlsx";
      } else if (filter.type === "destination") {
        filename = `${filter.value}-passengers.xlsx`;
      } else if (filter.type === "ward") {
        filename = `ward-${filter.value}-passengers.xlsx`;
      }

      saveAs(blob, filename);
    } catch (error) {
      console.error("Excel export error:", error);
      alert("Unable to export passenger data.");
    } finally {
      setLoading(false);
    }
  }

  const label =
    filter.type === "all"
      ? "Export All Data"
      : filter.type === "today"
        ? "Export Today's Data"
        : filter.type === "destination"
          ? `Export ${filter.value}`
          : `Export Ward ${filter.value}`;

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <Download size={18} />
      <span>{loading ? "Exporting..." : label}</span>
      {!loading && (
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
