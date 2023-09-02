import { supabaseClient } from "../index";

import { User } from "./interface";

const COLLECTION_NAME = "users";

export const getUserByAddress = async (
  address: string,
): Promise<User | null> => {
  const { data, error } = await supabaseClient
    .from(COLLECTION_NAME)
    .select("*")
    .eq("address", address)
    .single();
  if (error) {
    return null;
  }
  return data;
};

export const createUser = async (user: User): Promise<string> => {
  const { error } = await supabaseClient
    .from(COLLECTION_NAME)
    .upsert(user, { onConflict: "address" });
  if (error) {
    throw error;
  }
  return user.address;
};
