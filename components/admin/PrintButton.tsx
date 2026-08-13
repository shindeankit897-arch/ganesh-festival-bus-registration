"use client";

import type { DashboardFilter } from "./DashboardCards";

type Props = {
  filter: DashboardFilter;
};

export default function PrintButton({ filter }: Props) {
  const handlePrint = () => {
    window.print();
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
      onClick={handlePrint}
      className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
    >
      🖨 Print {label}
    </button>
  );
}
