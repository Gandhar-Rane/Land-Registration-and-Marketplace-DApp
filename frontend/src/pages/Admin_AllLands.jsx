import { useEffect, useState } from "react";

function Admin_AllLands() {
  const [lands, setLands] = useState([]);

  const fetchApprovedLands = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/approved-lands");
      const data = await res.json();

      console.log("API DATA:", data); // 🔥 DEBUG

      setLands(data.lands || []);
    } catch (err) {
      console.error("Error fetching approved lands:", err);
    }
  };

  useEffect(() => {
    fetchApprovedLands();
  }, []);

  return (
    <div className="min-h-[90vh] px-10 py-8">
      <h1 className="text-3xl mb-6">All Lands</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {lands.map((land) => (
          <div
            key={land[0]}
            className="bg-white/10 backdrop-blur-xl p-5 rounded-xl shadow-lg"
          >
            <p className="text-sm text-gray-300 mb-1">
  👤 Owner: {land[11]}
</p>
            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-2">{land[2]}</h2>

            {/* DETAILS */}
            <p className="text-sm text-gray-300">📍 {land[4]}</p>
            <p className="text-sm text-gray-300">📐 {land[3]}</p>

            {/* STATUS */}
            <div className="mt-3">
              <span className="text-xs px-3 py-1 rounded bg-green-500/20 text-green-300">
                Approved
              </span>
            </div>

          </div>
        ))}

      </div>

      {/* EMPTY */}
      {lands.length === 0 && (
        <p className="text-gray-400 mt-6">No approved lands yet</p>
      )}
    </div>
  );
}

export default Admin_AllLands;