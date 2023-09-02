import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { useCreateRequest } from "@lib/request-network/use-create-request";
import { usePayRequest } from "@lib/request-network/use-pay-request";
import { parseAmount } from "@utils/amounts";
import { supabaseClient } from "app/db";
import { Debt } from "app/db/types";

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useSettleDebt = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();
  const { mutateAsync: payRequest } = usePayRequest();
  const { mutateAsync: createRequest } = useCreateRequest();

  return useMutation(
    async ({ debt, groupName }: { debt: Debt; groupName: string }) => {
      if (!address) throw new Error("No address");

      const amount = parseAmount(debt.amount.toString()).toString();
      const requestId = await createRequest({
        amount,
        receiverAddress: debt.creditor_address,
        reason: `Spontaneous payment of debt of group ${groupName}`,
        payerAddress: debt.debtor_address,
      });

      await payRequest({
        requestId,
      });

      const { error } = await supabaseClient
        .from("debts")
        .update({
          request_id: requestId,
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
