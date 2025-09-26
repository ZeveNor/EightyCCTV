import type { MutableRefObject, Dispatch, SetStateAction } from "react";

export function getSlotData(
  URL: string,
  mountedRef: MutableRefObject<boolean>,
  setOccupied: Dispatch<SetStateAction<Set<string>>>,
  setLayout?: Dispatch<SetStateAction<{ rows: string[]; cols: number[] }>>
) {
  // return an async function that performs a single fetch/update cycle
  return async function poll() {
    try {
      const res = await fetch(URL, { cache: "no-store" });
      // Use debug logging for status to avoid printing the full Response object
      // which can appear as a pending Promise in DevTools and spam the console
      console.debug(`[getSlotData] fetched ${URL} status=${res.status}`);

      if (!res.ok) return;
      const json = await res.json();
      const data: Array<{
        id: number;
        slot_name: string;
        is_parked: boolean;
      }> = json.result || [];

      if (!mountedRef.current) return;

      // compute occupied ids
      const occupiedIds = data
        .filter((s) => Boolean(s.is_parked))
        .map((s) => s.slot_name);
      setOccupied(new Set(occupiedIds));

      // compute layout: unique rows and numeric cols (from slot_name)
      if (setLayout) {
        const rowsSet = new Set<string>();
        const colsSet = new Set<number>();
        data.forEach((s) => {
          const match = s.slot_name.match(/^([A-Z]+)(\d+)$/);
          if (match) {
            rowsSet.add(match[1]);
            colsSet.add(parseInt(match[2], 10));
          }
        });
        const rows = Array.from(rowsSet).sort();
        const cols = Array.from(colsSet).sort((a, b) => a - b);
        setLayout({ rows, cols });
      }
    } catch (e) {
      // ignore polling errors
    }
  };
}

export default {
  getSlotData,
}