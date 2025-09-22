"use client";

import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect } from "react";
import { getAllUsers } from "@/api/auth/member";

export default function MembersManagement() {
  useEffect(() => {
    let grid: Grid | null = null;

    const fetchData = async () => {
      const data = await getAllUsers();
      const users = Array.isArray(data.result) ? data.result : [];
      const container = document.getElementById("slot-history-table");
      if (container) container.innerHTML = "";

      grid = new Grid({
        columns: [ "id", "name", "surname", "email", "telephone", "role","deleted_at","Actions"],
        

        style: {
          table: {
            'font-size': '10px'
          }
        },
        pagination: {
          limit: 8,
          summary: false
        },
        search: true,
        sort: true,
        resizable: true
      });

      grid.render(container!);
    };

    fetchData();

    return () => {
      if (grid) {
        grid.destroy();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">MEMBERS</h2>
      <div id="slot-history-table"></div>
    </div>
  );
}
