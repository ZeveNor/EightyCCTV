// ดึงข้อมูลผู้ใช้
export async function getUserInfo() {
  const token = localStorage.getItem("authToken");
  const res = await fetch("http://localhost:3000/api/user/info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return await res.json();
}

// ดึง Avatar
export async function getUserAvatar() {
  const token = localStorage.getItem("authToken");
  const res = await fetch("http://localhost:3000/api/user/avatar", {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user avatar");
  return await res.json();
}

// อัปเดตโปรไฟล์
export async function updateUserProfile(formData: {
  name?: string;
  surname?: string;
  telephone?: string;
}) {
  const token = localStorage.getItem("authToken");

  const res = await fetch("http://localhost:3000/api/user/updateProfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
}

// อัปโหลด Avatar
export async function uploadUserAvatar(file: File) {
  const token = localStorage.getItem("authToken");
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("http://localhost:3000/api/user/avatar", {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload avatar");
  return await res.json();
}
