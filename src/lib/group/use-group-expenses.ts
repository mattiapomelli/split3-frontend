import { useQuery } from "@tanstack/react-query";

import { getGroupExpenses } from "../../app/db/group_expenses";
interface UseGroupExpensesOptions {
  groupId: number;
}
export const useGroupExpenses = ({ groupId }: UseGroupExpensesOptions) => {
  return useQuery({
    queryKey: ["groups", groupId],
    queryFn: async () => {
      return await getGroupExpenses(groupId);
    },
  });
};
