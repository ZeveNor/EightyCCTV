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
          aria-label="Camera"
          onChange={() => setSelected("camera")}
          checked={selected === "camera"}
        />
        <input
          className="btn"
          type="radio"
          name="metaframeworks"
          aria-label="RTSP"
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

// import React from "react";

// import { use, useEffect, useRef, useState } from "react";
// import axios from "axios";

// const provinceMap: Record<string, string> = {
//   SRN: "สุรินทร์",
//   BKK: "กรุงเทพมหานคร",
//   CNX: "เชียงใหม่",
//   // ... เพิ่มจนครบ
// };

// // map code → พยัญชนะ
// const characterThai: Record<string, string> = {
//   A01: "ก", A02: "ข", A03: "ฃ", A04: "ค", A05: "ฅ", A06: "ฆ",
//   A07: "ง", A08: "จ", A09: "ฉ", A10: "ช", A11: "ซ", A12: "ฌ",
//   A13: "ญ", A14: "ฎ", A15: "ฏ", A16: "ฐ", A17: "ฑ", A18: "ฒ",
//   A19: "ณ", A20: "ด", A21: "ต", A22: "ถ", A23: "ท", A24: "ธ",
//   A25: "น", A26: "บ", A27: "ป", A28: "ผ", A29: "ฝ", A30: "พ",
//   A31: "ฟ", A32: "ภ", A33: "ม", A34: "ย", A35: "ร", A36: "ล",
//   A37: "ว", A38: "ศ", A39: "ษ", A40: "ส", A41: "ห", A42: "ฬ",
//   A43: "อ", A44: "ฮ",
// };

// // แปลง array ป้ายทะเบียน → string
// function parseLicense(arr: string[]): string {
//   const chars = arr.slice(0, 2).map(code => characterThai[code] || code);
//   const numbers = arr.slice(2);
//   return [...chars, ...numbers].join("");
// }

// export default function CameraViewer() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const imgRef = useRef<HTMLImageElement>(null);

//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [camera, setCamera] = useState<"close" | "camera" | "rtsp">("close");
//   const [noSignal, setNoSignal] = useState(false);
//   const [plates, setPlates] = useState<string[]>([]);
//   //  const videoRefs = useRef<HTMLVideoElement>(document.createElement("video"));
//   // const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));

//   const url = "ws://localhost:3000/ws/rtsp";
//   const [model, setModel] = useState<"true" | "false">("true");

//   //   useEffect(() => {
//   //   // เปิดกล้อง
//   //   navigator.mediaDevices.getUserMedia({ video: true })
//   //     .then(stream => {
//   //       videoRefs.current.srcObject = stream;
//   //       videoRefs.current.play();
//   //     })
//   //     .catch(err => console.error("ไม่สามารถเปิดกล้อง:", err));

//   //   const interval = setInterval(async () => {
//   //     const ctx = canvasRef.current.getContext("2d");
//   //     if (!ctx) return;

//   //     // วาด frame ลง canvas (ขนาดกำหนดเองได้)
//   //     canvasRef.current.width = 400;
//   //     canvasRef.current.height = 300;
//   //     ctx.drawImage(videoRefs.current, 0, 0, 400, 300);

//   //     // แปลงเป็น base64
//   //     const base64Image = canvasRef.current.toDataURL("image/jpeg").split(",")[1];

//   //     try {
//   //       // const res = await axios({
//   //       //   method: "POST",
//   //       //   url: "https://serverless.roboflow.com/new-o9hkx-8rhlc/1",
//   //       //   params: { api_key: "tSBimdbX6MHzfAbfx6zW" },
//   //       //   data: base64Image,
//   //       //   headers: { "Content-Type": "application/x-www-form-urlencoded" }
//   //       // });

//   //       // response: [["A01","A07","5","1","7","7"],["SRN"]]
//   //       const json = res.data;
//   //       if (Array.isArray(json)) {
//   //         const licenseArr = json[0];
//   //         const provinceArr = json[1];

//   //         const licensePlate = parseLicense(licenseArr);
//   //         const province = provinceArr.map((code: string) => provinceMap[code.toUpperCase()] || code);

//   //         setPlates([`${licensePlate} ${province[0]}`]);
//   //       }
//   //     } catch (err) {
//   //       console.error("❌ Roboflow error:", err);
//   //     }
//   //   }, 5000);

//   //   return () => clearInterval(interval);
//   // }, [setPlates]);


//   useEffect(() => {
//   if (camera === "rtsp") {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/api/entry/model/lastest", {
//           method: "GET",
//         });
        
