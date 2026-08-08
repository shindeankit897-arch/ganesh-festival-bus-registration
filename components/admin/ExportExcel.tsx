"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "@/lib/supabase";

export default function ExportExcel() {

  const exportExcel = async () => {

    const { data, error } = await supabase
      .from("passengers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    const excelData = data.map((item: any, index: number) => ({
      "Sr No": index + 1,
      "Name": item.name,
      "Mobile Number": item.mobile,
      "Date of Birth": item.dob,
      "Aadhaar Number": item.aadhaar,
      "Voter ID": item.voter_id,
      "Full Address": item.address,
      "Destination": item.destination,
      "Ward Number": item.ward,
      "Registration Date": new Date(
        item.created_at
      ).toLocaleString("en-IN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Passengers"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    const today = new Date().toLocaleDateString("en-IN");

    saveAs(file, `Ganesh_Bus_Registration_${today}.xlsx`);
  };

  return (

    <button
      onClick={exportExcel}
      className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
    >
      📥 Export Excel
    </button>

  );

}