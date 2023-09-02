import { useMutation } from "@tanstack/react-query";
import { useSigner } from "wagmi";

import { useConfirmTransaction } from "./use-confirm-transaciont";
import { useExecuteTransaction } from "./use-execute-transaction";

interface CreateGroupParams {
  txnHash: string;
  groupOwner: string;
}

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useConfirmAndExecuteTransaction = (
  options?: UseCreateRequestOptions,
) => {
  const { data: signer } = useSigner();

  const { mutateAsync: confirmTransaction } = useConfirmTransaction();
  const { mutateAsync: executeTransaction } = useExecuteTransaction();

  return useMutation(
    async ({ groupOwner, txnHash }: CreateGroupParams) => {
      if (!signer) throw new Error("No signer");

      await confirmTransaction({ txnHash, groupOwner });
      await executeTransaction({ txnHash, groupOwner });
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
