interface VehicleInterface {
  userId: number;
  plate: string;
  brand: string;
  model: string;
  color: string;
}

export async function addMyVehicleById({ userId, plate, brand, model, color }: VehicleInterface) {
  const token = localStorage.getItem("authToken");
  const res = await fetch("http://localhost:3000/api/vehicle/addMy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      user_id: userId,
      plate,
      brand,
      model,
      color,
    }),
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
}

export async function updateVehicles({ plate, newPlate, brand, model, color }: UpdateVehicleInterface) {
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
      color 
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

export async function getVehiclesByUserId(userId: number) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`http://localhost:3000/api/vehicle/my`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch vehicles");

  const data = await res.json();

  return Array.isArray(data) ? data : [];
}
