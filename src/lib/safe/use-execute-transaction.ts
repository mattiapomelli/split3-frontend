import { useMutation } from "@tanstack/react-query";
import { useSigner } from "wagmi";

import { toast } from "@components/basic/toast";
import { executeTransaction } from "@lib/safe";

interface CreateGroupParams {
  txnHash: string;
  groupOwner: string;
}

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useExecuteTransaction = (options?: UseCreateRequestOptions) => {
  const { data: signer } = useSigner();

  return useMutation(
    async ({ groupOwner, txnHash }: CreateGroupParams) => {
      if (!signer) throw new Error("No signer");

      toast({
        title: "MultiSig Transaction Execution",
        description: "Executing transaction",
        type: "loading",
      });

      await executeTransaction(txnHash, signer, groupOwner);

      toast({
        title: "MultiSig Transaction Execution",
        description: "Transaction executed",
        type: "success",
      });
    },
    {
      onSuccess: options?.onSuccess,
      onError() {
        toast({
          title: "MultiSig Transaction Execution",
          description: "Execution failed",
          type: "error",
        });
      },
    },
  );
};
