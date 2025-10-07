
import { useEffect, useRef, useState } from "react";

export default function CameraMode() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [plates, setPlates] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(console.error);
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    })();

    return () => {
      // cleanup interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      // ปิดกล้อง
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCapture = () => {
    if (isCapturing) {
      // stop capture
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsCapturing(false);
      console.log("⏸️ Capture stopped");
    } else {
      // start capture every 5 sec
      intervalRef.current = setInterval(() => {
        captureFrame();
      }, 3000);
      setIsCapturing(true);
      console.log("▶️ Capture started");
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );

      if (blob) {
        const formData = new FormData();
        formData.append("file", blob, `frame-${Date.now()}.jpg`);

        try {
          const res = await fetch("http://localhost:3000/api/entry/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          console.log("✅ Frame uploaded", data);
          setPlates([]); 
          const plate = data.result?.plate;
          if (plate) {
            setPlates((prev) => (prev.includes(plate) ? prev : [...prev, plate]));
          }
        } catch (err) {
          console.error("Upload failed:", err);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h1 className="text-2xl font-bold">Car Plate Detector</h1>
      <p className="text-gray-500">
        Toggle capture to send frames to API every 4 seconds
      </p>

      <div
        className="rounded-lg overflow-hidden border"
        style={{ width: "640px", height: "360px", background: "#000" }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <button
        onClick={toggleCapture}
        className={`px-4 py-2 rounded-lg text-white font-bold ${
          isCapturing ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isCapturing ? "Stop Capture" : "เริ่มตรวจจับ"}
      </button>

      <div className="text-center mt-3">
        <h2 className="text-md font-bold mb-2">ผลลัพธ์</h2>
        <div className="border text-left border-gray-300 rounded-lg p-2 w-96 overflow-y-auto">
          <p className="text-gray-400 text-center">
            {plates.length > 0 ? plates.join(", ") : "ยังไม่พบป้ายทะเบียน"}
          </p>
        </div>
      </div>
    </div>
  );
}
