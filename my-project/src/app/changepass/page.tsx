"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว ❌");
      setTimeout(() => router.replace("/"), 2000);
    }
  }, [token, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("เปลี่ยนรหัสผ่านสำเร็จ 🎉");
        setTimeout(() => router.replace("/login"), 2000);
      } else {
        toast.error(data?.error || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white"
      style={{
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.2) 0, rgba(255, 0, 100, 0.2) 1px, transparent 1px, transparent 20px),
          repeating-linear-gradient(-45deg, rgba(0, 255, 200, 0.15) 0, rgba(0, 255, 200, 0.15) 1px, transparent 1px, transparent 20px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <div className="card w-96 bg-white shadow-lg border rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-1 text-[#160d4e]">
          ระบบจัดการ
        </h1>
        <h2 className="text-3xl font-bold text-center mb-6 text-[#160d4e]">
          ลานจอดรถ
        </h2>

        <form onSubmit={handleResetPassword}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-sm font-semibold">รหัสผ่านใหม่</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full bg-blue-50"
              placeholder="กรอกรหัสผ่านใหม่"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-sm font-semibold">ยืนยันรหัสผ่าน</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full bg-blue-50"
              placeholder="พิมพ์รหัสผ่านอีกครั้ง"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn w-full border-none text-white bg-black hover:bg-neutral ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "กำลังดำเนินการ..." : "ยืนยันการเปลี่ยนรหัสผ่าน"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <a href="/login" className="link link-hover">
            กลับไปหน้าเข้าสู่ระบบ
          </a>
          <a href="/" className="link link-hover">
            กลับหน้าแรก
          </a>
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}
