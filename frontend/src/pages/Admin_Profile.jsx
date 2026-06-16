function Admin_Profile() {

  const admin = {
    name: "Admin",
    email: "gandhar@gmail.com"
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg">

        {/* 👤 Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/20 text-4xl">
            👤
          </div>
        </div>

        <h2 className="text-2xl text-center mb-6">Admin Profile</h2>

        <input
          value={admin.name}
          disabled
          className="w-full mb-4 p-3 rounded bg-white/10 text-gray-400"
        />

        <input
          value={admin.email}
          disabled
          className="w-full mb-6 p-3 rounded bg-white/10 text-gray-400"
        />

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 rounded-xl hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Admin_Profile;