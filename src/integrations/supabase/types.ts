export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      crops: {
        Row: {
          created_at: string | null
          crop_type: string
          farm_location: string | null
          harvest_date: string | null
          harvest_quantity: number | null
          id: string
          notes: string | null
          planting_date: string | null
          production_cost: number | null
          selling_price: number | null
          status: string | null
          user_id: string | null
          variety: string
        }
        Insert: {
          created_at?: string | null
          crop_type: string
          farm_location?: string | null
          harvest_date?: string | null
          harvest_quantity?: number | null
          id?: string
          notes?: string | null
          planting_date?: string | null
          production_cost?: number | null
          selling_price?: number | null
          status?: string | null
          user_id?: string | null
          variety: string
        }
        Update: {
          created_at?: string | null
          crop_type?: string
          farm_location?: string | null
          harvest_date?: string | null
          harvest_quantity?: number | null
          id?: string
          notes?: string | null
          planting_date?: string | null
          production_cost?: number | null
          selling_price?: number | null
          status?: string | null
          user_id?: string | null
          variety?: string
        }
        Relationships: [
          {
            foreignKeyName: "crops_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number | null
          category: string
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_records: {
        Row: {
          cost_of_fertilizer: number
          cost_of_labour: number
          cost_of_seeds: number
          created_at: string
          crop_name: string
          farm_size: number
          harvest_date: string | null
          id: string
          location: string | null
          notes: string | null
          other_expenses: number
          planting_date: string
          profit: number
          profit_margin: number
          quantity_harvested: number | null
          selling_price: number
          total_production_cost: number
          total_revenue: number
          transportation_cost: number
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cost_of_fertilizer?: number
          cost_of_labour?: number
          cost_of_seeds?: number
          created_at?: string
          crop_name: string
          farm_size?: number
          harvest_date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          other_expenses?: number
          planting_date: string
          profit?: number
          profit_margin?: number
          quantity_harvested?: number | null
          selling_price?: number
          total_production_cost?: number
          total_revenue?: number
          transportation_cost?: number
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cost_of_fertilizer?: number
          cost_of_labour?: number
          cost_of_seeds?: number
          created_at?: string
          crop_name?: string
          farm_size?: number
          harvest_date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          other_expenses?: number
          planting_date?: string
          profit?: number
          profit_margin?: number
          quantity_harvested?: number | null
          selling_price?: number
          total_production_cost?: number
          total_revenue?: number
          transportation_cost?: number
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          category: string
          created_at: string | null
          crop_name: string
          farm_location: string | null
          farm_size: number | null
          harvest_date: string | null
          id: string
          notes: string | null
          planting_date: string | null
          quantity: number | null
          status: string | null
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          crop_name?: string
          farm_location?: string | null
          farm_size?: number | null
          harvest_date?: string | null
          id?: string
          notes?: string | null
          planting_date?: string | null
          quantity?: number | null
          status?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          crop_name?: string
          farm_location?: string | null
          farm_size?: number | null
          harvest_date?: string | null
          id?: string
          notes?: string | null
          planting_date?: string | null
          quantity?: number | null
          status?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          id: string
          transaction_date: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          description?: string | null
          id?: string
          transaction_date?: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          transaction_date?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_prices: {
        Row: {
          commodity: string
          current_price: number
          id: string
          previous_price: number
          recorded_at: string | null
          state: string
          unit: string
        }
        Insert: {
          commodity: string
          current_price: number
          id?: string
          previous_price: number
          recorded_at?: string | null
          state: string
          unit: string
        }
        Update: {
          commodity?: string
          current_price?: number
          id?: string
          previous_price?: number
          recorded_at?: string | null
          state?: string
          unit?: string
        }
        Relationships: []
      }
      income: {
        Row: {
          amount: number | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          source: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          source?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      livestock: {
        Row: {
          animal_type: string
          birth_date: string | null
          breed: string
          created_at: string | null
          current_market_value: number | null
          feeding_schedule: string
          health_status: string
          id: string
          location: string
          name: string
          notes: string
          purchase_price: number | null
          status: string
          tag_number: string
          updated_at: string | null
          user_id: string | null
          vaccination_status: string
          weight: number | null
        }
        Insert: {
          animal_type?: string
          birth_date?: string | null
          breed?: string
          created_at?: string | null
          current_market_value?: number | null
          feeding_schedule?: string
          health_status?: string
          id?: string
          location?: string
          name?: string
          notes?: string
          purchase_price?: number | null
          status?: string
          tag_number?: string
          updated_at?: string | null
          user_id?: string | null
          vaccination_status?: string
          weight?: number | null
        }
        Update: {
          animal_type?: string
          birth_date?: string | null
          breed?: string
          created_at?: string | null
          current_market_value?: number | null
          feeding_schedule?: string
          health_status?: string
          id?: string
          location?: string
          name?: string
          notes?: string
          purchase_price?: number | null
          status?: string
          tag_number?: string
          updated_at?: string | null
          user_id?: string | null
          vaccination_status?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "livestock_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_prices: {
        Row: {
          created_at: string
          crop_name: string
          current_price: number
          id: string
          previous_price: number
          price_trend: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_name: string
          current_price: number
          id?: string
          previous_price: number
          price_trend: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_name?: string
          current_price?: number
          id?: string
          previous_price?: number
          price_trend?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          date: string | null
          description: string
          id: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          community_village: string
          created_at: string
          email: string | null
          farm_name: string | null
          farm_size: string | null
          farm_size_hectares: number
          farm_type: string | null
          farming_type: string | null
          full_name: string
          gender: string | null
          id: string
          local_government_area: string
          location: string | null
          main_crop: string
          phone_number: string
          state: string
          updated_at: string
        }
        Insert: {
          community_village: string
          created_at?: string
          email?: string | null
          farm_name?: string | null
          farm_size?: string | null
          farm_size_hectares?: number
          farm_type?: string | null
          farming_type?: string | null
          full_name: string
          gender?: string | null
          id: string
          local_government_area: string
          location?: string | null
          main_crop: string
          phone_number: string
          state: string
          updated_at?: string
        }
        Update: {
          community_village?: string
          created_at?: string
          email?: string | null
          farm_name?: string | null
          farm_size?: string | null
          farm_size_hectares?: number
          farm_type?: string | null
          farming_type?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          local_government_area?: string
          location?: string | null
          main_crop?: string
          phone_number?: string
          state?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const