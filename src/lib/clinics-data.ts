export type Doctor = {
  name: string;
  specialty: string;
};

export type Clinic = {
  id: string;
  name: string;
  address: string;
  phone: string;
  estado: string;
  bloque: string;
  suburbio: string;
  doctors: Doctor[];
};

export type Slot = {
  id: string;
  clinicId: string;
  /** ISO date-time string */
  datetime: string;
  available: boolean;
  doctors: string[];
};

export const CLINICS: Clinic[] = [
  {
    id: "c1",
    name: "Clínica Vida Norte",
    address: "Av. Reforma 420",
    phone: "33 2190 4487",
    estado: "Jalisco",
    bloque: "Centro",
    suburbio: "Zapopan",
    doctors: [
      { name: "Dra. Sofía Marín", specialty: "Medicina general" },
      { name: "Dr. Aldo Rentería", specialty: "Cardiología" },
    ],
  },
  {
    id: "c2",
    name: "Centro Médico Andino",
    address: "Calle Roble 88",
    phone: "33 3921 7740",
    estado: "Jalisco",
    bloque: "Centro",
    suburbio: "Americana",
    doctors: [
      { name: "Dr. Mateo Salas", specialty: "Traumatología" },
      { name: "Dra. Marta Iglesias", specialty: "Dermatología" },
    ],
  },
  {
    id: "c3",
    name: "Fisioterapia Lumbar",
    address: "Blvd. Las Hadas 1120",
    phone: "33 2504 1198",
    estado: "Jalisco",
    bloque: "Norte",
    suburbio: "Chapalita",
    doctors: [{ name: "Dra. Lucía Ferreira", specialty: "Fisioterapia" }],
  },
  {
    id: "c4",
    name: "Consultorio La Torre",
    address: "Av. Pío IX 41",
    phone: "33 4110 2233",
    estado: "Jalisco",
    bloque: "Norte",
    suburbio: "Belén",
    doctors: [
      { name: "Dr. Bruno Salas", specialty: "Pediatría" },
      { name: "Dra. Elena Ochoa", specialty: "Medicina interna" },
    ],
  },
  {
    id: "c5",
    name: "Instituto Cardíaco Morelia",
    address: "Av. Hidalgo 1204",
    phone: "443 118 2290",
    estado: "Michoacán",
    bloque: "Central",
    suburbio: "Santa María",
    doctors: [
      { name: "Dra. Rocío Valdez", specialty: "Cardiología" },
      { name: "Dr. Pablo Miranda", specialty: "Nutrición" },
    ],
  },
  {
    id: "c6",
    name: "Medicina Familiar Sur",
    address: "Calle Morelos 88",
    phone: "443 302 6611",
    estado: "Michoacán",
    bloque: "Sur",
    suburbio: "Las Camelias",
    doctors: [{ name: "Dr. Julio Gaona", specialty: "Medicina familiar" }],
  },
  {
    id: "c7",
    name: "Clínica Bahía Salud",
    address: "Paseo del Mar 15",
    phone: "322 771 0044",
    estado: "Nayarit",
    bloque: "Costa",
    suburbio: "Bucerías",
    doctors: [
      { name: "Dra. Teresa Ruvalcaba", specialty: "Ginecología" },
      { name: "Dr. Iván Prado", specialty: "Medicina general" },
    ],
  },
  {
    id: "c8",
    name: "Centro Integral Riviera",
    address: "Av. Palmar 302",
    phone: "322 640 9912",
    estado: "Nayarit",
    bloque: "Costa",
    suburbio: "Sayulita",
    doctors: [{ name: "Dra. Noelia Prieto", specialty: "Oftalmología" }],
  },
];

const HOURS = ["09:00", "09:30", "10:30", "11:00", "13:00", "15:00", "16:30"];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Deterministic pseudo-random so slots are stable between server and client. */
function seeded(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return h / 997;
}

export function buildSlots(clinic: Clinic): Slot[] {
  const base = startOfToday();
  const slots: Slot[] = [];
  for (let day = 1; day <= 6; day++) {
    const date = new Date(base);
    date.setDate(base.getDate() + day);
    for (const hour of HOURS) {
      const [h, m] = hour.split(":").map(Number);
      const dt = new Date(date);
      dt.setHours(h, m, 0, 0);
      const key = `${clinic.id}-${day}-${hour}`;
      const r = seeded(key);
      if (r < 0.2) continue;
      const doctors =
        clinic.doctors.length > 1 && r > 0.6
          ? [clinic.doctors[0].name]
          : clinic.doctors.map((d) => d.name);
      slots.push({
        id: key,
        clinicId: clinic.id,
        datetime: dt.toISOString(),
        available: r > 0.45,
        doctors,
      });
    }
  }
  return slots.sort((a, b) => a.datetime.localeCompare(b.datetime));
}

export const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const MONTH_NAMES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function formatDay(iso: string) {
  const d = new Date(iso);
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
