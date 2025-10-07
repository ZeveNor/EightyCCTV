import { useEffect, useRef, useState } from "react";

const url = "ws://localhost:3000/ws/rtsp2";

export default function RtspMode() {
  const [plates, setPlates] = useState<string[]>([]);
  const [noSignal, setNoSignal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setNoSignal(false);
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => setNoSignal(false);
    ws.onerror = () => setNoSignal(true);
    ws.onclose = () => setNoSignal(true);

    ws.onmessage = (event) => {
      if (imgRef.current && event.data instanceof ArrayBuffer) {
        const blob = new Blob([event.data], { type: "image/jpeg" });
        imgRef.current.src = URL.createObjectURL(blob);
      }
    };

    return () => ws.close();
  }, [url]);

  return (
    <div className="px-6 pt-6 pd-0">
      <div className="flex flex-col items-center space-y-2 ">
        <h1 className="text-2xl font-bold mb-4">Car Plate Detector</h1>
        <p>This is a model preview for test performance of the Car Plate Detector API.</p>
     <div
        className="flex justify-center items-center place-content-center xl:w-160 max-w-160 aspect-video rounded-lg"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}
      >
      <img
        ref={imgRef}
        alt={noSignal ? "No Signal" : "RTSP Stream"}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      </div>

      <div className="text-center mt-3">
        <h2 className="text-md font-bold mb-2">ผลลัพธ์</h2>
        <div className="border text-left border-gray-300 rounded-lg p-2 w-96 overflow-y-auto">
          <p className="text-gray-400">
            {plates.length > 0 ? plates.join(", ") : "ยังไม่พบป้ายทะเบียน"}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}