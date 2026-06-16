import { useEffect, useState } from "react";
import { connectWallet, buyLandOnChain } from "../blockchain/contract";

// 🔥 LOCAL IMAGES
const images = [
  "/Land_cards/land1.jpg",
  "/Land_cards/land2.jpg",
  "/Land_cards/land3.jpg",
  "/Land_cards/land4.jpg",
  "/Land_cards/land5.jpg",
  "/Land_cards/land6.jpg",
  "/Land_cards/land7.jpg",
  "/Land_cards/land8.jpg",
];

function Marketplace() {
  const [lands, setLands] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null); // 🔥 UX improvement

  const fetchLands = () => {
    fetch("http://127.0.0.1:5000/market-lands")
      .then(res => res.json())
      .then(data => setLands(data.lands));
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const filteredLands = lands.filter((land) =>
    land[2].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[90vh] px-10 py-8">

      {/* HEADER */}
      <h1 className="text-3xl mb-6">Marketplace</h1>

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

          const randomImage =
            images[Math.floor(Math.random() * images.length)];

          return (
            <div
              key={land[0]}
              className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition"
            >

              {/* IMAGE */}
              <div className="relative">
                <img
                  src={randomImage}
                  className="w-full h-48 object-cover"
                  alt="land"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">

                {/* OWNER */}
                <p className="text-sm text-gray-300">
                  👤 {land[11]}
                </p>

                {/* TITLE */}
                <h2 className="text-lg font-semibold">{land[2]}</h2>

                {/* DETAILS */}
                <p className="text-sm text-gray-300">📍 {land[4]}</p>
                <p className="text-sm text-gray-300">📐 {land[3]}</p>

                {/* PRICE */}
                <p className="text-blue-400 font-semibold">
                  {land[10]} ETH
                </p>

                {/* ACTION */}
                <div className="flex justify-between items-center mt-3">

                  <span className="text-xs px-3 py-1 rounded bg-green-500/20 text-green-300">
                    Available
                  </span>

                  <button
                    disabled={loadingId === land[0]}
                    className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                    onClick={async () => {
                      try {
                        setLoadingId(land[0]);

                        const user = JSON.parse(localStorage.getItem("user"));

                        if (!user) {
                          alert("Please login first");
                          return;
                        }

                        // 🔥 1. Connect MetaMask (popup will show)
                        const buyerAddress = await connectWallet();

                        if (!buyerAddress) {
                          throw new Error("Wallet connection failed");
                        }

                        // 🔥 2. Blockchain BUY
                        await buyLandOnChain(land[0], land[10]);

                        // 🔥 3. Backend sync
                        await fetch(
                          `http://127.0.0.1:5000/buy-land/${land[0]}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              buyer_id: user.user_id,
                            }),
                          }
                        );

                        alert("Transaction successful 🎉");

                        fetchLands(); // 🔥 no full reload

                      } catch (err) {
                        console.error("BUY ERROR 👉", err);

                        if (err.message.includes("MetaMask")) {
                          alert("Please install MetaMask");
                        } else if (err.message.includes("user rejected")) {
                          alert("Transaction cancelled");
                        } else {
                          alert("Transaction failed ❌");
                        }

                      } finally {
                        setLoadingId(null);
                      }
                    }}
                  >
                    {loadingId === land[0] ? "Processing..." : "Buy"}
                  </button>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* EMPTY */}
      {filteredLands.length === 0 && (
        <p className="text-gray-400 mt-6">No lands listed yet</p>
      )}

    </div>
  );
}

export default Marketplace;