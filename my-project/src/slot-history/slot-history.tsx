"use client";

import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect } from "react";
import { getHistory } from "@/api/slot/slothistory";

export default function SlotHistory() {
  useEffect(() => {
    let grid: Grid | null = null;

    const fetchData = async () => {
      const data = await getHistory();

      const container = document.getElementById("slot-history-table");
      if (container) container.innerHTML = "";

      grid = new Grid({
        columns: [ "Time","Slot Name", "Status"],
        data: data.map(
          (item: {
            changed_at: string;
            slot_name: string;
            is_parked: boolean;
          }) => [
            new Date(item.changed_at).toLocaleString(),
            item.slot_name,
            item.is_parked ? "Yes" : "No",
          ]
        ),
        style: {
          table: {
            'font-size': '13px'
          }
        },
        pagination: {
          limit: 6,
          summary: false
        },
        search: true,
        sort: true,
        resizable: true
      });

      grid.render(container!);
    };

    fetchData();

    return () => {
      if (grid) {
        grid.destroy();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Slot History</h2>
      <div id="slot-history-table"></div>
    </div>
  );
}
