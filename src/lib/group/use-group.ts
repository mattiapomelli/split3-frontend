import { useQuery } from "@tanstack/react-query";

import { supabaseClient } from "app/db";

interface UseGroupOptions {
  groupId: number;
}

export const useGroup = ({ groupId }: UseGroupOptions) => {
  return useQuery({
    queryKey: ["groups", groupId],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("groups")
        .select(
          "*, members:user_has_group(user_address), expenses:group_expenses(*)",
        )
        .eq("id", groupId)
        .single();
      if (error) throw error;

      return data;
    },
  });
};
