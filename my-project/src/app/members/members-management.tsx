"use client";

import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef, useState } from "react";
import { getAllUsers, userRemove, userUnremove, updateUserProfile } from "@/api/member/member";

export default function MembersManagement() {
  const [search] = useState("");
  const dataRef = useRef<any[]>([]);
  const gridRef = useRef<Grid | null>(null);

  const fetchData = async () => {
    const res = await getAllUsers();
    const rows = res?.result || [];
    dataRef.current = Array.isArray(rows) ? rows : [];
    renderGrid();
  };

  useEffect(() => {
    fetchData();
    return () => {
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
    const container = document.getElementById("members-table");
    if (!container) return;

    if (gridRef.current) {
      try {
        gridRef.current.destroy();
      } catch { }
      gridRef.current = null;
      container.innerHTML = "";
    }

    const filtered = dataRef.current.filter((item: any) => {
      if (!search) return true;
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
        html(`
          <div class="flex space-x-2">
            <button class="edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">Edit</button>
            ${item.deleted_at
            ? `<button class="unremove-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">Unremove</button>`
            : `<button class="remove-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">Remove</button>`}
          </div>`)
      ]),
      style: { table: { "font-size": "12px" } },
      pagination: { limit: 8, summary: false },
      search: true,
      sort: true,
      resizable: true,
    });

    gridRef.current.render(container!);
  };

  useEffect(() => {
    const container = document.getElementById("members-table");
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

        // หาแถวของ user ที่จะ edit
        const row = target.closest("tr");
        if (!row) return;

        // cell name, surname, telephone
        const nameCell = row.children[1] as HTMLElement;
        const surnameCell = row.children[2] as HTMLElement;
        const telCell = row.children[4] as HTMLElement;
        const roleCell = row.children[5] as HTMLElement;
        const actionCell = row.children[7] as HTMLElement;

        const currentName = nameCell.innerText;
        const currentSurname = surnameCell.innerText;
        const currentTel = telCell.innerText;
        const currentRole = roleCell.innerText;
        // แปลงเป็น input
        nameCell.innerHTML = `<input value="${currentName}" />`;
        surnameCell.innerHTML = `<input  value="${currentSurname}" />`;
        telCell.innerHTML = `<input  value="${currentTel}" />`;
        roleCell.innerHTML = `<input  value="${currentRole}" />`;

        // เปลี่ยนปุ่มเป็น Save / Cancel
        actionCell.innerHTML = `
          <button class="save-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-id="${id}">Save</button>
          <button class="cancel-btn bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded" data-id="${id}">Cancel</button>
        `;
      }

      if (target.classList.contains("save-btn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;
        const row = target.closest("tr");
        if (!row) return;

        const name = (row.children[1].querySelector("input") as HTMLInputElement).value;
        const surname = (row.children[2].querySelector("input") as HTMLInputElement).value;
        const telephone = (row.children[4].querySelector("input") as HTMLInputElement).value;
        const role = (row.children[5].querySelector("input") as HTMLInputElement).value;
        updateUserProfile(id, { name, surname, telephone ,role}) 
          .then(() => fetchData())
          .catch((err) => console.error(err));
      }

      if (target.classList.contains("cancel-btn")) {
        fetchData(); // โหลดใหม่กลับไปเหมือนเดิม
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
  }, [dataRef.current]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Members Management</h2>
      
      <div id="members-table"></div>
    </div>
  );
}
