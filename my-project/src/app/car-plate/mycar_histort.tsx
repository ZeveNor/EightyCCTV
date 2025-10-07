"use client";

import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef, useState } from "react";
import { getHistoryByUserId } from "@/api/plate/platehistory";

export default function MyPlateHistory({ userId }: { userId: number }) {
  const [search, setSearch] = useState("");
  const dataRef = useRef<any[]>([]);
  const gridRef = useRef<Grid | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await getHistoryByUserId(userId);
        if (!mounted) return;
        dataRef.current = Array.isArray(data) ? data : [];
        renderGrid();
      } catch (err) {
        console.error("โหลดข้อมูลประวัติไม่สำเร็จ", err);
      }
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
      } catch {}
      gridRef.current = null;
      container.innerHTML = "";
    }

    const filtered = dataRef.current.filter((item: any) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (item.license_plate || "").toLowerCase().includes(s);
    });

    gridRef.current = new Grid({
      columns: ["ทะเบียนรถ", "เวลาเข้า", "เวลาออก / สถานะ"],
      data: filtered.map((item: any) => [
        item.license_plate,
        new Date(item.entry_time).toLocaleString("th-TH", { hour12: false }),
        item.exit_time
          ? new Date(item.exit_time).toLocaleString("th-TH", { hour12: false })
          : "ยังจอดอยู่",
      ]),
      style: {
        table: { "font-size": "13px", "text-align": "center" },
      },
      pagination: { limit: 6, summary: false },
      search: false,
      sort: true,
      resizable: true,
      language: {
        search: { placeholder: "🔍 ค้นหา..." },
        pagination: {
          previous: "ก่อนหน้า",
          next: "ถัดไป",
          showing: "แสดง",
          results: () => "รายการ",
        },
        loading: "กำลังโหลดข้อมูล...",
        noRecordsFound: "ไม่พบข้อมูลรถ คุณสามารถเพิ่มรถเพื่อดูประวัติการใช้รถของคุณได้",
      },
    });

    gridRef.current.render(container!);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">ประวัติการเข้าออกรถ</h2>

      <div className="mb-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="พิมพ์คำค้นหา..."
          className="rounded px-2 py-1 w-70 max-w-md gridjs-input"
        />
      </div>

      <div id="plate-history-table"></div>
    </div>
  );
}
