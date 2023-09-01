import {ethers} from "hardhat";

async function main() {
    const [deployer, w1, w2, w3] = await ethers.getSigners();

    // Replace with the current price of 1 ETH in USD
    const ethToUsdPrice = 1628; // Example: 1 ETH = $3000 USD

    // Specify the desired amount in USD
    const desiredAmountInUsd = 100; // Example: $100 USD

    // Calculate the equivalent amount in ETH
    const requiredAmountInEth = ethers.utils.parseUnits(
        (desiredAmountInUsd / ethToUsdPrice).toString(), // Convert USD to ETH
        18 // 18 decimal places for ETH
    );

    console.log("Deploying SplitWiseGroup contract with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Load the contract's ABI and bytecode
    const SplitWiseGroup = await ethers.getContractFactory("SplitWiseGroup");

    // Deploy the contract
    const splitWiseGroup = await SplitWiseGroup.deploy(
        requiredAmountInEth, // Replace with your required amount
        [w1.address, w2.address, w3.address] // Replace with your initial members' addresses
    );

    await splitWiseGroup.deployed();

    // Print the deployed contract address
    console.log("SplitWiseGroup contract deployed to address:", splitWiseGroup.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });