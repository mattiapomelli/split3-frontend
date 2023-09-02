import { supabaseClient } from "../index";
import { CreateGroup } from "../types";

export const getUserGroups = async (userAddress: string) => {
  const { data, error } = await supabaseClient
    .from("groups")
    .select("*, members:user_has_group!inner(user_address, status)");
  if (error) throw error;

  const filteredData = data.filter((group) => {
    const member = group.members.find(
      (member) => member.user_address === userAddress.toLowerCase(),
    );
    return member && member.status === "active";
  });

  return filteredData;
};

export const getUserInvitedGroups = async (userAddress: string) => {
  const { data, error } = await supabaseClient
    .from("groups")
    .select("*, members:user_has_group!inner(user_address, status)");
  if (error) throw error;

  const filteredData = data.filter((group) => {
    const member = group.members.find(
      (member) => member.user_address === userAddress.toLowerCase(),
    );
    return member && member.status === "inactive";
  });

  return filteredData;
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
