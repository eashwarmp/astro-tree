import { useMemo } from "react";
import { useMatch, useSearchParams } from "react-router-dom";
import type { Sign } from "../data/signs";
import { signById, signForDate } from "../lib/zodiac";

/** The sign in the URL (`/card/:sign` or `/?sign=`), falling back to today's. */
export function useActiveSign(): Sign {
  const card = useMatch("/card/:sign");
  const [params] = useSearchParams();
  const id = card?.params.sign ?? params.get("sign");
  return useMemo(() => signById(id) ?? signForDate(new Date()), [id]);
}
