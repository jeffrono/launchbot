"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/cn";
import { Users, LayoutGrid, Settings, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Customers", icon: Users },
  { href: "/admin/modules", label: "Modules", icon: LayoutGrid },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!session && pathname !== "/admin/login") {
    redirect("/admin/login");
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Launch Bot</h1>
          <p className="text-xs text-gray-400">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminNav>{children}</AdminNav>
    </SessionProvider>
  );
}
