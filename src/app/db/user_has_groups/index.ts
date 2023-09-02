import { supabaseClient } from "../index";
import { CreateUserHasGroup } from "../types";

export const addUserToGroup = async (userHasGroup: CreateUserHasGroup) => {
  const { data, error } = await supabaseClient
    .from("user_has_groups")
    .insert(userHasGroup)
    .select("*")
    .single();

  if (error) {
    throw error;
  }
  return data.id;
};
