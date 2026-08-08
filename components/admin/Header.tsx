"use client";

import { Menu, LogOut, UserCircle2, BusFront } from "lucide-react";
import { useRouter } from "next/navigation";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 border-b bg-white shadow-sm">

      <div className="flex items-center justify-between px-6 py-4">

        {/* Left */}

        <div className="flex items-center gap-4">

          {/* Mobile Menu */}

          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">

            <BusFront className="text-orange-600" size={34} />

            <div>

              <h1 className="text-xl font-bold text-orange-600">
                Ganesh Festival Bus Management
              </h1>

              <p className="text-sm text-gray-500">
                Admin Dashboard
              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          <div className="hidden text-right md:block">

            <p className="text-sm text-gray-500">
              {today}
            </p>

            <p className="font-semibold">
              Welcome, Admin
            </p>

          </div>

          <UserCircle2
            size={38}
            className="text-orange-600"
          />

          <button
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 md:flex"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}