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
      company_configurations: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_configurations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_configurations"
            referencedColumns: ["id"]
          },
        ]
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
      operator_configurations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          operator: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          operator: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          operator?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_configurations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      service_configurations: {
        Row: {
          base_commission: number
          created_at: string
          id: string
          is_multiplier: boolean | null
          mobile_credits_multiplier: boolean | null
          mobile_service_value: number | null
          operator_config_id: string | null
          service_type: string
          target_commission_increase: number | null
          target_sales_count: number | null
          updated_at: string
        }
        Insert: {
          base_commission?: number
          created_at?: string
          id?: string
          is_multiplier?: boolean | null
          mobile_credits_multiplier?: boolean | null
          mobile_service_value?: number | null
          operator_config_id?: string | null
          service_type: string
          target_commission_increase?: number | null
          target_sales_count?: number | null
          updated_at?: string
        }
        Update: {
          base_commission?: number
          created_at?: string
          id?: string
          is_multiplier?: boolean | null
          mobile_credits_multiplier?: boolean | null
          mobile_service_value?: number | null
          operator_config_id?: string | null
          service_type?: string
          target_commission_increase?: number | null
          target_sales_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_configurations_operator_config_id_fkey"
            columns: ["operator_config_id"]
            isOneToOne: false
            referencedRelation: "operator_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      site_configurations: {
        Row: {
          created_at: string
          dark_logo_url: string | null
          favicon_url: string | null
          id: string
          light_logo_url: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          dark_logo_url?: string | null
          favicon_url?: string | null
          id?: string
          light_logo_url?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          dark_logo_url?: string | null
          favicon_url?: string | null
          id?: string
          light_logo_url?: string | null
          updated_at?: string
          updated_by?: string | null
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
          team_code: string | null
          team_leader_name: string | null
          team_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_code?: string | null
          team_leader_name?: string | null
          team_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          team_code?: string | null
          team_leader_name?: string | null
          team_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          invitation_code: string
          team_id: string | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          invitation_code: string
          team_id?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          invitation_code?: string
          team_id?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          commercial_code: string | null
          created_at: string
          id: string
          name: string
          sales_target: number
          tax_id: string | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          commercial_code?: string | null
          created_at?: string
          id?: string
          name: string
          sales_target?: number
          tax_id?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          commercial_code?: string | null
          created_at?: string
          id?: string
          name?: string
          sales_target?: number
          tax_id?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "ADMIN" | "LIDER" | "BACKOFFICE" | "VENDEDOR"
      company_category: "telecommunications" | "energy_gas"
      operator_type:
        | "MEO"
        | "NOS"
        | "VODAFONE"
        | "NOWO"
        | "ENDESA"
        | "IBERDROLA"
        | "REPSOL"
        | "GALP"
        | "G9"
        | "IBELECTRA"
        | "EDP"
        | "SU_ELETRICIDADE"
        | "GOLD_ENERGY"
        | "MEO_ENERGIA"
        | "PLENITUDE"
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
