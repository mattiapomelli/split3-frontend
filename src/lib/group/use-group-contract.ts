import { useContract, useProvider, useSigner } from "wagmi";

import { GroupAbi } from "@abis/group";
import { SplitWiseGroup } from "@abis/types/group";
// import { GROUP_ADDRESS } from "@constants/addresses";
// import { CHAIN } from "@constants/chains";

interface UseGroupContractOptions {
  address: string;
  withSigner?: boolean;
}

export const useGroupContract = ({
  address,
  withSigner = true,
}: UseGroupContractOptions) => {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useContract({
    address,
    abi: GroupAbi,
    signerOrProvider: withSigner ? signer : provider,
  }) as SplitWiseGroup | null;
};
