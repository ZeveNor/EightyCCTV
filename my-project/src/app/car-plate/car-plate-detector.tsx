import { useEffect, useRef, useState } from "react";

export default function CarPlateDetector() {
  const [plates, setPlates] = useState<string[]>([]);

  return (
    <div
      className="flex flex-col items-center pt-10 bg-white overflow-hidden"
      style={{ height: "91vh" }}
    >
      <h1 className="text-2xl font-bold mb-4">Car Plate Detector</h1>
      <p>
        This is a model preview for test performance of the Car Plate Detector
        API.
      </p>
      <label className="input my-5">
        <span className="label">ws://</span>
        <input type="text" placeholder="localhost:3000/ws/rtsp" disabled />
      </label>
      <div>
        <MJPEGViewer url="ws://localhost:3000/ws/rtsp" />
      </div>
      <div className="mt-5 text-center">
        <h2 className="text-md font-bold mb-2">Detected Plates</h2>
        <div className="border text-left border-gray-300 rounded-lg p-2 w-96 overflow-y-auto">
          <p className="text-gray-400">
            {plates.length > 0 ? plates.join(", ") : "No plates detected yet."}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MJPEGViewer({ url }: { url: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        console.log("String message received from WebSocket.");
        
        try {
          const msg = JSON.parse(event.data);
          console.log("Control:", msg);
        } catch {
          console.log("Text:", event.data);
        }
        return;
      }

      if (event.data instanceof ArrayBuffer && imgRef.current) {
        
        const blob = new Blob([event.data], { type: "image/jpeg" });
        imgRef.current.src = URL.createObjectURL(blob);
      }
    };

    return () => ws.close();
  }, [url]);

  return (
    <div className="pr-6">
      <div
        className="flex justify-center items-center place-content-center xl:w-160 max-w-160 aspect-video rounded-lg"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}
      >
        {connected ? (
          <img
            ref={imgRef}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            alt="Stream"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <div>No Signal</div>
            <div className="text-gray-400">
              WebSocket not serving fresh video.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
