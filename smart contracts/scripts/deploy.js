const hre = require("hardhat");

async function main() {
  const WELCOMINT = await hre.ethers.getContractFactory("Welcomint");

  const Welcomint = await WELCOMINT.deploy();

  console.log(
    `Deployed to ${Welcomint.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
