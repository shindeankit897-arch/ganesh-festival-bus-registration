"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SearchBar from "./SearchBar";
import type { DashboardFilter } from "./DashboardCards";

type Passenger = {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  aadhaar: string;
  voter_id: string;
  address: string;
  destination: string;
  ward: string;
  created_at: string;
};

type Props = {
  filter?: DashboardFilter;
};

function isToday(dateString: string) {
  return (
    new Date(dateString).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    }) ===
    new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    })
  );
}

function filterPassengers(passengers: Passenger[], filter: DashboardFilter) {
  if (filter.type === "all") return passengers;

  if (filter.type === "today") {
    return passengers.filter((p) => isToday(p.created_at));
  }

  if (filter.type === "destination") {
    return passengers.filter(
      (p) => String(p.destination).toLowerCase() === filter.value.toLowerCase()
    );
  }

  return passengers.filter(
    (p) => String(p.ward).toLowerCase() === filter.value.toLowerCase()
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PassengerTable({ filter = { type: "all" } }: Props) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedPassenger, setSelectedPassenger] =
    useState<Passenger | null>(null);

  useEffect(() => {
    loadPassengers();
  }, []);

  async function loadPassengers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("passengers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPassengers((data || []) as Passenger[]);
    }

    setLoading(false);
  }

  const filteredPassengers = useMemo(() => {
    const scopedPassengers = filterPassengers(passengers, filter);
    const keyword = search.toLowerCase().trim();

    if (!keyword) return scopedPassengers;

    return scopedPassengers.filter((p) => {
      return (
        String(p.name).toLowerCase().includes(keyword) ||
        String(p.mobile).includes(search) ||
        String(p.destination).toLowerCase().includes(keyword) ||
        String(p.ward).toLowerCase().includes(keyword) ||
        String(p.aadhaar).includes(search) ||
        String(p.voter_id || "").toLowerCase().includes(keyword) ||
        String(p.address || "").toLowerCase().includes(keyword)
      );
    });
  }, [passengers, search, filter]);

  const filterLabel =
    filter.type === "all"
      ? "All registered passengers"
      : filter.type === "today"
      ? "Today's registrations"
      : filter.type === "destination"
      ? `Destination: ${filter.value}`
      : `Ward: ${filter.value}`;

  return (
    <div className="print-area w-full min-w-0 overflow-hidden rounded-xl bg-white shadow">
      <div className="flex min-w-0 flex-col gap-4 border-b p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-orange-600 sm:text-2xl">
            Passenger Management
          </h2>
          <p className="mt-1 break-words text-sm text-gray-500 sm:text-base">
            {filterLabel}
          </p>
          <p className="mt-1 text-sm font-medium text-orange-600">
            {filteredPassengers.length} passenger
            {filteredPassengers.length === 1 ? "" : "s"} shown
          </p>
        </div>

        <button
          type="button"
          onClick={loadPassengers}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-orange-300 px-4 py-2.5 text-orange-600 hover:bg-orange-50 md:w-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="min-w-0 p-4 sm:p-5">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading passengers...</div>
      ) : filteredPassengers.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No passengers found for this filter.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden w-full md:block">
            <table className="w-full table-fixed">
              <thead className="bg-orange-100">
                <tr>
                  <th className="w-[28%] p-4 text-left font-semibold">Name</th>
                  <th className="w-[16%] p-4 text-left font-semibold">Mobile</th>
                  <th className="w-[18%] p-4 text-left font-semibold">Destination</th>
                  <th className="w-[10%] p-4 text-left font-semibold">Ward</th>
                  <th className="w-[20%] p-4 text-left font-semibold">Registration Date</th>
                  <th className="w-[8%] p-4 text-center font-semibold">View</th>
                </tr>
              </thead>
              <tbody>
                {filteredPassengers.map((passenger) => (
                  <tr
                    key={passenger.id}
                    className="border-b transition hover:bg-orange-50"
                  >
                    <td className="break-words p-4 font-medium">{passenger.name}</td>
                    <td className="break-words p-4">{passenger.mobile}</td>
                    <td className="break-words p-4">{passenger.destination}</td>
                    <td className="p-4">{passenger.ward}</td>
                    <td className="p-4">{formatDate(passenger.created_at)}</td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        aria-label={`View ${passenger.name}`}
                        onClick={() => setSelectedPassenger(passenger)}
                        className="inline-flex rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile responsive table — same dashboard style, no horizontal scrolling */}
          <div className="w-full min-w-0 px-2 pb-4 md:hidden">
            <div className="w-full overflow-hidden rounded-lg border border-orange-100">
              <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_auto] gap-2 bg-orange-100 px-3 py-3 text-xs font-semibold text-gray-800">
                <div>Passenger</div>
                <div>Destination / Ward</div>
                <div className="text-center">View</div>
              </div>

              <div className="divide-y divide-orange-100">
                {filteredPassengers.map((passenger) => (
                  <div
                    key={passenger.id}
                    className="grid min-w-0 grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_auto] items-center gap-2 bg-white px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-gray-900">
                        {passenger.name}
                      </p>
                      <p className="mt-1 break-all text-xs text-gray-500">
                        {passenger.mobile}
                      </p>
                      <p className="mt-1 break-words text-[11px] text-gray-400">
                        {formatDate(passenger.created_at)}
                      </p>
                    </div>

                    <div className="min-w-0 text-xs">
                      <p className="break-words font-medium uppercase text-gray-800">
                        {passenger.destination}
                      </p>
                      <p className="mt-1 text-gray-500">
                        Ward {passenger.ward}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={`View ${passenger.name}`}
                      onClick={() => setSelectedPassenger(passenger)}
                      className="inline-flex shrink-0 rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedPassenger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
          <div className="my-4 w-full max-w-3xl min-w-0 overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b p-4 sm:p-6">
              <h2 className="text-xl font-bold text-orange-600 sm:text-2xl">
                Passenger Details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedPassenger(null)}
                className="shrink-0 rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">
              <div className="min-w-0"><p className="text-sm text-gray-500">Full Name</p><h3 className="break-words font-semibold">{selectedPassenger.name}</h3></div>
              <div className="min-w-0"><p className="text-sm text-gray-500">Mobile Number</p><h3 className="break-all font-semibold">{selectedPassenger.mobile}</h3></div>
              <div><p className="text-sm text-gray-500">Date of Birth</p><h3 className="font-semibold">{selectedPassenger.dob}</h3></div>
              <div className="min-w-0"><p className="text-sm text-gray-500">Aadhaar Number</p><h3 className="break-all font-semibold">{selectedPassenger.aadhaar}</h3></div>
              <div className="min-w-0"><p className="text-sm text-gray-500">Voter ID</p><h3 className="break-all font-semibold">{selectedPassenger.voter_id || "NA"}</h3></div>
              <div className="min-w-0"><p className="text-sm text-gray-500">Destination</p><h3 className="break-words font-semibold">{selectedPassenger.destination}</h3></div>
              <div><p className="text-sm text-gray-500">Ward Number</p><h3 className="font-semibold">{selectedPassenger.ward}</h3></div>
              <div className="min-w-0"><p className="text-sm text-gray-500">Registration Date</p><h3 className="break-words font-semibold">{new Date(selectedPassenger.created_at).toLocaleString("en-IN")}</h3></div>
            </div>

            <div className="border-t p-4 sm:p-6">
              <p className="mb-2 text-sm text-gray-500">Full Address</p>
              <div className="break-words rounded-lg bg-orange-50 p-4">
                {selectedPassenger.address}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 sm:w-auto"
              >
                🖨 Print
              </button>
              <button
                type="button"
                onClick={() => setSelectedPassenger(null)}
                className="w-full rounded-lg bg-orange-600 px-5 py-2.5 text-white hover:bg-orange-700 sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
