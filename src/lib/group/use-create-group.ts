import { useMutation } from "@tanstack/react-query";
import { ethers, BigNumber } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { GroupAbi, GroupBytecode } from "@abis/group";
import { deploySafe } from "@lib/safe";
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

      console.log("Initial members: ", initialMembers);

      const safe = await deploySafe(signer, initialMembers);
      const safeAddress = await safe.getAddress();

      console.log("Safe address: ", safeAddress);

      // Deploy the contract
      const factory = new ethers.ContractFactory(
        GroupAbi,
        GroupBytecode,
        signer,
      );

      const groupContract = await factory.deploy(stakeAmount, initialMembers);
      await groupContract.deployed();

      console.log("Group address: ", groupContract.address);

      // const requiredAmount = await contract.requiredAmount();

      const { data: group, error } = await supabaseClient
        .from("groups")
        .insert({
          address: groupContract.address,
          chain: chain.name,
          owner: safeAddress,
          required_amount: Number(stakeAmount.toString()),
          name,
        })
        .select("*")
        .single();

      console.log("Group:", group);

      if (error) throw error;

      await supabaseClient.from("user_has_groups").insert({
        user_address: address.toLowerCase(),
        group_id: group.id,
      });

      return group.id;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
