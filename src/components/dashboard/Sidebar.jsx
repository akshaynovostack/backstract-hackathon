"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Users,
  Settings,
  ChevronDown,
  Plus,
  Home,
  User,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const workspaceId = "123"; // This should come from your workspace context/store

  const navigation = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Board View",
      href: `/dashboard/${workspaceId}/board`,
      icon: LayoutDashboard,
    },
    {
      name: "List View",
      href: `/dashboard/${workspaceId}/list`,
      icon: ListTodo,
    },
    {
      name: "Teams",
      href: `/dashboard/${workspaceId}/teams`,
      icon: Users,
    },
    {
      name: "Users",
      href: `/dashboard/${workspaceId}/users`,
      icon: User,
    },
    {
      name: "Settings",
      href: `/dashboard/${workspaceId}/settings`,
      icon: Settings,
    },
  ];

  const isActive = (path) => pathname === path;

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Dijkstra Dynamos</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
}
