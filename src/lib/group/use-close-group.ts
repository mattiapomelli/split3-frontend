import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAccount, useSigner } from "wagmi";

import { GroupAbi } from "@abis/group";
import { createTransaction, proposeTransaction } from "@lib/safe";
import { getSafe } from "@lib/safe/utils";
import { supabaseClient } from "app/db";

type CreateExpenseData = {
  groupId: number;
  group_owner: string;
  group_contract: string;
};

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useCloseGroup = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

  const { data: signer } = useSigner();

  return useMutation(
    async ({ groupId, group_owner, group_contract }: CreateExpenseData) => {
      if (!address || !signer) throw new Error("No address");

      const safe = await getSafe(group_owner, signer);
      const closeGroupTx = await createTransaction(
        safe,
        group_contract,
        new ethers.utils.Interface(GroupAbi).encodeFunctionData("close"),
      );
      const txHash = await proposeTransaction(
        signer,
        safe,
        group_owner,
        closeGroupTx,
        address,
      );

      const { error } = await supabaseClient
        .from("groups")
        .update({ close_txn_hash: txHash })
        .eq("id", groupId);

      if (error) throw error;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
