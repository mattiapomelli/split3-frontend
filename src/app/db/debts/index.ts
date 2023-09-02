import { supabaseClient } from "../index";
import { Debt } from "../types";

export const getGroupDebts = async (groupId: number): Promise<Debt[]> => {
  const { data, error } = await supabaseClient
    .from("debts")
    .select("*")
    .eq("group_id", groupId);
  if (error) throw error;
  return data ?? [];
};

export const upsertDebt = async (
  groupId: number,
  creditorAddress: string,
  debtorAddress: string,
  amount: number,
) => {
  const { error } = await supabaseClient
    .from("debts")
    .upsert({
      group_id: groupId,
      amount,
      creditor_address: creditorAddress.toLowerCase(),
      debtor_address: debtorAddress.toLowerCase(),
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error updating debt: ", {
      error,
      groupId,
      creditorAddress,
      debtorAddress,
      amount,
    });
    throw error;
  }
};
