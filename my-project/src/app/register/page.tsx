"use client";
import React, { useState, useEffect } from "react";
import { handleRegister, handleEmailVerify, handleOtpVerify } from "@/api/auth/register";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isVerifyComplete, setIsVerifyComplete] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isButtonDisabled && counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter === 0) {
      setIsButtonDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [counter, isButtonDisabled]);

  async function registerEvent(e: React.FormEvent) {
    e.preventDefault();
    await handleRegister(name, surname, email, password, phoneNumber);
  }

  async function handleSendCode() {
    if (email.endsWith("@mail.rmutk.ac.th")) {
      await handleEmailVerify(email);
      setIsButtonDisabled(true);
      setCounter(59);
    }
  }

  async function handleVerifyCode() {
    
    if (otp.length === 6) {
      console.debug("[register] verifying OTP for", email);
      const res = await handleOtpVerify(email, otp);
      // handleOtpVerify should return a numeric status or boolean
      // If the API returned an object, normalize it here.
      const status = typeof res === "object" && res !== null ? res.status ?? res.result?.status ?? res.result ?? res : res;
      if (Number(status) === 200) {
        setIsVerifyComplete(false);
      } else {
        setIsVerifyComplete(true);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.2) 0, rgba(255, 0, 100, 0.2) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(0, 255, 200, 0.15) 0, rgba(0, 255, 200, 0.15) 1px, transparent 1px, transparent 20px) `,
          backgroundSize: "40px 40px",
        }}
      />
      <fieldset className="fieldset z-2 bg-white rounded-lg border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend text-center" style={{ fontSize: "40px", color: "#160d4eff" }}>
          EIGHTY CCTV
        </legend>
        <form onSubmit={registerEvent}>
          <div className="mb-4">
            <label className="input validator floating-label">
              <span>ชื่อ</span>
              <input
                type="text"
                required
                placeholder="ชื่อ"
                pattern="^[A-Za-zก-๙]+$"
                value={name}
                onChange={(e) => setName(e.target.value)}
                title="Only letters"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="input validator floating-label">
              <span>นามสกุล</span>
              <input
                type="text"
                required
                placeholder="นามสกุล"
                pattern="^[A-Za-zก-๙]+$"
                value={surname}
                onChange={(e) => setSurName(e.target.value)}
                title="Only letters"
              />
            </label>
          </div>

          <div>
            <label className="input validator floating-label">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <g fill="none">
                  <path
                    d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
              <span>เบอร์โทรศัพท์</span>
              <input
                type="tel"
                className="tabular-nums"
                required
                placeholder="เบอร์โทรศัพท์"
                pattern="[0-9]*"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                minLength={10}
                maxLength={10}
                title="Must be 10 digits"
              />
            </label>
            <p className="validator-hint">Must be 10 digits</p>
          </div>

          <div>
            <label className="input validator floating-label">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
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
              <span>รหัสผ่าน</span>
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
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
            </p>
          </div>

          <div className="mb-4">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend className="fieldset-legend">ยืนยันอีเมลมหาลัย</legend>
              <div className="join floating-label validator ">
                <span>กรอกอีเมลมหาวิทยาลัย แล้วกดยืนยัน</span>
                <input
                  className="input join-item validator" 
                  type="email"
                  placeholder="example@mail.rmutk.ac.th"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="validator-hint hidden">Enter valid email address</div>
              <label className="label text-neutral">รหัสยืนยัน
                <input
                  className="input validator join-item"
                  required
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  minLength={6}
                  maxLength={6}
                  placeholder="XXXXXX"
                />
                <button
                  className="btn btn-neutral join-item"
                  style={{ borderRadius: "5px" }}
                  type="button"
                  onClick={handleSendCode}
                  disabled={isButtonDisabled}
                >
                  ส่งรหัส {isButtonDisabled && `(${counter})`}
                </button>
              </label>
            </fieldset>
            <div className="validator-hint hidden">Enter valid email address</div>
            <div className="flex justify-center">
              <button
                className="btn btn-neutral btn-outline w-full mt-2 join-item"
                style={{ borderRadius: "5px" }}
                type="button"
                onClick={handleVerifyCode}
              >
              ตรวจสอบรหัสยืนยัน
            </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              className="btn w-full btn-neutral btn-outline"
              type="submit"
              disabled={isVerifyComplete}
            >
              Register
            </button>
          </div>
          <a href="/login" className="link mt-4 block text-center">Already have an account? Login</a>
        </form>
      </fieldset>
    </div>
  );
}