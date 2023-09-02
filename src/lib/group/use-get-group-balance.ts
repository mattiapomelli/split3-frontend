import { useQuery } from "@tanstack/react-query";
import { useNetwork, useProvider, useSigner } from "wagmi";

import { formatAmount } from "@utils/amounts";
interface UseGroupBalanceOptions {
  groupAddress: string;
}
export const useGroupBalance = ({ groupAddress }: UseGroupBalanceOptions) => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { chain } = useNetwork();
  return useQuery({
    queryKey: ["group-balance", groupAddress],
    queryFn: async () => {
      if (!signer || !chain) throw new Error("No address");
      // const groupMembers = await getGroupMembers(groupId);
      const groupContractBalance = await provider.getBalance(groupAddress);
      return Number(formatAmount(Number(groupContractBalance.toString())));
    },
  });
};
