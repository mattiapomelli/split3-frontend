import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { getUserGroups } from "../../app/db/groups";

export const useGroups = () => {
  const { address } = useAccount();
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      return await getUserGroups(address);
    },
  });
};
