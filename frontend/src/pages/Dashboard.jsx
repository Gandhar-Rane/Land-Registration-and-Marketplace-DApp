import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const [lands, setLands] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    fetch(`http://127.0.0.1:5000/my-lands/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        setLands(data.lands);
      });
  }, []);

  // 🔥 Stats calculation
  const total = lands.length;
  const approved = lands.filter(l => l[7] === "approved").length;
  const pending = lands.filter(l => l[7] === "pending").length;

  return (
    <div className="min-h-[90vh] px-10 py-8 space-y-6">

      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          Welcome back 👋
        </h1>
        <p className="text-gray-300">
          Manage your lands, track status and explore marketplace.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-8 shadow-lg">

        {/* 📊 Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat label="Total Lands" value={total} />
          <Stat label="Verified" value={approved} />
          <Stat label="Pending" value={pending} />
          <Stat label="For Sale" value={0} />
        </div>

        {/* ⚡ Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">

          <Card
            title="Register Land"
            desc="Add a new land to blockchain registry"
            link="/register"
            btn="Go"
          />

          <Card
            title="My Lands"
            desc="View and manage your properties"
            link="/my-lands"
            btn="Open"
          />

          <Card
            title="Marketplace"
            desc="Explore lands available for purchase"
            link="/marketplace"
            btn="Explore"
          />

        </div>

        {/* 📜 Real Activity */}
        <div>
          <h3 className="text-lg font-semibold mb-4">My Lands</h3>

          {lands.length === 0 ? (
            <p className="text-gray-400">No lands yet</p>
          ) : (
            <div className="space-y-3">
              {lands.map((land) => (
                <div key={land[0]} className="bg-white/5 p-4 rounded-xl">

                  <h3 className="font-semibold">{land[2]}</h3>
                  <p className="text-sm text-gray-300">📍 {land[4]}</p>
                  <p className="text-sm text-gray-300">📐 {land[3]}</p>

                  <p className={`mt-2 ${
                    land[7] === "approved"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}>
                    {land[7]}
                  </p>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 🔹 Small reusable components
function Stat({ label, value }) {
  return (
    <div className="bg-white/5 p-5 rounded-xl">
      <p className="text-sm text-gray-300 mb-2">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}

function Card({ title, desc, link, btn }) {
  return (
    <div className="bg-white/5 p-5 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-4">{desc}</p>
      <Link to={link} className="px-4 py-2 bg-blue-500 rounded-lg">
        {btn}
      </Link>
    </div>
  );
}

export default Dashboard;