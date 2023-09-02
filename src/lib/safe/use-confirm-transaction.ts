import { SafeMultisigTransactionResponse } from "@safe-global/safe-core-sdk-types";
import { useMutation } from "@tanstack/react-query";
import { useSigner } from "wagmi";

import { toast } from "@components/basic/toast";
import { confirmTransaction } from "@lib/safe";

interface CreateGroupParams {
  txnHash: string;
  groupOwner: string;
  transaction?: SafeMultisigTransactionResponse;
}

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useConfirmTransaction = (options?: UseCreateRequestOptions) => {
  const { data: signer } = useSigner();

  return useMutation(
    async ({ groupOwner, txnHash, transaction }: CreateGroupParams) => {
      if (!signer) throw new Error("No signer");

      toast({
        title: "MultiSig Transaction Confirmation",
        description: `Confirming transaction - ${transaction?.confirmations?.length} / ${transaction?.confirmationsRequired}} Signatures`,
        type: "loading",
      });

      await confirmTransaction(txnHash, signer, groupOwner);

      toast({
        title: "MultiSig Transaction Confirmation",
        description: `Confirming transaction - ${
          transaction?.confirmations?.length || 0 + 1
        } / ${transaction?.confirmationsRequired} Signatures`,
        type: "success",
      });
    },
    {
      onSuccess: options?.onSuccess,
      onError() {
        toast({
          title: "MultiSig Transaction Confirmation",
          description: "Confirmation failed",
          type: "error",
        });
      },
    },
  );
};
