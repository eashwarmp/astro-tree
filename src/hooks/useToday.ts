import { useEffect, useState } from "react";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Today's date (local midnight), updating on its own when the clock passes midnight. */
export function useToday(): Date {
  const [today, setToday] = useState(() => startOfDay(new Date()));

  useEffect(() => {
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const t = setTimeout(() => setToday(startOfDay(new Date())), tomorrow.getTime() - Date.now() + 1000);
    return () => clearTimeout(t);
  }, [today]);

  return today;
}
