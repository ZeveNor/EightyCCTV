import { useState } from "react";
import CameraMode from "./camera/camera";
import RtspMode from "./camera/rtsp";
import CloseMode from "./camera/close";

function Camera() {
  return <div><CameraMode /></div>;
}

function Rtsp() {
  return <div><RtspMode /></div>;
}

function Close() {
  return <div><CloseMode /></div>;
}

export default function CameraViewer() {
  const [selected, setSelected] = useState<string>("all");

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="filter space-x-2">
        <input
          className="btn filter-reset"
          type="radio"
          name="metaframeworks"
          aria-label="All"
          onChange={() => setSelected("all")}
          checked={selected === "all"}
        />
        <input
          className="btn"
          type="radio"
          name="metaframeworks"
          aria-label="กล้อง"
          onChange={() => setSelected("camera")}
          checked={selected === "camera"}
        />
        <input
          className="btn"
          type="radio"
          name="metaframeworks"
          aria-label="กล้องวงจรปิด"
          onChange={() => setSelected("rtsp")}
          checked={selected === "rtsp"}
        />
      </div>

      <div className="mt-5">
        {selected === "camera" && <Camera />}
        {selected === "rtsp" && <Rtsp />}
        {selected === "all" && <Close />}
      </div>
    </div>
  );
}
