import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { useGroupContract } from "./use-group-contract";

interface UseCreateRequestOptions {
  groupAddress: string;
  onSuccess?: () => void;
}

export const useJoinGroup = (options: UseCreateRequestOptions) => {
  const { address } = useAccount();
  const groupContract = useGroupContract({
    address: options.groupAddress,
  });

  return useMutation(
    async () => {
      if (!address || !groupContract) throw new Error("No address");

      // Deploy the contract
      const stakeAmount = await groupContract.requiredAmount();
      const tx = await groupContract.join({ value: stakeAmount });

      await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
