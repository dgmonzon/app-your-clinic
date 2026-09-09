import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "My Customers" },
  { to: "/add-customers", label: "Add Customers" },
  { to: "/appointments", label: "My Appointments" },
] as const;

export function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mist font-sans text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-ink/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-brand text-lg font-bold text-mist">
              V
            </div>
            <div>
              <p className="text-sm leading-none font-semibold">Vitalis</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
                Clinic Scheduling
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-ink/50 hover:text-ink"
                activeProps={{ className: "text-brand font-medium hover:text-brand/80" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-sand font-mono text-[11px] text-ink/60">
              AR
            </div>
            <p className="hidden text-sm font-medium sm:block">Ana Ríos</p>
          </div>
        </header>

        <nav className="mt-4 flex items-center gap-5 text-sm md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-ink/50"
              activeProps={{ className: "text-brand font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 mb-5">
          <p className="font-mono text-xs tracking-[0.25em] text-accent-warm uppercase">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-ink/50">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
