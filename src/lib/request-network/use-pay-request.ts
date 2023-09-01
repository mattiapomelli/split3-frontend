import {
  approveErc20,
  hasErc20Approval,
  hasSufficientFunds,
  payRequest,
} from "@requestnetwork/payment-processor";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { getRequestClient } from "./client";

interface UsePayRequestOptions {
  onSuccess?: () => void;
}

export const usePayRequest = (options?: UsePayRequestOptions) => {
  const { address } = useAccount();

  return useMutation(
    async ({ requestId }: { requestId: string }) => {
      if (!address) throw new Error("No address");

      const requestClient = getRequestClient();
      const request = await requestClient.fromRequestId(requestId);
      const requestData = request.getData();

      console.log("Request data: ", requestData);

      const payerHasSufficientFunds = await hasSufficientFunds(
        requestData,
        address,
      );

      console.log("Payer has sufficient funds: ", payerHasSufficientFunds);

      const payerHasErc20Approval = await hasErc20Approval(
        requestData,
        address,
      );
      console.log("Payer has Erc20 approval: ", payerHasErc20Approval);

      if (!payerHasErc20Approval) {
        const approvalTx = await approveErc20(requestData);
        await approvalTx.wait();
      }

      const tx = await payRequest(requestData);
      await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
