import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CLINICS } from "./clinics-data";

export type Appointment = {
  id: string;
  clinicId: string;
  slotId: string;
  datetime: string;
  doctors: string[];
};

type Store = {
  favorites: string[];
  toggleFavorite: (clinicId: string) => void;
  appointments: Appointment[];
  bookAppointment: (a: Omit<Appointment, "id">) => void;
  cancelAppointment: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

const DEFAULT_FAVORITES = [CLINICS[0].id, CLINICS[1].id, CLINICS[4].id];
const KEY = "vitalis-store-v1";

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(DEFAULT_FAVORITES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        favorites?: string[];
        appointments?: Appointment[];
      };
      if (parsed.favorites) setFavorites(parsed.favorites);
      if (parsed.appointments) setAppointments(parsed.appointments);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ favorites, appointments }));
    } catch {
      /* ignore */
    }
  }, [favorites, appointments]);

  const toggleFavorite = useCallback((clinicId: string) => {
    setFavorites((prev) =>
      prev.includes(clinicId) ? prev.filter((id) => id !== clinicId) : [...prev, clinicId],
    );
  }, []);

  const bookAppointment = useCallback((a: Omit<Appointment, "id">) => {
    setAppointments((prev) =>
      prev.some((p) => p.slotId === a.slotId)
        ? prev
        : [...prev, { ...a, id: `${a.slotId}-${prev.length}` }],
    );
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, appointments, bookAppointment, cancelAppointment }),
    [favorites, appointments, toggleFavorite, bookAppointment, cancelAppointment],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