//         const data = await res.json();
//         console.log(data.result.result?.result?.[0].license_plate);

//         const latest = data.result.result?.result?.[0];
//         if (latest) {
//           const license = latest.license_plate;
//           const province = JSON.parse(latest.province)[0];
//           setPlates([`${license} ${province}`]);
//         }
//       } catch (err) {
//         console.error("❌ fetchData error:", err);
//       }
//     };

//     fetchData(); // เรียกครั้งแรก
//   }
  
//   }, [camera]); 

//   useEffect(() => {
//     if (camera === "camera") { 

//     }
//   }, [camera]);

//   useEffect(() => {
//     if (camera === "rtsp") {
//       const fetchData = async (type: string) => {
//         try {
//           const res = await fetch("http://localhost:3000/api/entry/model/push", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ type }),
//           });
//           const data = await res.json();
//         } catch (err) {
//         }
//       };

//       fetchData(model);

//       const interval = setInterval(() => {
//         setModel((prev) => {
//           const next = prev === "true" ? "false" : "true";
//           fetchData(next);
//           return next;
//         });
//       }, 100000);

//       // cleanup
//       return () => clearInterval(interval);
//     }
//   }, [camera, model]);

//   // handle ws สำหรับ rtsp
//   useEffect(() => {
//     if (camera !== "rtsp") return;

//     setNoSignal(false);
//     const ws = new WebSocket(url);
//     ws.binaryType = "arraybuffer";

//     ws.onopen = () => setNoSignal(false);
//     ws.onerror = () => setNoSignal(true);
//     ws.onclose = () => setNoSignal(true);

//     ws.onmessage = (event) => {
//       if (imgRef.current && event.data instanceof ArrayBuffer) {
//         const blob = new Blob([event.data], { type: "image/jpeg" });
//         imgRef.current.src = URL.createObjectURL(blob);
//       }
//     };

//     return () => ws.close();
//   }, [camera, url]);

//   // handle camera ปกติ
//   useEffect(() => {
//     if (camera === "camera") {
//       (async () => {
//         try {
//           let s: MediaStream;
//           try {
//             s = await navigator.mediaDevices.getUserMedia({
//               video: { facingMode: "environment" },
//               audio: false,
//             });
//           } catch {
//             s = await navigator.mediaDevices.getUserMedia({
//               video: true,
//               audio: false,
//             });
//           }

//           if (videoRef.current) {
//             videoRef.current.srcObject = s;
//             await videoRef.current.play().catch(console.error);
//           }
//           setStream(s);
//         } catch (err) {
//           console.error("Camera error:", err);
//         }
//       })();
//     }

//     if (camera === "close") {
//       if (videoRef.current?.srcObject) {
//         (videoRef.current.srcObject as MediaStream)
//           .getTracks()
//           .forEach((t) => t.stop());
//         videoRef.current.srcObject = null;
//       }
//       setStream(null);
//     }

//     return () => {
//       if (stream) stream.getTracks().forEach((t) => t.stop());
//     };
//   }, [camera]);

//   const toggleCamera = () => {
//     setCamera((prev) =>
//       prev === "close" ? "camera" : prev === "camera" ? "rtsp" : "close"
//     );
//   };

//   // แสดงผลตามโหมด
//   return (
//     <div className="flex flex-col items-center space-y-2 mt-15">
//        <h1 className="text-2xl font-bold mb-4">Car Plate Detector</h1>
//       <p>This is a model preview for test performance of the Car Plate Detector API.</p>
//       <div
//         className="flex justify-center items-center place-content-center xl:w-160 max-w-160 aspect-video rounded-lg"
//         style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}
//       >
//         {camera === "rtsp" ? (
//           <img
//             ref={imgRef}
//             alt={noSignal ? "No Signal" : "RTSP Stream"}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         ) : (
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         )}
//       </div>

//       <button
//         onClick={toggleCamera}
//         className="px-4 mt-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//       >
//         {camera === "close"
//           ? "เปิดกล้อง"
//           : camera === "camera"
//           ? "ดู RTSP"
//           : "ปิด"}
//       </button>
     

//       <div className="text-center mt-3">
//         <h2 className="text-md font-bold mb-2">Detected Plates</h2>
//         <div className="border text-left border-gray-300 rounded-lg p-2 w-96 overflow-y-auto">
//           <p className="text-gray-400">
//             ${plates.length > 0 ? plates.join(", ") : "No plates detected yet."}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
