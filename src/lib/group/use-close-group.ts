import { useMutation } from "@tanstack/react-query";
import { useAccount, useSigner } from "wagmi";

import { supabaseClient } from "app/db";

import { getGroupContract } from "./get-group-contract";

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useCloseGroup = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

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

      const groupContract = getGroupContract(group.address, signer);
      const tx = await groupContract.close();

      await tx.wait();

      const { error: error2 } = await supabaseClient
        .from("groups")
        .update({
          closed: true,
        })
        .eq("group_id", groupId);

      if (error2) throw error2;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
