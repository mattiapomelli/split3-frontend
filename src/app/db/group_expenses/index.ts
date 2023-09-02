import { supabaseClient } from "../index";
import { CreateGroupExpense, GroupExpense } from "../types";

export const createGroupExpense = async (
  groupExpense: CreateGroupExpense,
): Promise<number> => {
  const { data, error } = await supabaseClient
    .from("group_expenses")
    .insert(groupExpense)
    .select("*")
    .single();

  if (error) {
    throw error;
  }
  return data!.id;
};

export const deleteGroupExpense = async (
  groupExpenseId: number,
): Promise<boolean> => {
  const { error } = await supabaseClient
    .from("group_expenses")
    .delete()
    .match({ id: groupExpenseId })
    .single();

  if (error) {
    throw error;
  }
  return true;
};

export const getGroupExpenses = async (
  groupId: number,
): Promise<GroupExpense[]> => {
  const { data, error } = await supabaseClient
    .from("group_expenses")
    .select("*")
    .eq("group_id", groupId);

  if (error) {
    throw error;
  }
  return data!;
};
