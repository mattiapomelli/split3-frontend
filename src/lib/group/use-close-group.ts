import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAccount, useSigner } from "wagmi";

import { GroupAbi } from "@abis/group";
import { createTransaction } from "@lib/safe";
import { getSafe } from "@lib/safe/utils";
import { supabaseClient } from "app/db";

import { getGroupContract } from "./get-group-contract";

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useCloseGroup = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

  const { data: signer } = useSigner();

  return useMutation(
    async ({ groupId }: { groupId: number; group_owner: string }) => {
      if (!address || !signer) throw new Error("No address");

      const safe = await getSafe(group_owner, signer);
      const closeGroupTx = await createTransaction(
        safe,
        group_contract,
        new ethers.utils.Interface(GroupAbi).encodeFunctionData("addExpense", [
          payer_address, // address _payer,
          rest.title, // string _name,
          rest.debtor_addresses.split(","), // address[] calldata _debtor_address,
          parseAmount(amount.toString()),
        ]),
      );
      const txHash = await proposeTransaction(
        signer,
        safe,
        group_owner,
        createExpenseTx,
        address,
      );

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
