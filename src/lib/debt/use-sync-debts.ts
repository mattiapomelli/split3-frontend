import { useMutation } from "@tanstack/react-query";
import { useNetwork, useSigner } from "wagmi";

import { getGroupContract } from "@lib/group/get-group-contract";
import { formatAmount } from "@utils/amounts";
import { GroupExpense, GroupWithMembers } from "app/db/types";

import { upsertDebt } from "../../app/db/debts";

interface UseSyncGroupDebtsParams {
  group: GroupWithMembers;
  expense: GroupExpense;
}

interface UseSyncGroupDebtsOptions {
  onSuccess?: () => void;
}

export const useSyncGroupDebts = (options?: UseSyncGroupDebtsOptions) => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  return useMutation(
    async ({ group, expense }: UseSyncGroupDebtsParams) => {
      if (!signer || !chain) throw new Error("No address");
      // const groupMembers = await getGroupMembers(groupId);
      const GroupContract = getGroupContract(group.address, signer);

      const expenseMembers = [
        expense.user_address || "",
        ...expense.debtor_addresses.split(","),
      ];

      for await (const m1 of expenseMembers) {
        const otherMembers = expenseMembers.filter(
          (m) => m.toLowerCase() !== m1.toLowerCase(),
        );

        for await (const m2 of otherMembers) {
          const debt = await GroupContract.getDebt(m1, m2);

          const amount = Number(formatAmount(Number(debt.toString())));
          await upsertDebt(
            group.id,
            m2.toLowerCase(),
            m1.toLowerCase(),
            amount,
          );
        }
      }
      return group.id;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
