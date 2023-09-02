import { useMutation } from "@tanstack/react-query";
import { ethers, BigNumber } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { GroupAbi, GroupBytecode } from "@abis/group";
import { supabaseClient } from "app/db";

interface CreateGroupParams {
  stakeAmount: BigNumber;
  initialMembers: string[];
  name: string;
}

interface UseCreateRequestOptions {
  onSuccess?: (id: number) => void;
}

export const useCreateGroup = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  return useMutation(
    async ({ stakeAmount, initialMembers, name }: CreateGroupParams) => {
      if (!address || !signer || !chain) throw new Error("No address");

      // Deploy the contract
      const factory = new ethers.ContractFactory(
        GroupAbi,
        GroupBytecode,
        signer,
      );

      const contract = await factory.deploy(stakeAmount, initialMembers);

      await contract.deployed();

      // const requiredAmount = await contract.requiredAmount();

      const { data, error } = await supabaseClient
        .from("group")
        .insert({
          address: contract.address,
          chain: chain?.name,
          owner: address,
          required_amount: Number(stakeAmount.toString()),
          name,
        })
        .select("*")
        .single();

      if (error) throw error;

      return data.id;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
