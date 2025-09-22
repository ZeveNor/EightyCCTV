"use client";

import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef, useState } from "react";
import { getAllUsers, userRemove, userUnremove } from "@/api/auth/member";

export default function MembersManagement() {

  const [search, setSearch] = useState("");
  const dataRef = useRef<any[]>([]);
  const gridRef = useRef<Grid | null>(null);


  const fetchData = async () => {
    const res = await getAllUsers();
    const rows = res?.result || [];
    dataRef.current = Array.isArray(rows) ? rows : [];
    renderGrid();
  };

  useEffect(() => {
    let mounted = true;

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
        (item.id || "").toString().toLowerCase().includes(s) ||
        (item.name || "").toLowerCase().includes(s) ||
        (item.surname || "").toLowerCase().includes(s) ||
        (item.email || "").toLowerCase().includes(s) ||
        (item.telephone || "").toLowerCase().includes(s) ||
        (item.role || "").toLowerCase().includes(s) ||
        (item.deleted_at || "").toString().toLowerCase().includes(s)
      );
    });

    gridRef.current = new Grid({
      columns: ["id", "name", "surname", "email", "telephone", "role", "deleted_at", "Actions"],
      data: filtered.map((item: any) => [
        item.id,
        item.name,
        item.surname,
        item.email,
        item.telephone,
        item.role,
        item.deleted_at ? new Date(item.deleted_at).toLocaleString() : "Active",
        html(
          `<div class="flex space-x-2">
      <button class="edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">Edit</button>
      ${item.deleted_at
            ? `<button class="unremove-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">Unremove</button>`
            : `<button class="remove-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">Remove</button>`
          }
    </div>`
        )
      ])
      ,

      style: {
        table: {
          'font-size': '10px'
        }
      },
      pagination: {
        limit: 8,
        summary: false
      },
      search: true,
      sort: true,
      resizable: true
    });

    gridRef.current.render(container!);
  };

  useEffect(() => {
    const container = document.getElementById("slot-history-table");
    if (!container) return;

    
    const handleRemove = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("remove-btn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;
        await userRemove(id);
        fetchData(); 
      }
    };

   
    const handleUnremove = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("unremove-btn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;
        await userUnremove(id);
        fetchData();
      }
    };

    
    const handleEdit = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("edit-btn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;

      }
    };

    container.addEventListener("click", handleRemove);
    container.addEventListener("click", handleUnremove);
    container.addEventListener("click", handleEdit);

    return () => {
      container.removeEventListener("click", handleRemove);
      container.removeEventListener("click", handleUnremove);
      container.removeEventListener("click", handleEdit);
    };
  }, [dataRef.current]); // rerun เมื่อ data เปลี่ยน

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">MEMBERS</h2>
      <div className="mb-2">

      </div>
      <div id="slot-history-table"></div>
    </div>
  );
}
