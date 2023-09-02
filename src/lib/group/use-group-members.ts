import { useQuery } from "@tanstack/react-query";

import { useGroupContract } from "./use-group-contract";

interface UseCreateRequestOptions {
  groupAddress: string;
}

export const useActiveMembers = ({ groupAddress }: UseCreateRequestOptions) => {
  const groupContract = useGroupContract({
    address: groupAddress,
  });

  return useQuery({
    queryKey: ["active-members", groupAddress],
    queryFn: async () => {
      if (!groupContract) throw new Error("No contract");

      const activeMembers = await groupContract.getActiveMembers();

      return activeMembers;
    },
  });
};
