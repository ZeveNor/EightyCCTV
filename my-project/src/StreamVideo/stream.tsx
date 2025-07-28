import React, { useEffect, useRef, useState } from "react";

export default function MJPEGViewer({ url }: { url: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [noSignal, setNoSignal] = useState(false);

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

  if (noSignal) {
    return (
      <div className="mockup-browser" style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}>
        <img alt="Camera not found" className="" />
      </div>
    );
  }

  return (
    <div className="pr-6">
      <div className="mockup-browser grid place-content-center w-full" style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}>
        <img ref={imgRef} alt="Camera not found" className="" />
      </div>
    </div>
  );
}