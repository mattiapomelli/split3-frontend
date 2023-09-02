import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { GroupAbi } from "@abis/group";
import { createTransaction, proposeTransaction } from "@lib/safe";
import { getSafe } from "@lib/safe/utils";
import { parseAmount } from "@utils/amounts";

import { createGroupTransfer } from "../../app/db/group_transfers";

type TransferFromGroupData = {
  amount: string;
  group_owner: string;
  group_contract: string;
  group_id: number;
  recipient_address: string;
};

interface UseCreateTransferRequestOptions {
  onSuccess?: (txHash: string) => void;
}

export const useTransferFromGroup = (
  options?: UseCreateTransferRequestOptions,
) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const { chain } = useNetwork();

  return useMutation(
    async ({
      amount,
      group_contract,
      group_owner,
      group_id,
      recipient_address,
    }: TransferFromGroupData) => {
      if (!address || !signer || !chain) throw new Error("No address");
      const safe = await getSafe(group_owner, signer);
      console.log(parseAmount(amount), recipient_address);
      const createTransferTx = await createTransaction(
        safe,
        group_contract,
        new ethers.utils.Interface(GroupAbi).encodeFunctionData("transfer", [
          parseAmount(amount),
          recipient_address,
        ]),
      );
      const txHash = await proposeTransaction(
        signer,
        safe,
        group_owner,
        createTransferTx,
        address,
      );
      await createGroupTransfer({
        group_id,
        status: "pending",
        tx_hash: txHash,
        amount: parseAmount(amount).toNumber(),
        recipient_address,
      });
      return txHash;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
