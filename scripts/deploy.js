const { ethers } = require("hardhat");

async function main() {
   const SupplyChain = await ethers.getContractFactory("SupplyChain");
   console.log("Deploying SupplyChain contract...");

   const supplyChain = await SupplyChain.deploy();
   await supplyChain.deployed();

   console.log("SupplyChain contract deployed at:", supplyChain.address);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
