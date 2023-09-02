import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { getUserInvitedGroups } from "../../app/db/groups";

export const useInvitedGroups = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["invited-groups"],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      return await getUserInvitedGroups(address);
    },
  });
};
