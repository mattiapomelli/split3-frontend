import { useQuery } from "@tanstack/react-query";
import { useAccount, useProvider, useSigner } from "wagmi";

import { getTransaction } from "@lib/safe/index";

interface UseGetSafePendingTransactionsOptions {
  txnHash: string;
}

export const useGetSafeTransaction = ({
  txnHash,
}: UseGetSafePendingTransactionsOptions) => {
  const { address } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  return useQuery({
    queryKey: ["safe-transaction", txnHash],
    queryFn: async () => {
      if (!txnHash) throw new Error("No txn hash");
      if (!address) throw new Error("No address");
      return await getTransaction(signer ?? provider, txnHash);
    },
  });
};
