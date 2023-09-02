import { run } from "hardhat";

interface VerifyTask {
  address: string;
  constructorArguments: any[];
}

async function verify(verifyTasks: VerifyTask[]) {
  for (const verifyTask of verifyTasks) {
    console.log("Verifying contract: ", verifyTask.address);
    try {
      await run("verify:verify", verifyTask);
      console.log("Contract " + verifyTask.address + " successfully verified!");
    } catch (error: any) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log(verifyTask.address, " has been already verified");
      } else {
        console.error(error);
      }
    }
  }
}

verify([
  {
    address: "0x98b0aE69d17e31b769576947b2C7DB1702007b2f",
    constructorArguments: [
      "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
      "The Best Group",
      1000000000000,
      "0x41F5DE2Ae15c06a2cf70C40b89bD5b8eaD5584ab",
    ],
  },
])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export default verify;
