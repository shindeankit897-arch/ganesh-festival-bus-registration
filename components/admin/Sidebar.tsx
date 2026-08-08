"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Printer,
  LogOut,
  BusFront,
  X,
} from "lucide-react";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Passengers",
      href: "/admin/passengers",
      icon: Users,
    },
    {
      title: "Export Excel",
      href: "/admin/dashboard",
      icon: FileSpreadsheet,
    },
    {
      title: "Print",
      href: "/admin/dashboard",
      icon: Printer,
    },
  ];

  function logout() {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  }

  return (
    <>
      {/* Mobile Overlay */}

      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-orange-600 text-white shadow-xl transition-transform duration-300

        ${open ? "translate-x-0" : "-translate-x-full"}

        lg:static lg:translate-x-0`}
      >
        {/* Logo */}

        <div className="flex items-center justify-between border-b border-orange-500 p-6">

          <div className="flex items-center gap-3">

            <BusFront size={36} />

            <div>

              <h2 className="text-xl font-bold">
                Bus Management
              </h2>

              <p className="text-sm text-orange-100">
                Admin Panel
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="lg:hidden"
          >
            <X size={24} />
          </button>

        </div>

        {/* Menu */}

        <nav className="mt-6 flex-1 px-4">
	          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className={`mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  pathname === item.href
                    ? "bg-white text-orange-600 font-semibold"
                    : "hover:bg-orange-500"
                }`}
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}

        <div className="border-t border-orange-500 p-4">

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-3 font-semibold transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}