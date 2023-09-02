import { useQuery } from "@tanstack/react-query";
import { useAccount, useProvider, useSigner } from "wagmi";

import { getSafesByOwner } from "@lib/safe/index";

export const useGetSafesByOwner = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();
  return useQuery({
    queryKey: ["safes-by-owner"],
    queryFn: async () => {
      if (!signer && !provider) throw new Error("No signer nor provider");
      if (!address) throw new Error("No address");
      const owners = await getSafesByOwner(signer ?? provider, address);
      return owners.sort((ownerA, ownerB) => {
        // Compare the owners
        if (ownerA < ownerB) {
          return -1; // a should come before b in the sorted order
        } else if (ownerA > ownerB) {
          return 1; // a should come after b in the sorted order
        } else {
          return 0; // a and b are equal in terms of sorting
        }
      });
    },
  });
};
