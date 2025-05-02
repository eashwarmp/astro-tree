export async function getDailyHoroscope(sign: string) {
  // Aztro expects a POST with ?sign=&day= params
  const res = await fetch(
    `https://aztro.sameerkumar.website/?sign=${sign.toLowerCase()}&day=today`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Horoscope API error");
  // → { date_range, description, compatibility, lucky_number, ... }
  const data = await res.json();
  return data.description as string;
}
