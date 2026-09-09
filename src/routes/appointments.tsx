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
import { CLINICS, DAY_NAMES, MONTH_NAMES, formatTime } from "@/lib/clinics-data";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Mis citas · Vitalis Agenda de Citas" },
      {
        name: "description",
        content:
          "Revisá todas las citas que reservaste, con fecha, clínica, doctores y datos de contacto.",
      },
      { property: "og:title", content: "Mis citas · Vitalis Agenda de Citas" },
      {
        property: "og:description",
        content: "Todas tus citas reservadas con fecha, clínica y ubicación.",
      },
    ],
  }),
  component: MyAppointments,
});

function MyAppointments() {
  const { appointments, cancelAppointment } = useAppStore();
  const [filter, setFilter] = useState<LocationFilter>(EMPTY_FILTER);

  const visibleClinicIds = useMemo(
    () => new Set(filterClinics(CLINICS, filter).map((c) => c.id)),
    [filter],
  );

  const rows = useMemo(
    () =>
      appointments
        .filter((a) => visibleClinicIds.has(a.clinicId))
        .sort((a, b) => a.datetime.localeCompare(b.datetime)),
    [appointments, visibleClinicIds],
  );

  return (
    <PageShell
      eyebrow="My Appointments"
      title="Tus citas reservadas"
      subtitle="Seguimiento de las citas que creaste desde tus clínicas preferidas."
    >
      <LocationFilters value={filter} onChange={setFilter} />

      <div className="mt-6 space-y-4">
        {rows.length === 0 && (
          <p className="rounded-2xl bg-surface p-6 text-sm text-ink/50 ring-1 ring-ink/10">
            Todavía no tenés citas con estos filtros. Reservá una desde My Customers.
          </p>
        )}
        {rows.map((appt) => {
          const clinic = CLINICS.find((c) => c.id === appt.clinicId);
          if (!clinic) return null;
          const d = new Date(appt.datetime);
          return (
            <article
              key={appt.id}
              className="grid grid-cols-1 gap-5 rounded-2xl bg-surface p-5 ring-1 ring-ink/10 md:grid-cols-12"
            >
              <div className="md:col-span-3 flex items-center gap-4">
                <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-sand">
                  <div className="text-center">
                    <p className="font-mono text-lg leading-none font-semibold text-brand">
                      {String(d.getDate()).padStart(2, "0")}
                    </p>
                    <p className="font-mono text-[10px] tracking-widest text-ink/50 uppercase">
                      {MONTH_NAMES[d.getMonth()]}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs text-ink/40">
                    {DAY_NAMES[d.getDay()]} · {formatTime(appt.datetime)}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                    Confirmada
                  </span>
                </div>
              </div>
              <div className="md:col-span-5 md:border-l md:border-dashed md:border-ink/10 md:pl-5">
                <h3 className="text-lg font-semibold">{clinic.name}</h3>
                <p className="mt-1 text-sm text-ink/60">
                  Consulta · <span className="text-ink">{appt.doctors.join(", ")}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink/45">
                  <span>
                    {clinic.address}, {clinic.suburbio}
                  </span>
                  <span>{clinic.phone}</span>
                </div>
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 md:flex-col md:items-end md:gap-1.5">
                <div className="flex items-center gap-2 rounded-full bg-sand px-3 py-1.5 text-xs font-medium">
                  <span className="size-2 rounded-full bg-accent-warm" />
                  {clinic.estado} · {clinic.bloque}
                </div>
                <button
                  onClick={() => cancelAppointment(appt.id)}
                  className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-sand"
                >
                  Cancelar cita
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
