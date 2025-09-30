export function getHistory() {
  const token = localStorage.getItem("authToken");

  return fetch("http://localhost:3000/api/entry", {
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
