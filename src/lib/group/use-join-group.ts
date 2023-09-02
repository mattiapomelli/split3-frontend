import { useMutation } from "@tanstack/react-query";
import { useAccount, useEnsName, useSigner } from "wagmi";

import { supabaseClient } from "app/db";

import { updateUserGroupStatus } from "../../app/db/user_has_groups";

import { getGroupContract } from "./get-group-contract";

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useJoinGroup = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const { data: signer } = useSigner();

  return useMutation(
    async ({ groupId }: { groupId: number }) => {
      if (!address || !signer) throw new Error("No address");

      const { data: group, error } = await supabaseClient
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();
      if (error) throw error;

      await supabaseClient.from("users").upsert({
        address: address.toLowerCase(),
        ens_label: ensName,
      });

      const groupContract = getGroupContract(group.address, signer);

      const stakeAmount = await groupContract.requiredAmount();
      const tx = await groupContract.join({ value: stakeAmount });

      await tx.wait();

      await updateUserGroupStatus(address, groupId, "active");
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
