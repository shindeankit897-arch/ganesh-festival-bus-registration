"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, X, Printer, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SearchBar from "./SearchBar";

type Passenger = {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  aadhaar: string;
  voter_id: string | null;
  address: string;
  destination: string;
  ward: string;
  created_at: string;
};

export default function PassengerTable() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);

  async function loadPassengers() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("passengers")
      .select("id,name,mobile,dob,aadhaar,voter_id,address,destination,ward,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Passenger fetch error:", error);
      setPassengers([]);
      setErrorMessage(error.message);
    } else {
      setPassengers((data ?? []) as Passenger[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPassengers();
  }, []);

  const filteredPassengers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return passengers;

    return passengers.filter((passenger) =>
      [
        passenger.name,
        passenger.mobile,
        passenger.aadhaar,
        passenger.voter_id ?? "",
        passenger.destination,
        passenger.ward,
        passenger.address,
      ].some((value) => value.toLowerCase().includes(keyword))
    );
  }, [passengers, search]);

  const formatDate = (value: string) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="rounded-xl bg-white shadow-lg">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-orange-600">Passenger Management</h2>
          <p className="text-sm text-gray-500">
            {passengers.length} passenger{passengers.length === 1 ? "" : "s"} registered
          </p>
        </div>

        <button
          type="button"
          onClick={loadPassengers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="p-5">
        <SearchBar value={search} onChange={setSearch} />

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Unable to load passengers.</strong>
            <p className="mt-1">{errorMessage}</p>
            <p className="mt-2">
              Check the Supabase SELECT policy for the <code>passengers</code> table.
            </p>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-[900px] w-full">
            <thead className="bg-orange-100">
              <tr>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Mobile</th>
                <th className="p-4 text-left font-semibold">Destination</th>
                <th className="p-4 text-left font-semibold">Ward</th>
                <th className="p-4 text-left font-semibold">Registered</th>
                <th className="p-4 text-center font-semibold">View</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500">
                    Loading passengers from Supabase...
                  </td>
                </tr>
              ) : filteredPassengers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500">
                    {search ? "No passengers match your search." : "No passengers found."}
                  </td>
                </tr>
              ) : (
                filteredPassengers.map((passenger) => (
                  <tr key={passenger.id} className="border-b transition hover:bg-orange-50">
                    <td className="p-4 font-medium">{passenger.name}</td>
                    <td className="p-4">{passenger.mobile}</td>
                    <td className="p-4">{passenger.destination}</td>
                    <td className="p-4">{passenger.ward}</td>
                    <td className="p-4">{formatDate(passenger.created_at)}</td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        aria-label={`View ${passenger.name}`}
                        onClick={() => setSelectedPassenger(passenger)}
                        className="inline-flex rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPassenger && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedPassenger(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
              <h2 className="text-xl font-bold text-orange-600">Passenger Details</h2>
              <button
                type="button"
                onClick={() => setSelectedPassenger(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <Detail label="Full Name" value={selectedPassenger.name} />
              <Detail label="Mobile Number" value={selectedPassenger.mobile} />
              <Detail label="Date of Birth" value={selectedPassenger.dob} />
              <Detail label="Aadhaar Number" value={selectedPassenger.aadhaar} />
              <Detail label="Voter ID" value={selectedPassenger.voter_id || "NA"} />
              <Detail label="Destination" value={selectedPassenger.destination} />
              <Detail label="Ward Number" value={selectedPassenger.ward} />
              <Detail label="Registration Date" value={formatDate(selectedPassenger.created_at)} />
              <div className="sm:col-span-2">
                <p className="mb-1 text-sm text-gray-500">Full Address</p>
                <div className="rounded-lg bg-orange-50 p-4 text-sm leading-6">
                  {selectedPassenger.address}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t p-5">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                <Printer size={18} />
                Print
              </button>
              <button
                type="button"
                onClick={() => setSelectedPassenger(null)}
                className="rounded-lg bg-orange-600 px-5 py-2 text-white hover:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}
