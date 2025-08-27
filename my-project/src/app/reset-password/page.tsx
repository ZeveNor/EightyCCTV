"use client";
import React, { useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  
  async function handleLogin(e: React.FormEvent) {
    // e.preventDefault();
    // const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (res.ok) {
    //   const data = await res.json();
    //   if (data.status === "ok") {
    //     localStorage.setItem("authToken", data.token);
    //     window.location.href = "/";
    //   } else {
    //     console.log("Login failed: No token received.");
    //   }
    // } else {
    //   console.log("Login Failed.");
    // }
    return 0;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: "#f1eefbff" }}>
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.2) 0, rgba(255, 0, 100, 0.2) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(0, 255, 200, 0.15) 0, rgba(0, 255, 200, 0.15) 1px, transparent 1px, transparent 20px) `,
            backgroundSize: "40px 40px",
          }}
        />
        <fieldset className="fieldset z-2 bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend text-center" style={{fontSize:"40px", color: "#160d4eff"}}>EIGHTY CCTV</legend>
          <form onSubmit={handleLogin}>
            <label className="label">รหัสผ่านใหม่</label>
            <div className="mb-4">
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                    ></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                  </g>
                </svg>
                <input
                  type="password"
                  required
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
              </label>
              <div className="validator-hint hidden">Enter Password</div>
            </div>

            <label className="label">ยืนยันรหัสผ่าน</label>
            <div className="mb-1">
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                    ></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                  </g>
                </svg>
                <input
                type="password"
                required
                placeholder="รหัสผ่าน"
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
              </label>
            </div>

            <button className="btn btn-neutral mt-4 w-full" type="submit">ยืนยัน</button>
          </form>
        </fieldset>
      </div>
    </>
  )
}