import { supabaseClient } from "../index";
import { CreateUserHasGroup } from "../types";

export const addUserToGroup = async (userHasGroup: CreateUserHasGroup) => {
  const { error } = await supabaseClient
    .from("user_has_group")
    .insert(userHasGroup)
    .select("*")
    .single();

  if (error) {
    console.error("Error adding user to group: ", { error, userHasGroup });
    throw error;
  }
};
