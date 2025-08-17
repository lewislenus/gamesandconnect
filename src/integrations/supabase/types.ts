export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          user_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          id: string
          image: string
          location: string
          price: string
          spots: number
          status: string
          time: string
          title: string
          total_spots: number
          updated_at: string
          long_description: string | null
          organizer: string | null
          flyer: Json | null
          requirements: Json | null
          includes: Json | null
          agenda: Json | null
          rating: number | null
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          image: string
          location: string
          price: string
          spots: number
          status?: string
          time: string
          title: string
          total_spots: number
          updated_at?: string
          long_description?: string | null
          organizer?: string | null
          flyer?: Json | null
          requirements?: Json | null
          includes?: Json | null
          agenda?: Json | null
          rating?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          image?: string
          location?: string
          price?: string
          spots?: number
          status?: string
          time?: string
          title?: string
          total_spots?: number
          updated_at?: string
          long_description?: string | null
          organizer?: string | null
          flyer?: Json | null
          requirements?: Json | null
          includes?: Json | null
          agenda?: Json | null
          rating?: number | null
        }
        Relationships: []
      }
      event_feedback: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          registration_id: string
          rating: number
          feedback_text: string | null
          created_at: string
          updated_at: string
          is_anonymous: boolean
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          registration_id: string
          rating: number
          feedback_text?: string | null
          created_at?: string
          updated_at?: string
          is_anonymous?: boolean
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          registration_id?: string
          rating?: number
          feedback_text?: string | null
          created_at?: string
          updated_at?: string
          is_anonymous?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "event_feedback_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_feedback_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          name: string
          email: string
          phone: string
          emergency_contact: string | null
          dietary_requirements: string | null
          additional_info: string | null
          status: string
          created_at: string
          updated_at: string
          ticket_number: string | null
          is_paid: boolean
          amount_paid: number
          payment_method: string | null
          payment_reference: string | null
          attended_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          name: string
          email: string
          phone: string
          emergency_contact?: string | null
          dietary_requirements?: string | null
          additional_info?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          ticket_number?: string | null
          is_paid?: boolean
          amount_paid?: number
          payment_method?: string | null
          payment_reference?: string | null
          attended_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string
          emergency_contact?: string | null
          dietary_requirements?: string | null
          additional_info?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          ticket_number?: string | null
          is_paid?: boolean
          amount_paid?: number
          payment_method?: string | null
          payment_reference?: string | null
          attended_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      registration_logs: {
        Row: {
          id: string
          registration_id: string
          event_id: string
          user_id: string | null
          action: string
          old_status: string | null
          new_status: string | null
          created_at: string
          admin_id: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          registration_id: string
          event_id: string
          user_id?: string | null
          action: string
          old_status?: string | null
          new_status?: string | null
          created_at?: string
          admin_id?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          registration_id?: string
          event_id?: string
          user_id?: string | null
          action?: string
          old_status?: string | null
          new_status?: string | null
          created_at?: string
          admin_id?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_logs_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ticket_templates: {
        Row: {
          id: string
          event_id: string
          template_name: string
          template_html: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          event_id: string
          template_name: string
          template_html: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          event_id?: string
          template_name?: string
          template_html?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ticket_templates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      waitlist: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          name: string
          email: string
          phone: string
          created_at: string
          status: string
          notified_at: string | null
          notification_count: number | null
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          name: string
          email: string
          phone: string
          created_at?: string
          status?: string
          notified_at?: string | null
          notification_count?: number | null
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string
          created_at?: string
          status?: string
          notified_at?: string | null
          notification_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      event_statistics: {
        Row: {
          event_id: string
          title: string
          date: string
          category: string
          total_spots: number
          available_spots: number
          registered_count: number
          fill_percentage: number
          confirmed_count: number
          pending_count: number
          cancelled_count: number
          attended_count: number
          waitlist_count: number
          average_rating: number
          feedback_count: number
          event_status: string
        }
        Relationships: [
          {
            foreignKeyName: "event_statistics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
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
