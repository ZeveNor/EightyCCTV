export function getHistory() {
  const token = localStorage.getItem("authToken");

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slots/log`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch slot history");
      const data = await res.json();
      return data;
    })
    .then((data) => data.result)
    .catch((err) => {
      console.error("Error fetching slot history:", err);
      return [];
    });
}
