import { Types } from "@requestnetwork/request-client.js";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { getRequestClient } from "./client";

export const useUserRequests = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["user-requests", address],
    queryFn: async () => {
      if (!address) throw new Error("No address");

      const requestClient = getRequestClient();
      const requests = await requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: address,
      });

      return requests.map((request) => request.getData());
    },
    enabled: !!address,
  });
};
