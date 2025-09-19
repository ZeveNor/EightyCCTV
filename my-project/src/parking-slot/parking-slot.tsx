import React, { useEffect, useState, useRef } from "react";
import "./parking.css";
import { getSlotData } from "@/api/slot/slot";

const POLL_URL = "http://localhost:3000/api/slots/status";

function idOf(r: string, c: number) {
  return `${r}${c}`;
}

function Car() {
  return (
    <div className="car">
      <div className="shadow" />
      <div className="shell" />
      <div className="nose" />
      <div className="tail" />
      <div className="roof" />
      <div className="pillarA" />
      <div className="pillarB" />
      <div className="pillarC" />
      <div className="side left" />
      <div className="side right" />
      <div className="mirror left" />
      <div className="mirror right" />
      <div className="doors" />
      <div className="head l" />
      <div className="head r" />
      <div className="tailLamp l" />
      <div className="tailLamp r" />
      <div className="badge" />
      <div className="wheel fl" />
      <div className="wheel fr" />
      <div className="wheel rl" />
      <div className="wheel rr" />
    </div>
  );
}

export default function ParkingSlot() {
  const [selected, setSelected] = useState<string | null>(null);
  const [occupied, setOccupied] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<{ rows: string[]; cols: number[] }>({
    rows: [],
    cols: [],
  });
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    let intervalId: number | undefined;

    // pass setLayout so the poller updates rows/cols dynamically
    let slotData = getSlotData(POLL_URL, mountedRef, setOccupied, setLayout);
    slotData();
  
    intervalId = window.setInterval(slotData, 2000);

    return () => {
      mountedRef.current = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  function toggleSelect(id: string) {
    setSelected((s) => (s === id ? null : id));
  }

  const ROWS = layout.rows;
  const COLS = layout.cols;

  return (
    <div className="wrap">
      <div className="lot">
        <div className="floor">
          <div className="grid" id="grid">
            {ROWS.length === 0 || COLS.length === 0 ? null : ROWS.map((r) =>
              COLS.map((c) => {
                const id = idOf(r, c);
                const isOccupied = occupied.has(id);
                const classes = ["slot"];
                if (isOccupied) classes.push("unavailable");
                if (selected === id) classes.push("active");
                return (
                  <button
                    key={id}
                    className={classes.join(" ")}
                    data-id={id}
                    onClick={() => toggleSelect(id)}
                    aria-pressed={selected === id}
                    type="button"
                  >
                    <div className="id">{id}</div>
                    <div className="bumper top" />
                    {isOccupied && <Car />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

