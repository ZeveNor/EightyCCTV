export async function getAllVehicles() {
    const token = localStorage.getItem("authToken");
    const res = await fetch("http://localhost:3000/api/vehicle/all", {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch vehicles");

    const data = await res.json();

    return Array.isArray(data.result) ? data.result : [];
}

export async function addVehicles(vehicle: {
    userId: number;
    plate: string;
    province: string;
    brand: string;
    model: string;
    color: string;
}) {
    const token = localStorage.getItem("authToken");

    const res = await fetch("http://localhost:3000/api/vehicle/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(vehicle),
    });
  if (!res.ok) throw new Error("Failed to add vehicle");
  return await res.json();
}

interface UpdateVehicleInterface {
    plate: string;
    newPlate: string;
    brand: string;
    model: string;
    color: string;
    province: string;
}
export async function updateVehicles({ plate, newPlate, brand, model, color, province }: UpdateVehicleInterface & { province: string }) {
    const token = localStorage.getItem("authToken");
    const res = await fetch("http://localhost:3000/api/vehicle/updatePlate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
            plate,
            new_plate: newPlate,
            brand,
            model,
            color,
            province, 
        }),
    });
    if (!res.ok) throw new Error("Failed to update vehicle");
    return await res.json();
}


export async function removeVehicles(plate: string) {
    const token = localStorage.getItem("authToken");
    const res = await fetch("http://localhost:3000/api/vehicle/removePlate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ plate }),
    });
    if (!res.ok) throw new Error("Failed to remove vehicle");
    return await res.json();
}

export async function unremoveVehicles(plate: string) {
    const token = localStorage.getItem("authToken");
    const res = await fetch("http://localhost:3000/api/vehicle/unremovePlate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ plate }),
    });
    if (!res.ok) throw new Error("Failed to unremove vehicle");
    return await res.json();
}