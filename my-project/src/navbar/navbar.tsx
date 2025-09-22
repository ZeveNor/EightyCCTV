"use client";

import React, { useEffect, useState } from "react";
import ParkingSlotSidebar from "@/navbar/navbars/parkingslot";
import CarPlateSidebar from "@/navbar/navbars/carparking";
import MemberSidebar from "@/navbar/navbars/member";
import VideoRecordSidebar from "@/navbar/navbars/videorecord";
import "./nav-mobile.css";

const MENU = {
  INTERACTIVE_MAP: "Interactive Map",
  PARKING_HISTORY: "Parking History",
  SEARCH_PLATE: "Search Plate",
  SEARCH_MEMBER: "Search Member",
  CREATE_GUEST_PLATE: "Create Guest Plate",
  CAR_HISTORY: "Car Plate History",
  ADD_MEMBER: "Add Member",
  EDIT_MEMBER: "Edit Member",
  SEARCH_MEMBERS: "Search Members",
  MEMBER_HISTORY: "Member History",
  WATCH_RECORDS: "Watch Records",
};

export default function NavbarComponent() { 
  return (
    <div className="navbar bg-white shadow-lg">
      
      {/* navbar left */}
      <div className="navbar-start">
        <a className="font-bold text-xl ml-5">80 CCTV</a>
      </div>
      
      {/* navbar center */}
      <div className="navbar-center">
      </div>

      {/* navbar right */}
      <div className="navbar-end"> 
        <NavbarMonbile />
        <Profile />
      </div>

    </div>
  )
}

export function NavbarMonbile() {
  const [selectedMenu, setSelectedMenu] = useState(MENU.INTERACTIVE_MAP);
  return (
    <div id="nav-mb" className="md:hidden block">
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content ">
          <label htmlFor="my-drawer" className="btn drawer-button border-0" style={{ backgroundColor: "white" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-white text-base-content min-h-full w-fit pt-4 pr-6">
            <li>
              <ul className="ml-0">
                <ParkingSlotSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
              </ul>
            </li>
            <li>
              <ul className="ml-0">
                <CarPlateSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
              </ul>
            </li>
            <li>
              <ul className="ml-0">
                <MemberSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
              </ul>
            </li>
            <li>
              <ul className="ml-0">
                <VideoRecordSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Profile Component |
export function Profile() {
  return (
    <div className="dropdown dropdown-end ml-2 z-100">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-6 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
          </a>
        </li>
        <li><a>Settings</a></li>
        <li>
          <a onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/login";
          }}>Logout
          </a>
        </li>
      </ul>
    </div>
  )
}
