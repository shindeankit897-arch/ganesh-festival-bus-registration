"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, MapPin, Building2, CalendarDays } from "lucide-react";

export default function DashboardCards() {
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [totalWards, setTotalWards] = useState(0);
  const [todayRegistrations, setTodayRegistrations] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data, error } = await supabase
      .from("passengers")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setTotalPassengers(data.length);

    const destinations = [...new Set(data.map((p: any) => p.destination))];
    setTotalDestinations(destinations.length);

    const wards = [...new Set(data.map((p: any) => p.ward))];
    setTotalWards(wards.length);

    const today = new Date().toISOString().split("T")[0];

    const todayCount = data.filter((p: any) =>
      p.created_at.startsWith(today)
    ).length;

    setTodayRegistrations(todayCount);
  }

  const cards = [
    {
      title: "Total Passengers",
      value: totalPassengers,
      icon: Users,
    },
    {
      title: "Destinations",
      value: totalDestinations,
      icon: MapPin,
    },
    {
      title: "Wards",
      value: totalWards,
      icon: Building2,
    },
    {
      title: "Today's Registrations",
      value: todayRegistrations,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500">{card.title}</p>

                <h2 className="mt-3 text-4xl font-bold text-orange-600">
                  {card.value}
                </h2>
              </div>

              <div className="rounded-full bg-orange-100 p-4">
                <Icon
                  size={30}
                  className="text-orange-600"
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}