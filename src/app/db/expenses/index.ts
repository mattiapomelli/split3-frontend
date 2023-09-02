import { supabaseClient } from "../index";
import { CreateGroupExpense } from "../types";

export const createExpense = async (
  expense: CreateGroupExpense,
): Promise<number> => {
  const { data, error } = await supabaseClient
    .from("group_expenses")
    .insert(expense)
    .select("*")
    .single();
  if (error) throw error;

  return data.id;
};
