import { useMutation } from "@tanstack/react-query";

import { supabaseClient } from "app/db";

interface CreateGroupParams {
  groupId: number;
}

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useSetGroupClosed = (options?: UseCreateRequestOptions) => {
  return useMutation(
    async ({ groupId }: CreateGroupParams) => {
      const { error } = await supabaseClient
        .from("groups")
        .update({
          closed: true,
        })
        .eq("id", groupId);

      if (error) throw error;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
