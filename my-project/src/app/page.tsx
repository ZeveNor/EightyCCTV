"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarComponent from "@/navbar/navbar";

import ParkingSlot from "@/parking-slot/parking-slot";
import SlotHistory from "@/slot-history/slot-history";
import MembersManagement from "./members/members-management";
import MyCars from "./members/Mycars";
import AdminVehicles from "./CarPlates/AdminVehicles";

import ParkingSlotSidebar from "@/navbar/navbars/parkingslot";
import CarPlateSidebar from "@/navbar/navbars/carparking";
import MemberSidebar from "@/navbar/navbars/member";
import VideoRecordSidebar from "@/navbar/navbars/videorecord";

import MJPEGViewer from "@/StreamVideo/stream";
import { jwtDecode } from "jwt-decode";
import "../navbar/nav-mobile.css";

const MENU = {
  INTERACTIVE_MAP: "Interactive Map",
  PARKING_HISTORY: "Parking History",
  SEARCH_PLATE: "Search Plate",
  SEARCH_MEMBER: "Search Member",
  CREATE_GUEST_PLATE: "Create Guest Plate",
  CAR_HISTORY: "Car Plate History",

  MANAGE_MEMBER: "Manage Member",
  EDIT_MEMBER: "Edit Member",
  MEMBER_HISTORY: "Member History",

  WATCH_RECORDS: "Watch Records",
};
interface TokenPayload {
  id: number; 
  role: string;
}
export default function Home() {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState(MENU.INTERACTIVE_MAP);
  const [cameraUrl, setCameraUrl] = useState("ws://localhost:3000/ws/rtsp");
  const [userId, setUserId] = useState<number | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserId(decoded.id); 
    } catch (err) {
      console.error("Invalid token", err);
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="h-dvh flex flex-col border">
      {/* navbar top */}
      <div className="min-h-16 z-100">
        <NavbarComponent />
      </div>

      {/* content bottom */}
      <div className="flex flex-1">
        <div id="nav-dt" className="md:min-w-65 w-0 flex-none h-full md:p-4" style={{ borderRight: "3px solid rgba(0, 0, 0, 0.12)" }}>
          <div className="flex flex-col justify-between h-full ">
            {/* flex top | show menu list */}
            <SideMenuList selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
          </div>
        </div>

        {/* Content each link and navbar show here */}
        <div className="flex-auto h-[91vh] overflow-y-auto">
          {selectedMenu === MENU.INTERACTIVE_MAP &&
            <div className="slot-background pt-6 md:pl-6 pl-0 h-full overflow-hidden">
              <ParkingSlot />
            </div>
          }
          {selectedMenu === MENU.PARKING_HISTORY &&
            <div>
              <SlotHistory />
            </div>
          }
          {selectedMenu === MENU.SEARCH_PLATE &&
            <div>Parking History Content</div>
          }
          {selectedMenu === MENU.SEARCH_MEMBER && userId !== null && (
            <div>
              <AdminVehicles/>
            </div>
          )}
          {selectedMenu === MENU.CREATE_GUEST_PLATE && <div>Create Guest Plate Content</div>}
          {selectedMenu === MENU.CAR_HISTORY && <div>Car Plate History Content</div>}

          {selectedMenu === MENU.MANAGE_MEMBER && <div><MembersManagement /></div>}
          {selectedMenu === MENU.EDIT_MEMBER && userId !== null && (
            <div>
              <MyCars userId={userId} />
            </div>
          )}

          {selectedMenu === MENU.MEMBER_HISTORY && <div>Member History Content</div>}

          {selectedMenu === MENU.WATCH_RECORDS &&
            <div className="pt-6 pl-6">
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
    <div>

      {/* Desktop Responsive */}
      <div className="overflow-y-auto md:block hidden" style={{ height: "calc(90vh - 64px)" }}>
        <ul className="menu rounded-box w-56 gap-2 ">

          {/* Parking Slot */}
          <ParkingSlotSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

          {/* Car Plates */}
          <CarPlateSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

          {/* Members */}
          <MemberSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

          {/* Video Records */}
          <VideoRecordSidebar MENU={MENU} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

        </ul>
      </div>
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