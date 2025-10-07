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


  return (
    <div className="">
      <RotateWarning />
      <div className="mockup-browser md:pl-6 pl-0 place-content-center bg-white" >
        <img className="md:w-[80vw] w-[80vw] md:h-[90vh] h-[70vh] bg-white" ref={imgRef} alt="กล้องวงจรปิดออฟไลน์" />
      </div>
    </div>
  );
}

export function RotateWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function checkOrientation() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setShow(true);
      } else {
        setShow(false);
      }
    }

    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/80 text-white text-2xl text-center p-6">
      กรุณาหมุนโทรศัพท์เป็นแนวนอน
    </div>
  );
}