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
        .select("*, members:user_has_group(address:user_address)")
        .eq("id", groupId)
        .single();
      if (error) throw error;

      return data;
    },
  });
};
