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

      const requestsData = requests.map((request) => request.getData());

      return requestsData.sort((a, b) => {
        const aDate = new Date(a.timestamp);
        const bDate = new Date(b.timestamp);

        return bDate.getTime() - aDate.getTime();
      });
    },
    enabled: !!address,
  });
};
