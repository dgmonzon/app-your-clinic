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
import { CLINICS, buildSlots, formatDay, formatTime } from "@/lib/clinics-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mis clínicas · Vitalis Agenda de Citas" },
      {
        name: "description",
        content:
          "Consultá tus clínicas preferidas, revisá los horarios disponibles y reservá tu cita médica en segundos.",
      },
      { property: "og:title", content: "Mis clínicas · Vitalis Agenda de Citas" },
      {
        property: "og:description",
        content: "Clínicas preferidas, horarios disponibles y reserva de citas en un solo lugar.",
      },
    ],
  }),
  component: MyCustomers,
});

function MyCustomers() {
  const { favorites, appointments, bookAppointment } = useAppStore();
  const [filter, setFilter] = useState<LocationFilter>(EMPTY_FILTER);
  const [openClinic, setOpenClinic] = useState<string | null>(null);

  const clinics = useMemo(
    () => filterClinics(CLINICS.filter((c) => favorites.includes(c.id)), filter),
    [favorites, filter],
  );

  const bookedSlotIds = appointments.map((a) => a.slotId);

  return (
    <PageShell
      eyebrow="My Customers"
      title="Tus clínicas preferidas"
      subtitle="Elegí una clínica y reservá una fecha del horario disponible."
    >
      <LocationFilters value={filter} onChange={setFilter} />

      <div className="mt-6 space-y-4">
        {clinics.length === 0 && (
          <p className="rounded-2xl bg-surface p-6 text-sm text-ink/50 ring-1 ring-ink/10">
            No hay clínicas preferidas con estos filtros. Marcá clínicas de interés en Add
            Customers.
          </p>
        )}

        {clinics.map((clinic) => {
          const open = openClinic === clinic.id;
          const slots = buildSlots(clinic);
          const days = Array.from(new Set(slots.map((s) => s.datetime.slice(0, 10))));
          return (
            <article key={clinic.id} className="rounded-2xl bg-surface p-5 ring-1 ring-ink/10">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                <div className="md:col-span-3 flex items-center gap-4">
                  <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-sand">
                    <span className="font-mono text-lg font-semibold text-brand">
                      {clinic.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-ink/40">{clinic.estado}</p>
                    <span className="mt-1 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                      Preferida
                    </span>
                  </div>
                </div>
                <div className="md:col-span-5 md:border-l md:border-dashed md:border-ink/10 md:pl-5">
                  <h3 className="text-lg font-semibold">{clinic.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">
                    {clinic.doctors.map((d) => d.name).join(" · ")}
                  </p>
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
                    onClick={() => setOpenClinic(open ? null : clinic.id)}
                    className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-mist hover:bg-brand-strong"
                  >
                    {open ? "Cerrar horarios" : "Tomar cita"}
                  </button>
                </div>
              </div>

              {open && (
                <div className="mt-5 border-t border-dashed border-ink/10 pt-5">
                  <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] tracking-wider text-ink/45 uppercase">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-brand" />
                      Disponible
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-ink/25" />
                      No disponible
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-accent-warm" />
                      Reservada por vos
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    {days.map((day) => {
                      const daySlots = slots.filter((s) => s.datetime.slice(0, 10) === day);
                      return (
                        <div key={day}>
                          <p className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
                            {formatDay(daySlots[0].datetime)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {daySlots.map((slot) => {
                              const booked = bookedSlotIds.includes(slot.id);
                              if (booked)
                                return (
                                  <span
                                    key={slot.id}
                                    title={slot.doctors.join(", ")}
                                    className="rounded-full bg-accent-warm px-3 py-1.5 text-xs font-medium text-mist"
                                  >
                                    {formatTime(slot.datetime)}
                                  </span>
                                );
                              if (!slot.available)
                                return (
                                  <span
                                    key={slot.id}
                                    className="rounded-full bg-sand px-3 py-1.5 text-xs font-medium text-ink/35 line-through"
                                  >
                                    {formatTime(slot.datetime)}
                                  </span>
                                );
                              return (
                                <button
                                  key={slot.id}
                                  title={slot.doctors.join(", ")}
                                  onClick={() =>
                                    bookAppointment({
                                      clinicId: clinic.id,
                                      slotId: slot.id,
                                      datetime: slot.datetime,
                                      doctors: slot.doctors,
                                    })
                                  }
                                  className="rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-mist hover:bg-brand-strong"
                                >
                                  {formatTime(slot.datetime)}
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-1.5 text-xs text-ink/45">
                            {Array.from(new Set(daySlots.flatMap((s) => s.doctors))).join(" · ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
