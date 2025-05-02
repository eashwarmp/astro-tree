export function getTodayIndex() {
  const m = new Date().getMonth() + 1;
  const d = new Date().getDate();
  const cut = [321, 420, 521, 621, 723, 823, 923, 1023, 1122, 1222, 120, 219];
  const key = m * 100 + d;
  let idx = cut.findIndex((c) => key < c);
  if (idx === -1) idx = 0; // Pisces had rolled to Aries next year
  return idx;
}
