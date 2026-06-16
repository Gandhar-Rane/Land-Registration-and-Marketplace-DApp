import { useEffect, useState } from "react";

function Admin_LandApproval() {
  const [lands, setLands] = useState([]);

  // 🔥 Fetch pending lands
  const fetchLands = () => {
    fetch("http://127.0.0.1:5000/pending-lands")
      .then(res => res.json())
      .then(data => {
        setLands(data.lands);
      });
  };

  useEffect(() => {
    fetchLands();
  }, []);

  // ✅ APPROVE
  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/approve-land/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Approved + stored on blockchain ✅");
        fetchLands(); // refresh
      } else {
        alert(data.error);
      }

    } catch {
      alert("Server error");
    }
  };

  // ❌ REJECT
  const handleReject = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/reject-land/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Rejected ❌");
        fetchLands(); // refresh
      } else {
        alert(data.error);
      }

    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-[90vh] px-10 py-8">

      <h1 className="text-3xl mb-6">Land Approvals</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {lands.map((land) => (
          <div
            key={land[0]}
            className="bg-white/10 backdrop-blur-xl p-5 rounded-xl shadow-lg hover:scale-[1.02] transition"
          >
            {/* USER */}
            <p className="text-sm text-gray-300 mb-1">
              👤 User: {land[11]}
            </p>

            {/* BASIC INFO */}
            <h2 className="text-lg font-semibold mb-2">{land[2]}</h2>

            <p className="text-sm text-gray-300">
              📍 {land[4]}
            </p>

            <p className="text-sm text-gray-300">
              📐 {land[3]}
            </p>

            {/* STATUS */}
            <div className="mt-3">
              <span className="text-xs px-3 py-1 rounded bg-yellow-500/20 text-yellow-300">
                {land[7]}
              </span>
            </div>

            {/* FILE LINKS */}
            <div className="mt-3 flex flex-col gap-1">
              <a
                href={`http://127.0.0.1:5000/${land[5]}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline text-sm"
              >
                View Image
              </a>

              <a
                href={`http://127.0.0.1:5000/${land[6]}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline text-sm"
              >
                View Document
              </a>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex gap-2">

              <button
                onClick={() => handleApprove(land[0])}
                className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 text-sm"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(land[0])}
                className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-sm"
              >
                Reject
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {lands.length === 0 && (
        <p className="text-gray-400 mt-6">No pending lands</p>
      )}
    </div>
  );
}

export default Admin_LandApproval;