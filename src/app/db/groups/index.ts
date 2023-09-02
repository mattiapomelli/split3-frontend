import { supabaseClient } from "../index";
import { CreateGroup, Group } from "../types";

export const getUserGroups = async (userAddress: string): Promise<Group[]> => {
  const { data, error } = await supabaseClient
    .from("groups")
    .select("*, members:user_has_group!inner(user_address)")
    .eq("members.user_address", userAddress.toLowerCase());
  if (error) throw error;
  return data;
};

export const createGroup = async (group: CreateGroup): Promise<number> => {
  const { data, error } = await supabaseClient
    .from("groups")
    .insert(group)
    .select("*")
    .single();
  if (error) throw error;
  return data!.id;
};
