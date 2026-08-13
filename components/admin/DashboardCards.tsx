"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users,
  MapPin,
  Building2,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

export type DashboardFilter =
  | { type: "all" }
  | { type: "destination"; value: string }
  | { type: "ward"; value: string }
  | { type: "today" };

type Passenger = {
  destination: string | null;
  ward: string | number | null;
  created_at: string;
};

type Props = {
  selectedFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;
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

export default function DashboardCards({
  selectedFilter,
  onFilterChange,
}: Props) {
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data, error } = await supabase
      .from("passengers")
      .select("destination, ward, created_at");

    if (error) {
      console.error(error);
      return;
    }

    setPassengers((data || []) as Passenger[]);
  }

  const destinationCards = useMemo(() => {
    const counts = new Map<string, number>();

    passengers.forEach((passenger) => {
      const destination = String(passenger.destination || "").trim();
      if (!destination) return;
      counts.set(destination, (counts.get(destination) || 0) + 1);
    });

    return Array.from(counts.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [passengers]);

  const wardCards = useMemo(() => {
    const counts = new Map<string, number>();

    passengers.forEach((passenger) => {
      const ward = String(passenger.ward || "").trim();
      if (!ward) return;
      counts.set(ward, (counts.get(ward) || 0) + 1);
    });

    return Array.from(counts.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], undefined, { numeric: true })
    );
  }, [passengers]);

  const todayCount = useMemo(
    () => passengers.filter((passenger) => isToday(passenger.created_at)).length,
    [passengers]
  );

  const isSelected = (filter: DashboardFilter) =>
    selectedFilter.type === filter.type &&
    (filter.type === "all" || filter.type === "today"
      ? true
      : selectedFilter.type === filter.type &&
        selectedFilter.value === filter.value);

  const cardBase =
    "w-full min-w-0 rounded-xl border-2 bg-white p-4 text-left shadow transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer sm:p-5";

  return (
    <div className="space-y-8">
      {/* Main cards */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => onFilterChange({ type: "all" })}
          className={`${cardBase} text-left ${
            isSelected({ type: "all" })
              ? "border-orange-500 ring-2 ring-orange-100"
              : "border-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Passengers</p>
              <h2 className="mt-2 text-4xl font-bold text-orange-600">
                {passengers.length}
              </h2>
              <p className="mt-1 text-xs text-gray-400">Show all passengers</p>
            </div>
            <div className="rounded-full bg-orange-100 p-4">
              <Users size={30} className="text-orange-600" />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange({ type: "today" })}
          className={`${cardBase} text-left ${
            isSelected({ type: "today" })
              ? "border-orange-500 ring-2 ring-orange-100"
              : "border-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Today's Registrations</p>
              <h2 className="mt-2 text-4xl font-bold text-orange-600">
                {todayCount}
              </h2>
              <p className="mt-1 text-xs text-gray-400">Registered today</p>
            </div>
            <div className="rounded-full bg-orange-100 p-4">
              <CalendarDays size={30} className="text-orange-600" />
            </div>
          </div>
        </button>

        <div className="rounded-xl bg-white p-5 shadow border-2 border-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Destinations</p>
              <h2 className="mt-2 text-4xl font-bold text-orange-600">
                {destinationCards.length}
              </h2>
              <p className="mt-1 text-xs text-gray-400">Click below to filter</p>
            </div>
            <div className="rounded-full bg-orange-100 p-4">
              <MapPin size={30} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow border-2 border-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Wards</p>
              <h2 className="mt-2 text-4xl font-bold text-orange-600">
                {wardCards.length}
              </h2>
              <p className="mt-1 text-xs text-gray-400">Click below to filter</p>
            </div>
            <div className="rounded-full bg-orange-100 p-4">
              <Building2 size={30} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Destination cards */}
      {destinationCards.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <MapPin size={20} className="text-orange-600" />
            <h3 className="text-xl font-bold text-orange-700">
              Passengers by Destination
            </h3>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {destinationCards.map(([destination, count]) => {
              const filter: DashboardFilter = {
                type: "destination",
                value: destination,
              };

              return (
                <button
                  type="button"
                  key={destination}
                  onClick={() => onFilterChange(filter)}
                  className={`${cardBase} text-left ${
                    isSelected(filter)
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold uppercase text-gray-700">
                        {destination}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Passengers</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-orange-100 px-4 py-2 text-xl font-bold text-orange-600">
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Ward cards */}
      {wardCards.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Building2 size={20} className="text-orange-600" />
            <h3 className="text-xl font-bold text-orange-700">
              Passengers by Ward
            </h3>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {wardCards.map(([ward, count]) => {
              const filter: DashboardFilter = { type: "ward", value: ward };

              return (
                <button
                  type="button"
                  key={ward}
                  onClick={() => onFilterChange(filter)}
                  className={`${cardBase} text-left ${
                    isSelected(filter)
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-700">Ward {ward}</p>
                      <p className="mt-1 text-sm text-gray-500">Passengers</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-orange-100 px-4 py-2 text-xl font-bold text-orange-600">
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Current selection */}
      <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm sm:p-4">
        <CheckCircle2 size={18} className="text-orange-600" />
        <span className="font-semibold text-gray-700">Current filter:</span>
        <span className="max-w-full break-words rounded-full bg-white px-3 py-1 font-semibold text-orange-700 shadow-sm">
          {selectedFilter.type === "all"
            ? "All Passengers"
            : selectedFilter.type === "today"
            ? "Today's Registrations"
            : selectedFilter.type === "destination"
            ? `Destination: ${selectedFilter.value}`
            : `Ward: ${selectedFilter.value}`}
        </span>
      </div>
    </div>
  );
}
