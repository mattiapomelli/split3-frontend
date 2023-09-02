import { useMutation } from "@tanstack/react-query";
import { useNetwork, useSigner } from "wagmi";

import { getGroupContract } from "@lib/group/get-group-contract";

import { upsertDebt } from "../../app/db/debts";
import { getGroupMembers } from "../../app/db/user_has_groups";

interface UseSyncGroupDebtsParams {
  groupId: number;
  groupAddress: string;
}

interface UseSyncGroupDebtsOptions {
  onSuccess?: () => void;
}

export const useSyncGroupDebts = (options?: UseSyncGroupDebtsOptions) => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  return useMutation(
    async ({ groupId, groupAddress }: UseSyncGroupDebtsParams) => {
      if (!signer || !chain) throw new Error("No address");
      const groupMembers = await getGroupMembers(groupId);
      const GroupContract = getGroupContract(groupAddress, signer);
      for await (const m1 of groupMembers) {
        for await (const m2 of groupMembers.filter(
          (m: string) => m.toLowerCase() !== m1.toLowerCase(),
        )) {
          const debt = (await GroupContract.getDebt(m1, m2)).toNumber();
          console.log(debt);
          await upsertDebt(groupId, m2.toLowerCase(), m1.toLowerCase(), debt);
        }
      }
      return groupId;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
