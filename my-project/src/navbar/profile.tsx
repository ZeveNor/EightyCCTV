"use client";

import { useEffect, useState } from "react";
import {
  getUserInfo,
  getUserAvatar,
  updateUserProfile,
  uploadUserAvatar,
} from "@/api/profile";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ฟอร์มแก้ไข
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    telephone: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const data = await getUserInfo();
      if (data.status === 200) {
        setUser(data.result);
        setFormData({
          name: data.result.name || "",
          surname: data.result.surname || "",
          telephone: data.result.telephone || "",
        });
      }

      const avatarData = await getUserAvatar();
      if (avatarData.status === 200) {
        setAvatar(avatarData.result.avatar_url);
      }
    } catch (err) {
      console.error("Error fetching user", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await updateUserProfile(formData);
      if (data.status === 200) {
        console.log("Profile updated");
        fetchUser();
      } 
    } catch (err) {
      console.error("Update error", err);
    }
  }

  async function handleUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadUserAvatar(file);
      if (data.status === 200) {
        setAvatar(data.result.avatar_url);
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={avatar || "/default-avatar.png"}
          alt="Profile Avatar"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="mt-3"
          onChange={handleUploadAvatar}
        />
      </div>

      {/* Info */}
      {user && (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Surname</label>
            <input
              type="text"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Telephone</label>
            <input
              type="text"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Email (read-only)</label>
            <input
              type="text"
              value={user.email}
              readOnly
              className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}
