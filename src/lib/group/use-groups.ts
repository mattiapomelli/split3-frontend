import { useQuery } from "@tanstack/react-query";

import { supabaseClient } from "app/db";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("groups")
        .select("*, members:user_has_group(address:user_address)");
      if (error) throw error;

      return data;
    },
  });
};
