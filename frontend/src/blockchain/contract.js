import { ethers } from "ethers";
import contractData from "./LandRegistry.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// 🔌 Get contract (SAFE + CONTROLLED)
export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, signer);
};

// 🔐 Connect wallet (ONLY when needed)
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
};

// 💸 BUY LAND (BLOCKCHAIN)
export const buyLandOnChain = async (landId, priceInEth) => {
  try {
    const contract = await getContract();

    const tx = await contract.buyLand(landId, {
      value: ethers.parseEther(priceInEth.toString()),
    });

    await tx.wait();

    return tx;
  } catch (err) {
    console.error("Blockchain Buy Error:", err);
    throw err;
  }
};

// 🏷️ LIST LAND (BLOCKCHAIN)
export const listLandOnChain = async (landId, priceInEth) => {
  try {
    const contract = await getContract();

    const tx = await contract.listForSale(
      landId,
      ethers.parseEther(priceInEth.toString())
    );

    await tx.wait();

    return tx;
  } catch (err) {
    console.error("Blockchain List Error:", err);
    throw err;
  }
};