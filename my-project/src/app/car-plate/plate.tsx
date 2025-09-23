"use client";

import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef, useState } from "react";
import { getHistory } from "@/api/plate/platehistory";

export default function PlateHistory() {
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
    const container = document.getElementById("plate-history-table");
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
        (item.license_plate || "")
          .toLowerCase().includes(s)
      );
    });

    gridRef.current = new Grid({
      columns: ["License Plate", "Entry Time", "Exit Time" ],
      data: filtered.map((item: any) => [
        item.license_plate,
        new Date(item.entry_time).toLocaleString(),
        new Date(item.exit_time).toLocaleString(),
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
      <h2 className="text-2xl font-bold mb-4">Plate History</h2>
      <div className="mb-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type a keyword..."
          className="rounded px-2 py-1 w-70 max-w-md gridjs-input"
        />
      </div>
      <div id="plate-history-table"></div>
    </div>
  );
}