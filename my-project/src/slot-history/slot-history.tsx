"use client";

import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef, useState } from "react";
import { getHistory } from "@/api/slot/slothistory";

export default function SlotHistory() {
  const [search, setSearch] = useState("");
  const dataRef = useRef<any[]>([]);
  const gridRef = useRef<Grid | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const data = await getHistory();
      if (!mounted) return;
      dataRef.current = data;
      renderGrid();
    };

    fetchData();

    return () => {
      mounted = false;
      if (gridRef.current) {
        gridRef.current.destroy();
        gridRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!dataRef.current || dataRef.current.length === 0) return;
    renderGrid();
  }, [search]);

  const renderGrid = () => {
    const container = document.getElementById("slot-history-table");
    if (!container) return;

    if (gridRef.current) {
      try {
        gridRef.current.destroy();
      } catch (e) {
      }
      gridRef.current = null;
      container.innerHTML = "";
    }

    const filtered = dataRef.current.filter((item: any) => {
      if (!search) {
        return true;
      }
      const s = search.toLowerCase();
      return (
        new Date(item.changed_at)
          .toLocaleString()
          .toLowerCase()
          .includes(s) ||
        (item.slot_name || "")
          .toLowerCase().includes(s) ||
        (item.is_parked ? "yes" : "no")
          .includes(s)
      );
    });

    gridRef.current = new Grid({
      columns: ["Time", "Slot Name", "Status"],
      data: filtered.map((item: any) => [
        new Date(item.changed_at).toLocaleString(),
        item.slot_name,
        item.is_parked ? "Yes" : "No",
      ]),
      style: {
        table: {
          "font-size": "13px",
        },
      },
      pagination: {
        limit: 6,
        summary: false,
      },
      search: false,
      sort: true,
      resizable: true,
    });

    gridRef.current.render(container!);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Slot History</h2>
      <div className="mb-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type a keyword..."
          className="rounded px-2 py-1 w-70 max-w-md gridjs-input"
        />
      </div>
      <div id="slot-history-table"></div>
    </div>
  );
}