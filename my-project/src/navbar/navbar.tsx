"use client";

import React, { useEffect, useState } from "react";
import ParkingSlotSidebar from "@/navbar/navbars/parkingslot";
import CarPlateSidebar from "@/navbar/navbars/carparking";
import MemberSidebar from "@/navbar/navbars/member";
import VideoRecordSidebar from "@/navbar/navbars/videorecord";
import ProfilePage from "./profile";
import "./nav-mobile.css";
import {
  getUserAvatar,
} from "@/api/profile";
const MENU_CONST = {
  INTERACTIVE_MAP: "Interactive Map",
  PARKING_HISTORY: "Parking History",
  CARPLATE_DETECTOR: "Carplate Detector",
  CARPLATE_HISTORY: "Carplate History",
  CREATE_GUEST_PLATE: "Create Guest Plate",
  CAR_MANAGEMENT: "Car Management",
  CAR_HISTORY: "Car Plate History",
  MANAGE_MEMBER: "Manage Member",
  MY_CARS: "My Cars",
  MEMBER_HISTORY: "Member History",
  WATCH_RECORDS: "Watch Records",
};

export default function NavbarComponent({
  selectedMenu,
  setSelectedMenu
}: {
  selectedMenu?: string;
  setSelectedMenu?: (menu: string) => void;
} = {}) {
  return (
    <div className="navbar bg-white shadow-lg">
      {/* navbar left */}
      <div className="navbar-start">
        <a className="font-bold md:text-xl ml-5">ระบบจัดการลานจอดรถ</a>
      </div>
      {/* navbar center */}
      <div className="navbar-center"></div>
      {/* navbar right */}
      <div className="navbar-end flex items-center gap-2">
        <NavbarMonbile selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        <Profile />
      </div>
    </div>
  );
}

export function NavbarMonbile({
  MENU = MENU_CONST,
  selectedMenu: propSelectedMenu,
  setSelectedMenu: propSetSelectedMenu,
}: {
  MENU?: any;
  selectedMenu?: string;
  setSelectedMenu?: (menu: string) => void;
}) {
  // if parent provided selection handlers (from page), use them — otherwise use local state
  const [localSelectedMenu, setLocalSelectedMenu] = useState(MENU.INTERACTIVE_MAP);
  const selectedMenu = propSelectedMenu ?? localSelectedMenu;
  const setSelectedMenu = propSetSelectedMenu ?? setLocalSelectedMenu;

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

  const [avatar, setAvatar] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const avatarData = await getUserAvatar();
      if (avatarData.status === 200) {
        setAvatar(avatarData.result.avatar_url);
      }
    } catch (err) {
      console.error("Error fetching user", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dropdown dropdown-end ml-2 z-100">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-6 rounded-full">
          <img
            src={avatar || "https://static.vecteezy.com/system/resources/previews/024/983/914/large_2x/simple-user-default-icon-free-png.png"}
            alt="Profile Avatar"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a href="/profile">My Profile</a>
        </li>

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
