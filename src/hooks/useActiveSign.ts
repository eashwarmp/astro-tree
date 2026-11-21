import { useMemo } from "react";
import { useMatch, useSearchParams } from "react-router-dom";
import type { Sign } from "../data/signs";
import { signById, sunSign } from "../lib/zodiac";
import { useMySign } from "./useMySign";

/** The sign in the URL (`/card/:sign`, `/tarot/:sign` or `/?sign=`), else the reader's own, else the Sun's today. */
export function useActiveSign(): Sign {
  const card = useMatch("/card/:sign");
  const gate = useMatch("/tarot/:sign");
  const [params] = useSearchParams();
  const id = card?.params.sign ?? gate?.params.sign ?? params.get("sign");
  const [mine] = useMySign();
  return useMemo(() => signById(id) ?? signById(mine) ?? sunSign(new Date()), [id, mine]);
}
