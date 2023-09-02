import { useMutation } from "@tanstack/react-query";
import { useSigner } from "wagmi";

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

      await executeTransaction(txnHash, signer, groupOwner);
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
