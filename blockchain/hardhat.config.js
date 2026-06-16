require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/Y3IsDMqCiaFUguhC9SyRC",
      accounts: ["e7fafcdd522f59202b28e1d22a54dfcdd285a4aa55a807536b15ff95b3d70d96"]
    }
  }
};