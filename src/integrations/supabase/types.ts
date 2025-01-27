export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chargebacks: {
        Row: {
          amount: number
          client_name: string
          created_at: string
          id: string
          reason: string
          seller_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_name: string
          created_at?: string
          id?: string
          reason: string
          seller_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string
          id?: string
          reason?: string
          seller_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chargebacks_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_configurations: {
        Row: {
          category: string
          commission_value: number
          created_at: string
          id: string
          mobile_quantity: number | null
          package_type: Database["public"]["Enums"]["package_type"] | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          category: string
          commission_value: number
          created_at?: string
          id?: string
          mobile_quantity?: number | null
          package_type?: Database["public"]["Enums"]["package_type"] | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          commission_value?: number
          created_at?: string
          id?: string
          mobile_quantity?: number | null
          package_type?: Database["public"]["Enums"]["package_type"] | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_configurations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          active: boolean | null
          category: Database["public"]["Enums"]["company_category"]
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category: Database["public"]["Enums"]["company_category"]
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: Database["public"]["Enums"]["company_category"]
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_first_name: string
          client_last_name: string
          client_tax_id: string | null
          created_at: string
          id: string
          operator: string
          status: string
          updated_at: string
        }
        Insert: {
          client_first_name: string
          client_last_name: string
          client_tax_id?: string | null
          created_at?: string
          id?: string
          operator: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_first_name?: string
          client_last_name?: string
          client_tax_id?: string | null
          created_at?: string
          id?: string
          operator?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount: number
          created_at: string
          id: string
          sale_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          sale_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          sale_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_companies: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          team_member_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          team_member_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_companies_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_configurations: {
        Row: {
          created_at: string
          id: string
          team_leader_name: string | null
          team_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_leader_name?: string | null
          team_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          team_leader_name?: string | null
          team_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          name: string
          sales_target: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sales_target?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sales_target?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      company_category: "telecommunications" | "energy_gas"
      package_type: "3P" | "4P_MARKET" | "4P_SPECIAL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
