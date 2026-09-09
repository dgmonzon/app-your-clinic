import { CLINICS, type Clinic } from "@/lib/clinics-data";

export type LocationFilter = {
  estado: string;
  bloque: string;
  suburbio: string;
};

export const EMPTY_FILTER: LocationFilter = { estado: "", bloque: "", suburbio: "" };

export function filterClinics(clinics: Clinic[], f: LocationFilter) {
  return clinics.filter(
    (c) =>
      (!f.estado || c.estado === f.estado) &&
      (!f.bloque || c.bloque === f.bloque) &&
      (!f.suburbio || c.suburbio === f.suburbio),
  );
}

function uniq(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function LocationFilters({
  value,
  onChange,
}: {
  value: LocationFilter;
  onChange: (f: LocationFilter) => void;
}) {
  const estados = uniq(CLINICS.map((c) => c.estado));
  const bloques = uniq(
    CLINICS.filter((c) => !value.estado || c.estado === value.estado).map((c) => c.bloque),
  );
  const suburbios = uniq(
    CLINICS.filter(
      (c) =>
        (!value.estado || c.estado === value.estado) &&
        (!value.bloque || c.bloque === value.bloque),
    ).map((c) => c.suburbio),
  );

  const select =
    "mt-1 w-full appearance-none rounded-lg border border-ink/15 bg-surface px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none";
  const label = "font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40";

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[180px] flex-1">
        <label className={label} htmlFor="f-estado">
          Estado
        </label>
        <select
          id="f-estado"
          className={select}
          value={value.estado}
          onChange={(e) => onChange({ estado: e.target.value, bloque: "", suburbio: "" })}
        >
          <option value="">Todos</option>
          {estados.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[180px] flex-1">
        <label className={label} htmlFor="f-bloque">
          Bloque
        </label>
        <select
          id="f-bloque"
          className={select}
          value={value.bloque}
          onChange={(e) => onChange({ ...value, bloque: e.target.value, suburbio: "" })}
        >
          <option value="">Todos</option>
          {bloques.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[180px] flex-1">
        <label className={label} htmlFor="f-suburbio">
          Suburbio
        </label>
        <select
          id="f-suburbio"
          className={select}
          value={value.suburbio}
          onChange={(e) => onChange({ ...value, suburbio: e.target.value })}
        >
          <option value="">Todos</option>
          {suburbios.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
