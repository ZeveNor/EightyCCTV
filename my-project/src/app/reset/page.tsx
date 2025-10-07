"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.warning("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว");
      } else {
        toast.error(data?.error || "ไม่สามารถส่งคำขอได้");
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white relative"
      style={{
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.08) 0, rgba(255, 0, 100, 0.08) 1px, transparent 1px, transparent 20px),
          repeating-linear-gradient(-45deg, rgba(0, 255, 200, 0.08) 0, rgba(0, 255, 200, 0.08) 1px, transparent 1px, transparent 20px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="  text-center text-2xl font-bold text-[#160d4e]">
            ระบบจัดการลานจอดรถ
          </h2>

          <p className="text-center text-gray-500 mb-4">
            กรอกอีเมลที่ใช้สมัคร เพื่อรับลิงก์รีเซ็ตรหัสผ่าน
          </p>

          <form onSubmit={handleRequestReset}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">อีเมล</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn w-full bg-black text-white hover:bg-neutral ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "กำลังส่ง..." : "ส่งคำขอรีเซ็ตรหัสผ่าน"}
            </button>

            <div className="flex justify-between mt-3 text-sm">
              <a href="/login" className="link link-hover">
                กลับไปหน้าล็อกอิน
              </a>
              <a href="/register" className="link link-hover">
                สร้างบัญชีใหม่
              </a>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}
