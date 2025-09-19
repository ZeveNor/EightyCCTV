export function getHistory() {
  const token = localStorage.getItem("authToken");

  return fetch("http://localhost:3000/api/slots/log", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch slot history");
      return res.json();
    })
    .then((data) => data.result)
    .catch((err) => {
      console.error("Error fetching slot history:", err);
      return [];
    });
}
