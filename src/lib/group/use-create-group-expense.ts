import { useMutation } from "@tanstack/react-query";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { createGroupExpense } from "../../app/db/group_expenses";

interface CreateGroupExpenseParams {
  amount: number;
  group_id: number;
  user_address: string;
  creditor_addresses: string[];
}

interface UseCreateRequestOptions {
  onSuccess?: (ids: number[]) => void;
}

export const useCreateGroupExpense = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  return useMutation(
    async ({
      amount,
      group_id,
      user_address,
      creditor_addresses,
    }: CreateGroupExpenseParams): Promise<number[]> => {
      if (!address || !signer || !chain) throw new Error("No address");

      return await Promise.all(
        creditor_addresses.map(async (creditor_user_address) =>
          createGroupExpense({
            amount,
            group_id,
            user_address,
            creditor_user_address,
          }),
        ),
      );
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
