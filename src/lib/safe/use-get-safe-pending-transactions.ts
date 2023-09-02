import { useQuery } from "@tanstack/react-query";
import { useAccount, useProvider, useSigner } from "wagmi";

import { getPendingTransactions } from "@lib/safe/index";

interface UseGetSafePendingTransactionsOptions {
  group_owner: string;
}

export const useGetSafePendingTransactions = ({
  group_owner,
}: UseGetSafePendingTransactionsOptions) => {
  const { address } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  return useQuery({
    queryKey: ["groups-pending-transactions", group_owner],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      return await getPendingTransactions(signer ?? provider, group_owner);
    },
  });
};
