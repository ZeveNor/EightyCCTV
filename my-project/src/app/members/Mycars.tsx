"use client";

import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef, useState } from "react";
import {
  getVehiclesByUserId,
  removeVehicles,
  unremoveVehicles,
  updateVehicles,
  addMyVehicleById,
} from "@/api/member/Mycars";

export default function MyCars({ userId }: { userId: number }) {
  const [search] = useState("");
  const dataRef = useRef<any[]>([]);
  const gridRef = useRef<Grid | null>(null);

  // state ของฟอร์มเพิ่มรถ
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [province, setProvince] = useState("");


  const fetchData = async () => {
    const res = await getVehiclesByUserId(userId);
    const rows = res || [];
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
    const container = document.getElementById("vehicles-table");
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
        (item.license_plate || "").toLowerCase().includes(s) ||
        (item.brand || "").toLowerCase().includes(s) ||
        (item.model || "").toLowerCase().includes(s) ||
        (item.color || "").toLowerCase().includes(s) ||
        (item.deleted_at || "").toString().toLowerCase().includes(s)
      );
    });

    gridRef.current = new Grid({
      columns: ["Plate", "Province", "Brand", "Model", "Color", "Deleted At", "Actions"],
      data: filtered.map((item: any) => [
        item.license_plate,
        item.province,
        item.brand,
        item.model,
        item.color,
        item.deleted_at ? new Date(item.deleted_at).toLocaleString() : "Active",
        html(`
          <div class="flex space-x-2">
            <button class="edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" data-plate="${item.license_plate}">Edit</button>
            <button class="remove-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-plate="${item.license_plate}">Remove</button>
          </div>
        `),
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
    const container = document.getElementById("vehicles-table");
    if (!container) return;

    const handleRemove = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("remove-btn")) {
        const plate = target.getAttribute("data-plate");
        if (!plate) return;
        await removeVehicles(plate);
        fetchData();
      }
    };

    const handleUnremove = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("unremove-btn")) {
        const plate = target.getAttribute("data-plate");
        if (!plate) return;
        await unremoveVehicles(plate);
        fetchData();
      }
    };

    const handleEdit = (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains("edit-btn")) {
        const plate = target.getAttribute("data-plate");
        if (!plate) return;

        const row = target.closest("tr");
        if (!row) return;

        const provinceCell = row.children[1] as HTMLElement;
        const brandCell = row.children[2] as HTMLElement;
        const modelCell = row.children[3] as HTMLElement;
        const colorCell = row.children[4] as HTMLElement;
        const actionCell = row.children[6] as HTMLElement;

        const currentProvince = provinceCell.innerText;
        const currentBrand = brandCell.innerText;
        const currentModel = modelCell.innerText;
        const currentColor = colorCell.innerText;

        provinceCell.innerHTML = `<input value="${currentProvince}" class="p-1 border rounded w-full"/>`;
        brandCell.innerHTML = `<input value="${currentBrand}" class="p-1 border rounded w-full"/>`;
        modelCell.innerHTML = `<input value="${currentModel}" class="p-1 border rounded w-full"/>`;
        colorCell.innerHTML = `<input value="${currentColor}" class="p-1 border rounded w-full"/>`;

        actionCell.innerHTML = `
          <button class="save-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-plate="${plate}">Save</button>
          <button class="cancel-btn bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded" data-plate="${plate}">Cancel</button>
        `;
      }

      if (target.classList.contains("save-btn")) {
        const plate = target.getAttribute("data-plate");
        if (!plate) return;

        const row = target.closest("tr");
        if (!row) return;

        const province = (row.children[1].querySelector("input") as HTMLInputElement).value;
        const brand = (row.children[2].querySelector("input") as HTMLInputElement).value;
        const model = (row.children[3].querySelector("input") as HTMLInputElement).value;
        const color = (row.children[4].querySelector("input") as HTMLInputElement).value;

        updateVehicles({ plate, newPlate: plate,province, brand, model, color })
          .then(() => fetchData())
          .catch((err) => console.error(err));
      }

      if (target.classList.contains("cancel-btn")) {
        fetchData();
      }
    };
//แบบนี้จะได้ไม่สับสน
    container.addEventListener("click", handleRemove);
    container.addEventListener("click", handleUnremove);
    container.addEventListener("click", handleEdit);

    return () => {
      container.removeEventListener("click", handleRemove);
      container.removeEventListener("click", handleUnremove);
      container.removeEventListener("click", handleEdit);
    };
  }, [dataRef.current]);

  // ✅ ฟังก์ชันเพิ่มรถ
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMyVehicleById({ userId, plate, province ,brand, model, color,  });
      setPlate("");
      setProvince("");
      setBrand("");
      setModel("");
      setColor("");
      fetchData();
    } catch (err) {
      console.error("Add vehicle error:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vehicle Management</h2>

      {/* ✅ ฟอร์มเพิ่มรถใหม่ */}
      <form onSubmit={handleAddVehicle} className="mb-6 p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Add New Vehicle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="License "
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="p-2 bg-white rounded w-full focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="p-2 bg-white rounded w-full focus:outline-none"
            required
          />

          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="p-2 bg-white rounded w-full focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="p-2 bg-white rounded w-full focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="p-2 bg-white rounded w-full focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Vehicle
        </button>
      </form>


      {/* ตารางรถ */}
      <div id="vehicles-table"></div>
    </div>
  );
}
