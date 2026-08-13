"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "@/lib/supabase";
import type { DashboardFilter } from "./DashboardCards";

type Props = {
  filter: DashboardFilter;
};

function isToday(dateString: string) {
  return (
    new Date(dateString).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ===
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  );
}

function applyFilter(data: any[], filter: DashboardFilter) {
  if (filter.type === "all") return data;
  if (filter.type === "today") return data.filter((item) => isToday(item.created_at));
  if (filter.type === "destination") {
    return data.filter(
      (item) => String(item.destination).toLowerCase() === filter.value.toLowerCase()
    );
  }
  return data.filter(
    (item) => String(item.ward).toLowerCase() === filter.value.toLowerCase()
  );
}

export default function ExportExcel({ filter }: Props) {
  const exportExcel = async () => {
    const { data, error } = await supabase
      .from("passengers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    const filteredData = applyFilter(data || [], filter);

    if (filteredData.length === 0) {
      alert("No passenger data available for this selection.");
      return;
    }

    const excelData = filteredData.map((item: any, index: number) => ({
      "Sr No": index + 1,
      Name: item.name,
      "Mobile Number": item.mobile,
      "Date of Birth": item.dob,
      "Aadhaar Number": item.aadhaar,
      "Voter ID": item.voter_id || "NA",
      "Full Address": item.address,
      Destination: item.destination,
      "Ward Number": item.ward,
      "Registration Date": new Date(item.created_at).toLocaleString("en-IN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 8 }, { wch: 24 }, { wch: 16 }, { wch: 14 }, { wch: 18 },
      { wch: 16 }, { wch: 40 }, { wch: 18 }, { wch: 14 }, { wch: 24 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Passengers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const label =
      filter.type === "all"
        ? "All"
        : filter.type === "today"
        ? "Today"
        : filter.type === "destination"
        ? filter.value
        : `Ward_${filter.value}`;

    const safeLabel = label.replace(/[^a-zA-Z0-9_-]/g, "_");
    saveAs(file, `Ganesh_Bus_Registration_${safeLabel}.xlsx`);
  };

  const label =
    filter.type === "all"
      ? "All Data"
      : filter.type === "today"
      ? "Today's Data"
      : filter.type === "destination"
      ? filter.value
      : `Ward ${filter.value}`;

  return (
    <button
      onClick={exportExcel}
      className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
    >
      📥 Export {label}
    </button>
  );
}
