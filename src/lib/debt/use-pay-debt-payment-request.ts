import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { usePayRequest } from "@lib/request-network/use-pay-request";
import { supabaseClient } from "app/db";
import { Debt } from "app/db/types";

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const usePayDebtPaymentRequest = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();
  const { mutateAsync: payRequest } = usePayRequest();

  return useMutation(
    async ({ debt }: { debt: Debt }) => {
      if (!address) throw new Error("No address");
      if (!debt.request_id) throw new Error("No request id");

      await payRequest({
        requestId: debt.request_id,
      });

      const { error } = await supabaseClient
        .from("debts")
        .update({
          settled: true,
        })
        .eq("id", debt.id);

      if (error) throw error;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
