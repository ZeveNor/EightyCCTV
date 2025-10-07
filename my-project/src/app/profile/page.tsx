"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
  getUserInfo,
  getUserAvatar,
  updateUserProfile,
  uploadUserAvatar,
} from "@/api/profile";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      toast.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้", {
        position: "bottom-right",
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await updateUserProfile(formData);
      if (data.status === 200) {
        toast.success("บันทึกข้อมูลสำเร็จ!", {
          position: "bottom-right",
          theme: "colored",
          transition: Bounce,
        });
        fetchUser();
      } else {
        toast.success("อัปโหลดโปรไฟล์สำเร็จ!", {
          position: "bottom-right",
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error("Update error", err);
      toast.error("เบอร์โทรถูกใช้ไปแล้ว", {
        position: "bottom-right",
        theme: "colored",
        transition: Bounce,
      });
    }
  }

  async function handleUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadUserAvatar(file);
      if (data.status === 200) {
        setAvatar(data.result.avatar_url);
        toast.success("อัปโหลดรูปโปรไฟล์สำเร็จ!", {
          position: "bottom-right",
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.success("อัปโหลดโปรไฟล์สำเร็จ!", {
          position: "bottom-right",
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error("Upload error", err);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดรูป", {
        position: "bottom-right",
        theme: "colored",
        transition: Bounce,
      });
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div
      className="flex justify-center items-center"
      style={{
        width: "100vw",
        height: "100vh",
        background: "white",
        backgroundImage: `
          linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.1) 40%, transparent 80%)
        `,
        backgroundSize: "32px 32px, 32px 32px, 100% 100%",
      }}
    >
      <div
        className="relative max-w-2xl p-10 shadow-lg border rounded-xl bg-white"
        style={{ height: "fit-content" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">USER PROFILE</h2>

        <div className="absolute top-8 left-8 text-sm text-gray-500">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-4 py-2 btn-neutral btn-outline border rounded hover:bg-neutral hover:text-white"
          >
            ย้อนกลับ
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatar || "https://static.vecteezy.com/system/resources/previews/024/983/914/large_2x/simple-user-default-icon-free-png.png"}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full object-cover border-1"
          />
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="mt-3 file-input"
            onChange={handleUploadAvatar}
          />
        </div>

        {/* Info */}
        {user && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block font-semibold">ชื่อ</label>
              <input
                type="text"
                value={formData.name}
                required
                placeholder="ชื่อ"
                pattern="^[A-Za-zก-ฮ]+$"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                title="Only letters"
                className="w-full border p-2 rounded input"
              />
            </div>

            <div>
              <label className="block font-semibold">นามสกุล</label>
              <input
                type="text"
                required
                placeholder="นามสกุล"
                pattern="^[A-Za-zก-ฮ]+$"
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                title="Only letters"
                className="w-full border p-2 rounded input"
              />
            </div>

            <div>
              <label className="block font-semibold">เบอร์โทรศัพท์</label>
              <input
                type="text"
                value={formData.telephone}
                required
                minLength={9}
                maxLength={10}
                placeholder="เบอร์โทรศัพท์"
                title="Must be 10 digits"
                pattern="[0-9]*"
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                className="tabular-nums w-full border p-2 rounded input"
              />
              <p className="validator-hint">Must be 9-10 digits</p>
            </div>

            <div>
              <label className="block font-semibold">อีเมล</label>
              <input
                type="text"
                value={user.email}
                readOnly
                disabled
                className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed input"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 w-100 bg-neutral text-white rounded hover:bg-white hover:text-neutral border border-neutral hover:border-neutral"
            >
              บันทึก
            </button>
          </form>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
