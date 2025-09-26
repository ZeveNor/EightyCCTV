"use client";

import { useEffect, useState } from "react";
import { getSearchByOwner, getUserInfo } from "@/api/plate/searchmember";

export default function PlateSearchMember() {
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const v = await getSearchByOwner();
      const u = await getUserInfo();

      setVehicles(v || []);
      setUsers(u || []);
      setFiltered(v || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(vehicles);
      return;
    }
    const s = search.toLowerCase();
    const res = vehicles.filter((item: any) => {
      return (
        (item.name || "").toLowerCase().includes(s) ||
        (item.surname || "").toLowerCase().includes(s) ||
        ((item.name + " " + item.surname) || "").toLowerCase().includes(s) ||
        (item.license_plate || "").toLowerCase().includes(s) ||
        (item.brand || "").toLowerCase().includes(s) ||
        (item.model || "").toLowerCase().includes(s) ||
        (item.color || "").toLowerCase().includes(s)
      );
    });
    setFiltered(res);
  }, [search, vehicles]);

  // helper: หา user ที่ match กับรถ
  const findUser = (name: string, surname: string) => {
    return users.find(
      (u: any) =>
        u.name?.toLowerCase() === name?.toLowerCase() &&
        u.surname?.toLowerCase() === surname?.toLowerCase()
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Plate</h2>

      {/* Search box */}
      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type a keyword..."
          className="rounded px-3 py-2 w-full max-w-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Card list */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No data found</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((item, idx) => {
            const user = findUser(item.name, item.surname);

            return (
              <div
                key={idx}
                className="w-full rounded-xl border border-gray-200 shadow-lg bg-white hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                {/* Header row */}
                <div className="p-5 border-b flex items-center justify-between">
                  <div className="text-2xl font-bold text-black-600">
                    {item.license_plate || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-row gap-6 p-5 text-gray-700">
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Brand:</span> {item.brand}
                    </p>
                    <p>
                      <span className="font-semibold">Model:</span> {item.model}
                    </p>
                    <p>
                      <span className="font-semibold">Color:</span>{" "}
                      <span
                        className="inline-block px-2 py-0.5 rounded text-white text-xs"
                        style={{ backgroundColor: item.color || "gray" }}
                      >
                        {item.color}
                      </span>
                    </p>
                  </div>

                  {/* Owner info */}
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Owner:</span> {item.name}{" "} {item.surname}
                    </p>
                    {user && (
                      <>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          <a
                            href={`mailto:${user.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {user.email}
                          </a>
                        </p>
                        <p>
                          <span className="font-semibold">Tel:</span>{" "}
                          <a
                            href={`tel:${user.telephone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {user.telephone}
                          </a>
                        </p>
                        <p>
                          <span className="font-semibold">Role:</span>{" "}
                          {user.role}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
