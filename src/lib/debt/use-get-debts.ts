import { useQuery } from "@tanstack/react-query";

import { getGroupDebts } from "../../app/db/debts";

interface UseGroupDebtsOptions {
  groupId: number;
}
export const useDebts = ({ groupId }: UseGroupDebtsOptions) => {
  return useQuery({
    queryKey: ["group-debts"],
    queryFn: async () => {
      return await getGroupDebts(groupId);
    },
  });
};
