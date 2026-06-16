import { useEffect, useState } from "react";

function Admin_Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    users: 0,
  });

  const fetchStats = async () => {
    try {
      // 🔥 LAND STATS
      const landRes = await fetch("http://127.0.0.1:5000/admin-stats");
      const landData = await landRes.json();

      // 🔥 USER COUNT
      const userRes = await fetch("http://127.0.0.1:5000/users-count");
      const userData = await userRes.json();

      setStats({
        total: landData.total || 0,
        pending: landData.pending || 0,
        approved: landData.approved || 0,
        users: userData.count || 0,
      });

    } catch (err) {
      console.error("❌ Stats Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-[90vh] px-10 py-8 space-y-6">

      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-8 shadow-lg">

        {/* 🔥 STATS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Lands", value: stats.total },
            { label: "Pending Approvals", value: stats.pending },
            { label: "Verified Lands", value: stats.approved },
            { label: "Users", value: stats.users },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/5 p-5 rounded-xl hover:bg-white/10 transition"
            >
              <p className="text-sm text-gray-300 mb-2">{item.label}</p>
              <h2 className="text-3xl font-bold">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white/5 p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Land Approvals</h3>
            <p className="text-sm text-gray-300 mb-3">
              Review pending land registrations
            </p>
          </div>

          <div className="bg-white/5 p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">All Lands</h3>
            <p className="text-sm text-gray-300 mb-3">
              View complete registry
            </p>
          </div>

          <div className="bg-white/5 p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-sm text-gray-300 mb-3">
              Manage platform users
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Admin_Dashboard;