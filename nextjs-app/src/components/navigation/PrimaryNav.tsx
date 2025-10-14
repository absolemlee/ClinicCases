"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationSections } from "@/lib/data/navigation";
import clsx from "clsx";

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          ClinicCases Next
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">Modernization Pilot</h1>
        <p className="mt-2 text-sm text-slate-400">
          Route coverage follows the phased migration map in
          {" "}
          <Link href="/documentation/migration" className="font-semibold">
            documentation
          </Link>
          .
        </p>
      </div>

      <div className="space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {section.title}
            </p>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={clsx(
                        "block rounded-md px-3 py-2 text-sm font-medium transition",
                        isActive
                          ? "bg-brand-500/20 text-white shadow-inner"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <span className="block text-xs font-semibold uppercase tracking-wide text-brand-300">
                        {link.tagline}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
