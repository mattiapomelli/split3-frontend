import { ethers } from "ethers";

export const formatAmount = (amount: number) => {
  return ethers.utils.formatEther(amount.toString());
};

export const parseAmount = (amount: string) => {
  return ethers.utils.parseEther(amount);
};
