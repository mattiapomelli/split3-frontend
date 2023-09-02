import { useMutation } from "@tanstack/react-query";
import { ethers, BigNumber } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { GroupAbi, GroupBytecode } from "@abis/group";
import { deploySafe } from "@lib/safe";

import { createGroup } from "../../app/db/groups";
import { addUserToGroup } from "../../app/db/user_has_groups";

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

      const groupId = await createGroup({
        address: groupContract.address,
        chain: chain?.name,
        owner: safeAddress,
        required_amount: Number(stakeAmount.toString()),
        name,
      });

      try {
        await addUserToGroup({
          user_address: address.toLowerCase(),
          group_id: groupId,
        });
      } catch (e) {
        console.error(e);
      }

      return groupId;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
