"use client";

import { Grid , html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef, useState } from "react";
import { getHistory } from "@/api/slot/slothistory";

const data = [
  {
    id: 1,
    name: "Zev",
    surname: "Elx",
    email: "zeven@flune.xyz",
    telephone: "0123456789",
    role: "admin",
  },
  {
    id: 4,
    name: "ปานเทพ",
    surname: "แก้วมณี",
    email: "655021001236@mail.rmutk.ac.th",
    telephone: "0909845370",
    role: "user",
  },
];


export default function SlotHistory() {
  const [search, setSearch] = useState("");
  const dataRef = useRef<any[]>([]);
  const gridRef = useRef<Grid | null>(null);

  useEffect(() => {
    let mounted = true;

    // const fetchData = async () => {
      // const data = await getHistory();
    //   if (!mounted) return;
      dataRef.current = data;
    //   renderGrid();
    // };

    // fetchData();

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

    // ฟิลเตอร์ข้อมูลตามคำค้นหา
    const filtered = dataRef.current.filter((item: any) => {
      if (!search) {
        return true;
      }
      const s = search.toLowerCase(); // ตรวจสอบว่ามีคำค้นหาในสตริงนี้ไหม
      return (
        (item.id)
          .toLocaleString() // เปลี่ยนเป็น string
          .includes(s) // ตรวจสอบว่ามีคำค้นหาในสตริงนี้ไหม
        ||
        (item.name || "")
          .toLowerCase() // เปลี่ยนเป็น ตัวพิมพ์เล็ก
          .includes(s) // ตรวจสอบว่ามีคำค้นหาในสตริงนี้ไหม
        ||
        (item.surname || "")
          .toLowerCase() // เปลี่ยนเป็น ตัวพิมพ์เล็ก
          .includes(s) // ตรวจสอบว่ามีคำค้นหาในสตริงนี้ไหม
        ||
        (item.email || "")
          .toLowerCase() // เปลี่ยนเป็น ตัวพิมพ์เล็ก
          .includes(s) // ตรวจสอบว่ามีคำค้นหาในสตริงนี้ไหม
        ||
        (item.telephone || "")
          .toLowerCase() // เปลี่ยนเป็น ตัวพิมพ์เล็ก
          .includes(s) // ตรวจสอบว่ามีคำค้นหาในสตริงนี้ไหม
        ||
        (item.role || "")
          .toLowerCase() // เปลี่ยนเป็น ตัวพิมพ์เล็ก
          .includes(s) // ตรวจสอบว่ามีคำค้นหาในสตริงนี้ไหม
      );
    });

    gridRef.current = new Grid({
      // ตั้งหัวตาราง
      columns: [
        "ID",
        "Name",
        "Surname",
        "Email",
        "Telephone",
        "Role",
        "Action",
        "Action"
      ],
      // ใส่ข้อมูลให้ Library gridjs
      data: filtered.map((item: any) => [
        item.id,
        item.name,
        item.surname,
        item.email,
        item.telephone,
        item.role,
        
        // ใส่ปุ่มกด ในนี้
        html(
          `<div ClassName="gap-5">
            <div style='padding: 2px; border: 1px solid #ccc;border-radius: 4px;'>
              <center>hello!</center>
            </div>
            <div style='padding: 2px; border: 1px solid #ccc;border-radius: 4px;'>
              <center>hello!</center>
            </div>
          </div>`
        ),
        html(
          `<div ClassName="gap-5">
            <div style='padding: 2px; border: 1px solid #ccc;border-radius: 4px;'>
              <center>hello!</center>
            </div>
            <div style='padding: 2px; border: 1px solid #ccc;border-radius: 4px;'>
              <center>hello!</center>
            </div>
          </div>`
        )
      ]),
      // แก้ไข CSS ของตาราง
      style: {
        table: {
          "font-size": "13px",
        },
      },
      // ทำให้ตารางแสดงข้อมูลกี่ record ต่อหน้า
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