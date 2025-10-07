"use client";

import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef, useState } from "react";
import { getAllUsers, userRemove, userUnremove, updateUserProfile } from "@/api/member/member";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MembersManagement(role: { role: string }) {
  const [search] = useState("");
  const [modal, setModal] = useState<{ show: boolean; message: string; onConfirm?: () => void }>({
    show: false,
    message: "",
  });
  const dataRef = useRef<any[]>([]);
  const gridRef = useRef<Grid | null>(null);

  const openModal = (message: string, onConfirm: () => void) =>
    setModal({ show: true, message, onConfirm });
  const closeModal = () => setModal({ show: false, message: "" });

  const fetchData = async () => {
    try {
      const res = await getAllUsers();
      const rows = res?.result || [];
      dataRef.current = Array.isArray(rows) ? rows : [];
      renderGrid();
    } catch {
      toast.error("โหลดข้อมูลสมาชิกไม่สำเร็จ", {
        position: "bottom-right",
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (gridRef.current) gridRef.current.destroy();
      gridRef.current = null;
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
      } catch {}
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

    const isAdmin = role.role === "admin";

    const columns = ["รหัสผู้ใช้", "ชื่อ", "นามสกุล", "อีเมล", "เบอร์โทรศัพท์", "สิทธิ์", "สถานะ"];
    if (isAdmin) columns.push("เครื่องมือ");

    const data = filtered.map((item: any) => {
      const base = [
        item.id,
        item.name,
        item.surname,
        item.email,
        item.telephone,
        item.role,
        item.deleted_at ? `ถูกลบ (${new Date(item.deleted_at).toLocaleString()})` : "ใช้งานอยู่",
      ];

      if (isAdmin) {
        base.push(
          html(`
            <div class="flex space-x-2">
              <button class="edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">แก้ไข</button>
              ${
                item.deleted_at
                  ? `<button class="unremove-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">คืนค่า</button>`
                  : `<button class="remove-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">ลบ</button>`
              }
            </div>
          `)
        );
      }

      return base;
    });

    gridRef.current = new Grid({
      columns,
      data,
      style: { table: { "font-size": "12px" , "text-align": "center"} },
      pagination: { limit: 8, summary: false },
      search: true,
      sort: true,
      resizable: true,
      language: {
        search: { placeholder: "พิมพ์คำค้นหา..." },
        pagination: {
          previous: "ก่อนหน้า",
          next: "ถัดไป",
          showing: "แสดง",
          results: () => "รายการ",
        },
        loading: "กำลังโหลดข้อมูล...",
        noRecordsFound: "ไม่มีสมาชิกในระบบ",
      },
    });

    gridRef.current.render(container!);
  };

  useEffect(() => {
    const container = document.getElementById("members-table");
    if (!container) return;

    const handleRemove = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("remove-btn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;
        openModal("คุณต้องการลบสมาชิกนี้หรือไม่?", async () => {
          try {
            await userRemove(id);
            toast.success("ลบสมาชิกสำเร็จ", {
              position: "bottom-right",
              theme: "colored",
              transition: Bounce,
            });
            fetchData();
          } catch {
            toast.error("ลบสมาชิกไม่สำเร็จ", {
              position: "bottom-right",
              theme: "colored",
              transition: Bounce,
            });
          }
        });
      }
    };

    const handleUnremove = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("unremove-btn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;
        openModal("คุณต้องการคืนค่าสมาชิกนี้หรือไม่?", async () => {
          try {
            await userUnremove(id);
            toast.success("คืนค่าสมาชิกสำเร็จ", {
              position: "bottom-right",
              theme: "colored",
              transition: Bounce,
            });
            fetchData();
          } catch {
            toast.error("คืนค่าสมาชิกไม่สำเร็จ", {
              position: "bottom-right",
              theme: "colored",
              transition: Bounce,
            });
          }
        });
      }
    };

    const handleEdit = (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains("edit-btn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;

        const row = target.closest("tr");
        if (!row) return;

        const nameCell = row.children[1] as HTMLElement;
        const surnameCell = row.children[2] as HTMLElement;
        const telCell = row.children[4] as HTMLElement;
        const roleCell = row.children[5] as HTMLElement;
        const actionCell = row.children[7] as HTMLElement;

        const currentName = nameCell.innerText;
        const currentSurname = surnameCell.innerText;
        const currentTel = telCell.innerText;
        const currentRole = roleCell.innerText;

        nameCell.innerHTML = `<input value="${currentName}" class="p-1 border rounded w-full"/>`;
        surnameCell.innerHTML = `<input value="${currentSurname}" class="p-1 border rounded w-full"/>`;
        telCell.innerHTML = `<input value="${currentTel}" class="p-1 border rounded w-full"/>`;
        roleCell.innerHTML = `<input value="${currentRole}" class="p-1 border rounded w-full"/>`;

        actionCell.innerHTML = `
          <button class="save-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-id="${id}">บันทึก</button>
          <button class="cancel-btn bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded" data-id="${id}">ยกเลิก</button>
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

        openModal("คุณต้องการบันทึกข้อมูลนี้หรือไม่?", async () => {
          try {
            await updateUserProfile(id, { name, surname, telephone, role });
            toast.success("บันทึกข้อมูลสำเร็จ", {
              position: "bottom-right",
              theme: "colored",
              transition: Bounce,
            });
            fetchData();
          } catch {
            toast.error("บันทึกข้อมูลไม่สำเร็จ", {
              position: "bottom-right",
              theme: "colored",
              transition: Bounce,
            });
          }
        });
      }

      if (target.classList.contains("cancel-btn")) {
        fetchData();
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
      <h2 className="text-2xl font-bold mb-4">จัดการสมาชิก</h2>
      <div id="members-table"></div>

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
              <button
                onClick={closeModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
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
