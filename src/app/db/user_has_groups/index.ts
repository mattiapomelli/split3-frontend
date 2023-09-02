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

export const updateUserGroupStatus = async (
  userAddress: string,
  groupId: number,
  status: string,
) => {
  const { error } = await supabaseClient
    .from("user_has_group")
    .update({
      status,
    })
    .eq("user_address", userAddress.toLowerCase())
    .eq("group_id", groupId)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating user status in group: ", {
      error,
      userAddress,
      groupId,
      status,
    });
    throw error;
  }
};

export const getGroupMembers = async (groupId: number): Promise<string[]> => {
  const { data, error } = await supabaseClient
    .from("user_has_group")
    .select("user_address")
    .eq("group_id", groupId)
    .eq("status", "active");
  if (error) throw error;
  return data?.map((d) => d.user_address) ?? [];
};
