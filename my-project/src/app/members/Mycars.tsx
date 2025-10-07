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
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyCars({ userId }: { userId: number }) {
  const [search] = useState("");
  const dataRef = useRef<any[]>([]);
  const gridRef = useRef<Grid | null>(null);

  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [province, setProvince] = useState("");

  const [modal, setModal] = useState<{ show: boolean; message: string; onConfirm?: () => void }>({
    show: false,
    message: "",
  });

  const openModal = (message: string, onConfirm: () => void) =>
    setModal({ show: true, message, onConfirm });
  const closeModal = () => setModal({ show: false, message: "" });

  const fetchData = async () => {
    try {
      const res = await getVehiclesByUserId(userId);
      const rows = res || [];
      dataRef.current = Array.isArray(rows) ? rows : [];
      renderGrid();
    } catch (err) {
      toast.error("โหลดข้อมูลไม่สำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
    }
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
      } catch {}
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
      columns: ["ทะเบียนรถ", "จังหวัด", "ยี่ห้อ", "รุ่น", "สี", "สถานะรถ", "เครื่องมือ"],
      data: filtered.map((item: any) => [
        item.license_plate,
        item.province,
        item.brand,
        item.model,
        item.color,
        item.deleted_at ? `ถูกลบ (${new Date(item.deleted_at).toLocaleString()})` : "ใช้งานอยู่",
        html(`
          <div class="flex space-x-2">
            <button class="edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              data-plate="${item.license_plate}">แก้ไข</button>
            ${
              item.deleted_at
                ? `<button class="unremove-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-plate="${item.license_plate}">คืนค่า</button>`
                : `<button class="remove-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-plate="${item.license_plate}">ลบ</button>`
            }
          </div>
        `),
      ]),
      style: { table: { "font-size": "12px" , "text-align": "center"} },
      pagination: { limit: 8, summary: false },
      search: true,
      sort: true,
      resizable: true,
      language: {
        search: { placeholder: "พิมพ์คำค้นหา..." },
        pagination: { previous: "ก่อนหน้า", next: "ถัดไป", showing: "แสดง", results: () => "รายการ" },
        loading: "กำลังโหลด...",
        noRecordsFound: "ไม่พบข้อมูลรถ คุณสามารถเพิ่มรถของคุณได้",
      },
    });

    gridRef.current.render(container!);
  };

  useEffect(() => {
    const container = document.getElementById("vehicles-table");
    if (!container) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      // ลบรถ
      if (target.classList.contains("remove-btn")) {
        const plate = target.getAttribute("data-plate");
        if (!plate) return;
        openModal("คุณต้องการลบรถคันนี้หรือไม่?", async () => {
          try {
            await removeVehicles(plate);
            toast.success("ลบรถสำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
            fetchData();
          } catch {
            toast.error("ลบรถไม่สำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
          }
        });
      }

      // คืนค่ารถ
      if (target.classList.contains("unremove-btn")) {
        const plate = target.getAttribute("data-plate");
        if (!plate) return;
        openModal("คุณต้องการคืนค่ารถคันนี้หรือไม่?", async () => {
          try {
            await unremoveVehicles(plate);
            toast.success("คืนค่ารถสำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
            fetchData();
          } catch {
            toast.error("คืนค่ารถไม่สำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
          }
        });
      }

      // แก้ไข
      if (target.classList.contains("edit-btn")) {
        const plate = target.getAttribute("data-plate");
        if (!plate) return;
        const row = target.closest("tr");
        if (!row) return;

        const plateCell = row.children[0] as HTMLElement;
        const provinceCell = row.children[1] as HTMLElement;
        const brandCell = row.children[2] as HTMLElement;
        const modelCell = row.children[3] as HTMLElement;
        const colorCell = row.children[4] as HTMLElement;
        const actionCell = row.children[6] as HTMLElement;

        const currentPlate = plateCell.innerText;
        const currentProvince = provinceCell.innerText;
        const currentBrand = brandCell.innerText;
        const currentModel = modelCell.innerText;
        const currentColor = colorCell.innerText;

        plateCell.innerHTML = `<input value="${currentPlate}" class="p-1 border rounded w-full"/>`;
        provinceCell.innerHTML = `<input value="${currentProvince}" class="p-1 border rounded w-full"/>`;
        brandCell.innerHTML = `<input value="${currentBrand}" class="p-1 border rounded w-full"/>`;
        modelCell.innerHTML = `<input value="${currentModel}" class="p-1 border rounded w-full"/>`;
        colorCell.innerHTML = `<input value="${currentColor}" class="p-1 border rounded w-full"/>`;

        actionCell.innerHTML = `
          <button class="save-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-plate="${plate}">บันทึก</button>
          <button class="cancel-btn bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded" data-plate="${plate}">ยกเลิก</button>
        `;
      }

      // บันทึก
      if (target.classList.contains("save-btn")) {
        const plate = target.getAttribute("data-plate");
        if (!plate) return;
        const row = target.closest("tr");
        if (!row) return;

        const newPlate = (row.children[0].querySelector("input") as HTMLInputElement).value;
        const province = (row.children[1].querySelector("input") as HTMLInputElement).value;
        const brand = (row.children[2].querySelector("input") as HTMLInputElement).value;
        const model = (row.children[3].querySelector("input") as HTMLInputElement).value;
        const color = (row.children[4].querySelector("input") as HTMLInputElement).value;

        openModal("คุณต้องการบันทึกการแก้ไขหรือไม่?", async () => {
          try {
            await updateVehicles({ plate, newPlate, province, brand, model, color });
            toast.success("บันทึกข้อมูลสำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
            fetchData();
          } catch {
            toast.error("บันทึกข้อมูลไม่สำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
          }
        });
      }

      // ยกเลิก
      if (target.classList.contains("cancel-btn")) {
        fetchData();
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [dataRef.current]);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMyVehicleById({ userId, plate, province, brand, model, color });
      toast.success("เพิ่มรถสำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
      setPlate("");
      setProvince("");
      setBrand("");
      setModel("");
      setColor("");
      fetchData();
    } catch {
      toast.error("เพิ่มรถไม่สำเร็จ", { position: "bottom-right", theme: "colored", transition: Bounce });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">จัดการข้อมูลรถของฉัน</h2>

      {/* ฟอร์มเพิ่มรถ */}
      <form onSubmit={handleAddVehicle} className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">เพิ่มรถใหม่</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="ทะเบียนรถ" value={plate} onChange={(e) => setPlate(e.target.value)} className="p-2 bg-white rounded w-full focus:outline-none" required />
          <input type="text" placeholder="จังหวัด" value={province} onChange={(e) => setProvince(e.target.value)} className="p-2 bg-white rounded w-full focus:outline-none" required />
          <input type="text" placeholder="ยี่ห้อ" value={brand} onChange={(e) => setBrand(e.target.value)} className="p-2 bg-white rounded w-full focus:outline-none" required />
          <input type="text" placeholder="รุ่น" value={model} onChange={(e) => setModel(e.target.value)} className="p-2 bg-white rounded w-full focus:outline-none" required />
          <input type="text" placeholder="สี" value={color} onChange={(e) => setColor(e.target.value)} className="p-2 bg-white rounded w-full focus:outline-none" required />
        </div>
        <button type="submit" className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          เพิ่มรถ
        </button>
      </form>

      <div id="vehicles-table"></div>

      {/* Modal ยืนยัน */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="mb-6 whitespace-pre-line">{modal.message}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  modal.onConfirm?.();
                  closeModal();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                ยืนยัน
              </button>
              <button onClick={closeModal} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
