import { useMutation } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { createExpense } from "app/db/expenses";
import { CreateGroupExpense } from "app/db/types";

type CreateExpenseData = Omit<CreateGroupExpense, "id" | "amount"> & {
  amount: BigNumber;
};

interface UseCreateRequestOptions {
  onSuccess?: (id: number) => void;
}

export const useCreateExpense = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  return useMutation(
    async ({ amount, ...rest }: CreateExpenseData) => {
      if (!address || !signer || !chain) throw new Error("No address");

      const expenseId = await createExpense({
        ...rest,
        amount: Number(amount.toString()),
        user_address: address.toLowerCase(),
      });

      return expenseId;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
