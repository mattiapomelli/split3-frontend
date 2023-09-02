export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          address: string;
          chain: string;
          id: number;
          name: string | null;
          owner: string;
          required_amount: number | null;
        };
        Insert: {
          address: string;
          chain: string;
          id?: number;
          name?: string | null;
          owner: string;
          required_amount?: number | null;
        };
        Update: {
          address?: string;
          chain?: string;
          id?: number;
          name?: string | null;
          owner?: string;
          required_amount?: number | null;
        };
        Relationships: [];
      };
      group_expenses: {
        Row: {
          amount: number | null;
          creditor_user_address: string;
          group_id: number | null;
          id: number;
          user_address: string | null;
        };
        Insert: {
          amount?: number | null;
          creditor_user_address: string;
          group_id?: number | null;
          id?: number;
          user_address?: string | null;
        };
        Update: {
          amount?: number | null;
          creditor_user_address?: string;
          group_id?: number | null;
          id?: number;
          user_address?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "group_expenses_group_id_fkey";
            columns: ["group_id"];
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_expenses_user_address_fkey";
            columns: ["user_address"];
            referencedRelation: "users";
            referencedColumns: ["address"];
          },
        ];
      };
      user_has_group: {
        Row: {
          created_at: string;
          group_id: number;
          user_address: string;
        };
        Insert: {
          created_at?: string;
          group_id: number;
          user_address: string;
        };
        Update: {
          created_at?: string;
          group_id?: number;
          user_address?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_has_group_group_id_fkey";
            columns: ["group_id"];
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_has_group_user_address_fkey";
            columns: ["user_address"];
            referencedRelation: "users";
            referencedColumns: ["address"];
          },
        ];
      };
      users: {
        Row: {
          address: string;
          ens_label: string | null;
        };
        Insert: {
          address: string;
          ens_label?: string | null;
        };
        Update: {
          address?: string;
          ens_label?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type UserHasGroup =
  Database["public"]["Tables"]["user_has_group"]["Row"];
export type GroupExpense =
  Database["public"]["Tables"]["group_expenses"]["Row"];
export type CreateGroupExpense =
  Database["public"]["Tables"]["group_expenses"]["Insert"];
