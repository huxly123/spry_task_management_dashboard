"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "All Tasks" },
  { href: "/completed", label: "Completed Tasks" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 rounded-xl bg-slate-100 p-1"
      aria-label="Task views"
    >
      {links.map(({ href, label }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-medium transition sm:flex-none sm:px-6 ${
              isActive
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
