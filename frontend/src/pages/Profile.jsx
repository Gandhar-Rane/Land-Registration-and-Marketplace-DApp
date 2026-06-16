import { useEffect, useState } from "react";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  const [originalUser, setOriginalUser] = useState({});

  const storedUser = JSON.parse(localStorage.getItem("user"));

  // 🔥 Fetch user from DB
  useEffect(() => {
    if (!storedUser?.user_id) return;

    fetch(`http://127.0.0.1:5000/profile/${storedUser.user_id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setOriginalUser(data);
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🔥 Save to backend
  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/update-profile/${storedUser.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            country: user.country,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated ✅");
        setIsEditing(false);
        setOriginalUser(user);
      } else {
        alert(data.error || "Update failed");
      }

    } catch {
      alert("Server error");
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setIsEditing(false);
  };

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">

      {/* 🔥 CENTER CARD */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg">

        {/* 👤 AVATAR */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/20 text-4xl">
            👤
          </div>
        </div>

        <h2 className="text-2xl text-center mb-6">My Profile</h2>

        {/* NAME */}
        <input
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Full Name"
          className="w-full mb-4 p-3 rounded bg-white/20 outline-none"
        />

        {/* EMAIL */}
        <input
          value={user.email}
          disabled
          className="w-full mb-4 p-3 rounded bg-white/10 text-gray-400"
        />

        {/* PHONE */}
        <input
          name="phone"
          value={user.phone}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Phone"
          className="w-full mb-4 p-3 rounded bg-white/20 outline-none"
        />

        {/* COUNTRY */}
        <input
          name="country"
          value={user.country}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Country"
          className="w-full mb-6 p-3 rounded bg-white/20 outline-none"
        />

        {/* 🔥 ACTION BUTTONS */}
        {!isEditing ? (
          <div className="space-y-3">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-3 bg-blue-500 rounded-xl"
            >
              Edit Profile
            </button>

            {/* 🔥 LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-500 rounded-xl hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-green-500 rounded-xl"
            >
              Save
            </button>

            <button
              onClick={handleCancel}
              className="w-full py-3 bg-gray-500 rounded-xl"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;