export async function getAllUsers() {
  const token = localStorage.getItem("authToken");
  const res = await fetch("http://localhost:3000/api/user/list", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return data.result; 
}

export async function updateUserProfile(
  id: string,
  { name, surname, telephone, role }: 
  { name?: string; surname?: string; telephone?: string; role?: string }
) {
  const token = localStorage.getItem("authToken");
  const res = await fetch("http://localhost:3000/api/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ id, name, surname, telephone, role }), 
  });
  if (!res.ok) throw new Error("Failed to update user");
  return await res.json();
}


export async function userRemove(id: string) {
  const token = localStorage.getItem("authToken");
  const res = await fetch("http://localhost:3000/api/user/remove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to remove user");
  return await res.json();
}

export async function userUnremove(id: string) {
  const token = localStorage.getItem("authToken");
  const res = await fetch("http://localhost:3000/api/user/unremove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to unremove user");
  return await res.json();
}