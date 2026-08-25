"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "@/lib/supabase";
import { toMarathiDigits } from "@/lib/numberLocale";
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
  language?: "en" | "mr" | null;
  created_at?: string;
};

type Props = { filter: DashboardFilter };

const destinationMr: Record<string, string> = {
  poladpur:"पोलादपूर", dapoli:"दापोली", devgad:"देवगड", chiplun:"चिपळूण", khed:"खेड",
  shrivardhan:"श्रीवर्धन", mangaon:"माणगाव", guhaghar:"गुहाघर", sangmeshwar:"संगमेश्वर", lanja:"लांजा",
  ratnagiri:"रत्नागिरी", mahad:"महाड", kharepatan:"खारेपाटण", kankavli:"कणकवली", taral:"ताराल",
  rajapur:"राजापूर", sawantwadi:"सावंतवाडी", sarkhpa:"सरखपा", devrukh:"देवरुख", bhanbed:"भानबेड",
  malvan:"मालवण", mandangad:"मंडणगड"
};

const genderMr: Record<string, string> = { male: "पुरुष", female: "महिला" };
const relationMr: Record<string, string> = {
  self:"स्वतः", wife:"पत्नी", daughter:"मुलगी", son:"मुलगा", mother:"आई", father:"वडील",
  son_in_law:"जावई", daughter_in_law:"सून"
};

function isToday(dateString?: string) {
  if (!dateString) return false;
  return new Date(dateString).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ===
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function matchesFilter(p: Passenger, filter: DashboardFilter) {
  if (filter.type === "all") return true;
  if (filter.type === "today") return isToday(p.created_at);
  if (filter.type === "destination") return String(p.destination || "").toLowerCase() === filter.value.toLowerCase();
  return String(p.ward || "").toLowerCase() === filter.value.toLowerCase();
}

function marathiValue(value: string | number | null | undefined, type: "text" | "number" = "text") {
  if (value === null || value === undefined) return "";
  return type === "number" ? toMarathiDigits(value) : String(value);
}

export default function ExportExcel({ filter }: Props) {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  async function getPassengers() {
    const { data, error } = await supabase.from("passengers").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return ((data || []) as Passenger[]).filter((p) => matchesFilter(p, filter));
  }

  useEffect(() => {
    let cancelled = false;
    getPassengers().then((rows) => { if (!cancelled) setCount(rows.length); }).catch(() => { if (!cancelled) setCount(0); });
    return () => { cancelled = true; };
  }, [filter]);

  async function handleExport() {
    try {
      setLoading(true);
      const passengers = await getPassengers();
      if (!passengers.length) { alert("No passenger data available for export."); return; }

      // If all selected records were registered in Marathi, the complete workbook is Marathi.
      // For mixed data, standardized values are translated per row and the headings use Marathi
      // so the exported workbook remains client-friendly in Marathi.
      const marathi = passengers.every((p) => p.language === "mr");
      const useMarathi = marathi || passengers.some((p) => p.language === "mr");

      const rows = passengers.map((p, index) => {
        const rowMr = p.language === "mr" || useMarathi;
        const destination = rowMr ? (destinationMr[p.destination || ""] || p.destination || "") : (p.destination || "");
        const gender = rowMr ? (genderMr[p.gender || ""] || p.gender || "") : (p.gender || "");
        const relation = rowMr ? (relationMr[p.relation || "self"] || p.relation || "self") : (p.relation || "self");
        const number = (v: string | number | null | undefined) => rowMr ? marathiValue(v, "number") : String(v ?? "");
        const date = p.created_at ? new Date(p.created_at).toLocaleString(rowMr ? "mr-IN" : "en-IN") : "";

        return rowMr ? {
          "अनुक्रमांक": toMarathiDigits(index + 1), "नाव": p.name || "", "मोबाईल क्रमांक": number(p.mobile),
          "वय": number(p.age), "लिंग": gender, "नाते": relation, "आधार क्रमांक": number(p.aadhaar),
          "मतदार ओळखपत्र": p.voter_id || "NA", "पत्ता": p.address || "", "गंतव्य": destination,
          "प्रभाग क्रमांक": number(p.ward), "नोंदणी दिनांक": date,
        } : {
          "Sr. No.": index + 1, "Name": p.name || "", "Mobile": p.mobile || "", "Age": p.age ?? "",
          "Gender": gender, "Relation": relation, "Aadhaar": p.aadhaar || "", "Voter ID": p.voter_id || "NA",
          "Address": p.address || "", "Destination": destination, "Ward": p.ward || "", "Registration Date": date,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!cols"] = Array(Object.keys(rows[0]).length).fill({ wch: 20 });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, useMarathi ? "प्रवासी" : "Passengers");
      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        filter.type === "today" ? "todays-registrations.xlsx" : filter.type === "destination" ? `${filter.value}-passengers.xlsx` : filter.type === "ward" ? `ward-${filter.value}-passengers.xlsx` : "all-passengers.xlsx");
    } catch (error) {
      console.error("Excel export error:", error);
      alert("Unable to export passenger data.");
    } finally { setLoading(false); }
  }

  const label = filter.type === "all" ? "Export All Data" : filter.type === "today" ? "Export Today's Data" : filter.type === "destination" ? `Export ${filter.value}` : `Export Ward ${filter.value}`;
  return <button type="button" onClick={handleExport} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"><Download size={18}/><span>{loading ? "Exporting..." : label}</span>{!loading && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{count}</span>}</button>;
}
