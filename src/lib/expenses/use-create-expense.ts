import { useMutation } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { GroupAbi } from "@abis/group";
import { createTransaction, proposeTransaction } from "@lib/safe";
import { getSafe } from "@lib/safe/utils";
import { parseAmount } from "@utils/amounts";
import { createExpense } from "app/db/expenses";
import { CreateGroupExpense } from "app/db/types";

type CreateExpenseData = Omit<CreateGroupExpense, "id" | "amount"> & {
  payer_address: string;
  amount: BigNumber;
  group_owner: string;
  group_contract: string;
};

interface UseCreateRequestOptions {
  onSuccess?: (id: number) => void;
}

export const useCreateExpense = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const { chain } = useNetwork();

  return useMutation(
    async ({
      amount,
      group_owner,
      group_contract,
      payer_address,
      ...rest
    }: CreateExpenseData) => {
      if (!address || !signer || !chain) throw new Error("No address");
      const safe = await getSafe(group_owner, signer);
      const createExpenseTx = await createTransaction(
        safe,
        group_contract,
        new ethers.utils.Interface(GroupAbi).encodeFunctionData("addExpense", [
          payer_address, // address _payer,
          rest.title, // string _name,
          rest.debtor_addresses.split(","), // address[] calldata _debtor_address,
          parseAmount(amount.toString()),
        ]),
      );
      const txHash = await proposeTransaction(
        signer,
        safe,
        group_owner,
        createExpenseTx,
        address,
      );
      return await createExpense({
        ...rest,
        amount: Number(amount.toString()),
        user_address: payer_address.toLowerCase(),
        status: "pending",
        tx_hash: txHash,
      });
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
