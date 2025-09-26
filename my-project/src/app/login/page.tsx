"use client";
import React, { useState } from "react";
import { handleLoginFunc } from "@/api/auth/login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
  const res = await handleLoginFunc(email, password);
  // Log only the relevant parts to avoid printing large or Promise-like objects
  console.debug('[login] response status:', res?.result?.status ?? res?.status, 'token?', Boolean(res?.result?.data?.token));
    

    if (res.result.status === 200) {
      localStorage.setItem("authToken", res.result.data.token);
      localStorage.setItem("userID", res.result.data.user.id);
      window.location.href = "/";
    } 
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white-500" >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.2) 0, rgba(255, 0, 100, 0.2) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(0, 255, 200, 0.15) 0, rgba(0, 255, 200, 0.15) 1px, transparent 1px, transparent 20px) `,
          backgroundSize: "40px 40px",
        }}
      />
      <fieldset className="fieldset z-2 bg-white border-base-300 rounded-box w-xs border p-4 rounded-lg shadow-lg">
        <legend className="fieldset-legend text-center" style={{fontSize:"40px", color: "#160d4eff"}}>EIGHTY CCTV</legend>
        <form onSubmit={handleLogin}>
          <label className="label">อีเมล</label>
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
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                placeholder="อีเมล"
                required
                value={email}    
                onChange={e => setEmail(e.target.value)} />
            </label>
            <div className="validator-hint hidden">Enter valid email address</div>
          </div>

          <label className="label">รหัสผ่าน</label>
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
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </label>
          </div>

          <button className="btn btn-neutral mt-4 w-full" type="submit">ล็อกอิน</button>
          <a href="/register" className="link mt-4 block text-center">สร้างบัญชีใหม่</a>
        </form>
      </fieldset>
    </div>
  );
}

export function UsernameInput({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  return (
    <div>
      <label className="input validator">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </g>
        </svg>
        <input
          type="text"
          required
          placeholder="Username"
          pattern="[A-Za-z][A-Za-z0-9\-]*"
          title="Only letters, numbers or dash"
        />
      </label>
    </div>
  );
}