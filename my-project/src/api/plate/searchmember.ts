export function getSearchByOwner() {
  const token = localStorage.getItem("authToken");

  return fetch("http://localhost:3000/api/vehicle/all", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch plate history");
      const data = await res.json();
      return data.result?.result?.result || [];
    })
    .catch((err) => {
      console.error("Error fetching plate history:", err);
      return [];
    });
}

export async function getUserInfo() {
  const token = localStorage.getItem("authToken");

  return fetch("http://localhost:3000/api/user/list", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch user info");
      const data = await res.json();
      return data.result?.result;
    })
    .catch((err) => {
      console.error("Error fetching user info:", err);
      return null;
    });
}

export default {
  getSearchByOwner,
  getUserInfo,
}