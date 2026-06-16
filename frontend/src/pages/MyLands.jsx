import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connectWallet, listLandOnChain } from "../blockchain/contract";

function MyLands() {
  const [lands, setLands] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedLand, setSelectedLand] = useState(null);
  const [price, setPrice] = useState("");

  const fetchLands = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch(`http://127.0.0.1:5000/my-lands/${user.user_id}`)
      .then(res => res.json())
      .then(data => setLands(data.lands));
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const filteredLands = lands.filter((land) =>
    land[2].toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (land) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/update-land/${land[0]}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: land[2],
            area: land[3],
            location: land[4],
          }),
        }
      );

      if (res.ok) {
        alert("Updated successfully ✅");
        fetchLands();
        setExpanded(null);
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-[90vh] px-10 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">My Lands</h1>

        <Link to="/register" className="px-5 py-2 bg-blue-500 rounded-lg">
          + Register
        </Link>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3 mb-8 p-3 rounded bg-white/20"
      />

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredLands.map((land) => {
          const isExpanded = expanded === land[0];

          // 🔥 STATUS COLORS
          const statusStyles = {
            approved: "bg-green-500/20 text-green-300",
            rejected: "bg-red-500/20 text-red-300",
            sold: "bg-gray-500/20 text-gray-300",
            owned: "bg-purple-500/20 text-purple-300",
          };

          return (
            <div key={land[0]} className="bg-white/10 p-5 rounded-xl">

              <h2 className="text-lg font-semibold">{land[2]}</h2>
              <p>📍 {land[4]}</p>
              <p>📐 {land[3]}</p>

              {/* 🔥 STATUS */}
              <span className={`text-xs px-3 py-1 rounded ${statusStyles[land[7]] || "bg-yellow-500/20 text-yellow-300"}`}>
                {land[7]}
              </span>

              {/* 🔥 LISTED BADGE */}
              {land[10] && land[7] !== "sold" && (
                <span className="ml-2 text-xs px-3 py-1 rounded bg-blue-500/20 text-blue-300">
                  Listed ({land[10]} ETH)
                </span>
              )}

              {/* 🔥 BUTTONS */}
              <div className="flex gap-3 mt-3 flex-wrap">

                {/* ONLY approved can list */}
                {land[7] === "approved" && !land[10] && (
                  <button
                    onClick={() => setSelectedLand(land)}
                    className="text-sm px-3 py-1 bg-blue-500 rounded"
                  >
                    List for Sale
                  </button>
                )}

                <button
                  onClick={() =>
                    setExpanded(isExpanded ? null : land[0])
                  }
                  className="text-sm bg-blue-500 px-3 py-1 rounded"
                >
                  {isExpanded ? "Close" : "View More"}
                </button>
              </div>

              {/* 🔥 EXPANDED */}
              {isExpanded && (
                <div className="mt-4 space-y-3">
                  <a href={`http://127.0.0.1:5000/${land[5]}`} target="_blank">
                    View Image
                  </a>
                  <br />
                  <a href={`http://127.0.0.1:5000/${land[6]}`} target="_blank">
                    View Document
                  </a>

                  <button
                    onClick={() => handleSave(land)}
                    className="w-full bg-green-500 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* 🔥 SELL MODAL */}
      {selectedLand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl w-96">

            <h2 className="mb-4">
              Set Price for {selectedLand[2]}
            </h2>

            <input
              type="number"
              placeholder="Price in ETH"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-white/20"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setSelectedLand(null);
                  setPrice("");
                }}
                className="px-4 py-2 bg-gray-500 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    if (!price) return;

                    await connectWallet();
                    await listLandOnChain(selectedLand[0], price);

                    await fetch(
                      `http://127.0.0.1:5000/list-for-sale/${selectedLand[0]}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ price }),
                      }
                    );

                    alert("Listed successfully 🚀");
                    fetchLands();

                  } catch (err) {
                    console.error(err);
                    alert("Listing failed ❌");
                  }

                  setSelectedLand(null);
                  setPrice("");
                }}
                className="px-4 py-2 bg-green-500 rounded"
              >
                Confirm
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MyLands;