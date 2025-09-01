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
      if (!res.ok) return;
      const data: Array<{
        id: number;
        slot_name: string;
        is_parked: boolean;
        slot_rows_name?: string;
      }> = await res.json();
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
        for (const s of data) {
          if (s.slot_rows_name) rowsSet.add(s.slot_rows_name);
          const m = String(s.slot_name).match(/\d+/);
          if (m) colsSet.add(parseInt(m[0], 10));
        }
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