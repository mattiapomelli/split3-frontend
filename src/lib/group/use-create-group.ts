import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAccount, useSigner } from "wagmi";

import { GroupAbi, GroupBytecode } from "@abis/group";

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useCreateGroup = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

  const { data: signer } = useSigner();

  return useMutation(
    async () => {
      if (!address || !signer) throw new Error("No address");

      // Deploy the contract
      const factory = new ethers.ContractFactory(
        GroupAbi,
        GroupBytecode,
        signer,
      );

      const stakeAmount = ethers.utils.parseEther("0.01");
      const initialMembers = [address];
      const contract = await factory.deploy(stakeAmount, initialMembers);

      await contract.deployed();

      console.log("Contract deployed to:", contract.address);
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
