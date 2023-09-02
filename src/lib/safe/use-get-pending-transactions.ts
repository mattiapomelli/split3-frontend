import { useQuery } from "@tanstack/react-query";
import { useAccount, useProvider, useSigner } from "wagmi";

import { getPendingTransactions } from "@lib/safe/index";

interface UseGroupPendingTransactionsOptions {
  group_owner: string;
}

export const useGetPendingTransactions = ({
  group_owner,
}: UseGroupPendingTransactionsOptions) => {
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
