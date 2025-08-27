"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavbarComponent from "@/navbar/navbar";

import DashboardSidebar from "@/navbar/navbars/dashboard";
import ParkingSlotSidebar from "@/navbar/navbars/parkingslot";
import CarPlateSidebar from "@/navbar/navbars/carparking";
import MemberSidebar from "@/navbar/navbars/member";
import VideoRecordSidebar from "@/navbar/navbars/videorecord";
import CreateGuestPlateSidebar from "@/navbar/navbars/createguest";

import MJPEGViewer from "@/StreamVideo/stream";

const MENU = {
  DASHBOARD: "Dashboard",
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

export default function Home() {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState(MENU.DASHBOARD);
  const [cameraUrl, setCameraUrl] = useState("ws://localhost:3000/ws/rtsp"); // default to Camera 1

  useEffect(() => {
    // Check for token (or any auth state you use)
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="h-dvh flex flex-col border">
      {/* navbar top */}
      <div className="min-h-16">
        <NavbarComponent />
      </div>

      {/* content bottom */}
      <div className="flex flex-1">
        <div className="min-w-40 flex-none h-full p-4" style={{ borderRight: "3px solid rgba(0, 0, 0, 0.12)" }}>
          <div className="flex flex-col justify-between h-full ">
            {/* flex top | show menu list */}
            <SideMenuList selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
            {/* flex bottom | show slot available */}
            <SlotAvailableProgress />
          </div>
        </div>

        {/* Content each link and navbar show here */}
        <div className="flex-auto pt-6 pl-6 h-[90vh] overflow-y-auto">
          {selectedMenu === MENU.DASHBOARD && <div>This is Dashboard</div>}
          {selectedMenu === MENU.INTERACTIVE_MAP && <div>Interactive Map Content</div>}
          {selectedMenu === MENU.PARKING_HISTORY && <div>Parking History Content</div>}
          {selectedMenu === MENU.SEARCH_PLATE && <div>Search Plate Content</div>}
          {selectedMenu === MENU.SEARCH_MEMBER && <div>Search Member Content</div>}
          {selectedMenu === MENU.CREATE_GUEST_PLATE && <div>Create Guest Plate Content</div>}
          {selectedMenu === MENU.CAR_HISTORY && <div>Car Plate History Content</div>}
          {selectedMenu === MENU.ADD_MEMBER && <div>Add Member Content</div>}
          {selectedMenu === MENU.EDIT_MEMBER && <div>Edit Member Content</div>}
          {selectedMenu === MENU.SEARCH_MEMBERS && <div>Search Members Content</div>}
          {selectedMenu === MENU.MEMBER_HISTORY && <div>Member History Content</div>}
          {selectedMenu === MENU.WATCH_RECORDS &&
            <div className="">
              <div className="flex flex-row gap-5">
                <h2 className="text-lg font-bold mb-4">Watch Records</h2>
                <div className="flex flex-row gap-2">
                  <button
                    className={`btn btn-sm ${cameraUrl === "ws://localhost:3000/ws/rtsp" ? "btn-active btn-neutral" : ""}`}
                    onClick={() => setCameraUrl("ws://localhost:3000/ws/rtsp")}
                  >
                    Main Camera
                  </button>
                  <button
                    className={`btn btn-sm ${cameraUrl === "ws://localhost:3000/ws/rtsp2" ? "btn-active btn-neutral" : ""}`}
                    onClick={() => setCameraUrl("ws://localhost:3000/ws/rtsp2")}
                  >
                    Parking Camera
                  </button>
                </div>
              </div>
              <div className="flex flex-row">
                <MJPEGViewer url={cameraUrl} />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

function SideMenuList({ selectedMenu, setSelectedMenu }: { selectedMenu: string, setSelectedMenu: (menu: string) => void }) {
  return (
    <div className="overflow-y-auto" style={{ height: "calc(90vh - 64px)" }}>
      <ul className="menu bg-base-200 rounded-box w-56 gap-2 ">

        {/* Dashboard */}
        <DashboardSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

        {/* Parking Slot */}
        <ParkingSlotSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        
        {/* Car Plates */}
        <CarPlateSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>
        
        {/* Members */}
        <MemberSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>

        {/* Video Records */}
        <VideoRecordSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

        {/* Create Guest Button */}
        <CreateGuestPlateSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

      </ul>
    </div>
  );
}

export function SlotAvailableProgress() {
  return (
    <div>
      <progress className="progress w-full" value="70" max="100"></progress>
      <div className="text-sm font-bold text-center">Available 70 / 100</div>
    </div>
  );
}