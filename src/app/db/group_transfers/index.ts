import { supabaseClient } from "../index";
import { CreateGroupTransfer } from "../types";

export const createGroupTransfer = async (
  groupTransfer: CreateGroupTransfer,
) => {
  const { data, error } = await supabaseClient
    .from("group_transfers")
    .insert(groupTransfer)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data.id;
};

export const getGroupTransfers = async (group_id: string) => {
  const { data, error } = await supabaseClient
    .from("group_transfers")
    .select()
    .eq("group_id", group_id);
  if (error) {
    throw error;
  }
  return data;
};
