import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import {
  EMPTY_FILTER,
  LocationFilters,
  filterClinics,
  type LocationFilter,
} from "@/components/LocationFilters";
import { useAppStore } from "@/lib/app-store";
import { CLINICS } from "@/lib/clinics-data";

export const Route = createFileRoute("/add-customers")({
  head: () => ({
    meta: [
      { title: "Agregar clínicas · Vitalis Agenda de Citas" },
      {
        name: "description",
        content:
          "Explorá todas las clínicas del sistema, mirá sus doctores y marcá las que te interesan como preferidas.",
      },
      { property: "og:title", content: "Agregar clínicas · Vitalis Agenda de Citas" },
      {
        property: "og:description",
        content: "Todas las clínicas, sus doctores y su ubicación, con marcado de preferidas.",
      },
    ],
  }),
  component: AddCustomers,
});

function AddCustomers() {
  const { favorites, toggleFavorite } = useAppStore();
  const [filter, setFilter] = useState<LocationFilter>(EMPTY_FILTER);

  const clinics = useMemo(() => filterClinics(CLINICS, filter), [filter]);
  const ordered = useMemo(
    () =>
      [...clinics].sort(
        (a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)),
      ),
    [clinics, favorites],
  );

  return (
    <PageShell
      eyebrow="Add Customers"
      title="Todas las clínicas"
      subtitle="Marcá o desmarcá las clínicas que querés tener como preferidas."
    >
      <LocationFilters value={filter} onChange={setFilter} />

      <div className="mt-6 space-y-4">
        {ordered.length === 0 && (
          <p className="rounded-2xl bg-surface p-6 text-sm text-ink/50 ring-1 ring-ink/10">
            No hay clínicas con estos filtros.
          </p>
        )}
        {ordered.map((clinic) => {
          const fav = favorites.includes(clinic.id);
          return (
            <article
              key={clinic.id}
              className={`grid grid-cols-1 gap-5 rounded-2xl bg-surface p-5 md:grid-cols-12 ${
                fav ? "ring-2 ring-brand" : "ring-1 ring-ink/10"
              }`}
            >
              <div className="md:col-span-3 flex items-center gap-4">
                <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-sand">
                  <span className="font-mono text-lg font-semibold text-brand">
                    {clinic.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-mono text-xs text-ink/40">{clinic.estado}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      fav ? "bg-brand/10 text-brand" : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {fav ? "Preferida" : "Sin marcar"}
                  </span>
                </div>
              </div>
              <div className="md:col-span-5 md:border-l md:border-dashed md:border-ink/10 md:pl-5">
                <h3 className="text-lg font-semibold">{clinic.name}</h3>
                <ul className="mt-1 space-y-0.5 text-sm text-ink/60">
                  {clinic.doctors.map((d) => (
                    <li key={d.name}>
                      <span className="text-ink">{d.name}</span> · {d.specialty}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink/45">
                  <span>
                    {clinic.address}, {clinic.suburbio}
                  </span>
                  <span>{clinic.phone}</span>
                  <span>Bloque {clinic.bloque}</span>
                </div>
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 md:flex-col md:items-end md:gap-1.5">
                <button
                  onClick={() => toggleFavorite(clinic.id)}
                  className={
                    fav
                      ? "rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-sand"
                      : "rounded-lg bg-brand px-4 py-2 text-sm font-medium text-mist hover:bg-brand-strong"
                  }
                >
                  {fav ? "Quitar de preferidas" : "Marcar como preferida"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
