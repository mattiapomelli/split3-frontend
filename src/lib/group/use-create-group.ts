import { useMutation } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { GroupAbi, GroupBytecode } from "@abis/group";
import { deploySafe } from "@lib/safe";
import { supabaseClient } from "app/db";

import { createGroup } from "../../app/db/groups";

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
      console.log(initialMembers);
      const safe = await deploySafe(signer, [...initialMembers, address]);
      const safeAddress = await safe.getAddress();

      // Deploy the contract
      const factory = new ethers.ContractFactory(
        GroupAbi,
        GroupBytecode,
        signer,
      );

      const groupContract = await factory.deploy(
        stakeAmount,
        initialMembers,
        safeAddress,
      );
      await groupContract.deployed();

      const amount = Number(stakeAmount.toString());

      const { error } = await supabaseClient.from("users").upsert(
        initialMembers.map((address) => {
          return {
            address: address.toLowerCase(),
          };
        }),
      );

      if (error) throw error;

      const groupId = await createGroup({
        address: groupContract.address,
        chain: chain?.name,
        owner: safeAddress,
        required_amount: amount,
        name,
      });

      await supabaseClient.from("user_has_group").insert([
        ...initialMembers.map((address) => ({
          user_address: address.toLowerCase(),
          group_id: groupId,
          status: "inactive",
        })),
        {
          user_address: address.toLowerCase(),
          group_id: groupId,
          status: "active",
        },
      ]);

      return groupId;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
