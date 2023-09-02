import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { useCreateRequest } from "@lib/request-network/use-create-request";
import { parseAmount } from "@utils/amounts";
import { supabaseClient } from "app/db";
import { Debt } from "app/db/types";

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useRequestDebtPayment = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();
  const { mutateAsync: createRequest } = useCreateRequest();

  return useMutation(
    async ({ debt }: { debt: Debt }) => {
      if (!address) throw new Error("No address");

      const amount = parseAmount(debt.amount.toString()).toString();
      const requestId = await createRequest({
        amount,
        receiverAddress: debt.creditor_address,
      });

      const { error } = await supabaseClient
        .from("debts")
        .update({
          request_id: requestId,
        })
        .eq("id", debt.id);

      if (error) throw error;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
