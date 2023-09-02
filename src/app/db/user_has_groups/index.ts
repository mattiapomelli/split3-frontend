import { supabaseClient } from "../index";
import { CreateUserHasGroup } from "../types";

export const addUserToGroup = async (userHasGroup: CreateUserHasGroup) => {
  const { data, error } = await supabaseClient
    .from("user_has_groups")
    .insert(userHasGroup)
    .select("*")
    .single();

  if (error) {
    console.error("Error adding user to group: ", { error, userHasGroup });
    throw error;
  }
  return data.id;
};
