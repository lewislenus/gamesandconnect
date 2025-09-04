export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string;
          author: string;
          author_email: string | null;
          featured_image: string | null;
          category: 'gaming' | 'community' | 'events' | 'travel' | 'general';
          status: 'draft' | 'published' | 'archived';
          published_at: string | null;
          created_at: string;
          updated_at: string;
          slug: string;
          tags: string[] | null;
          read_time: number | null;
          views: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt: string;
          author: string;
          author_email?: string | null;
          featured_image?: string | null;
          category: 'gaming' | 'community' | 'events' | 'travel' | 'general';
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          slug: string;
          tags?: string[] | null;
          read_time?: number | null;
          views?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          excerpt?: string;
          author?: string;
          author_email?: string | null;
          featured_image?: string | null;
          category?: 'gaming' | 'community' | 'events' | 'travel' | 'general';
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          slug?: string;
          tags?: string[] | null;
          read_time?: number | null;
          views?: number | null;
        };
      };
      events: {
        Row: {
          id: number;
          title: string;
          description: string;
          long_description: string | null;
          date: string;
          time: string | null;
          location: string;
          category: string | null;
          spots: number | null;
          total_spots: number | null;
          price: string | null;
          status: string | null;
          image_url: string | null;
          additional_info: Json | null;
          time_range: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          long_description?: string | null;
          date: string;
          time?: string | null;
          location: string;
          category?: string | null;
          spots?: number | null;
          total_spots?: number | null;
          price?: string | null;
          status?: string | null;
          image_url?: string | null;
          additional_info?: Json | null;
          time_range?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          long_description?: string | null;
          date?: string;
          time?: string | null;
          location?: string;
          category?: string | null;
          spots?: number | null;
          total_spots?: number | null;
          price?: string | null;
          status?: string | null;
          image_url?: string | null;
          additional_info?: Json | null;
          time_range?: string | null;
          created_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: number;
          event_id: number | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          additional_info: Json | null;
          registered_at: string;
        };
        Insert: {
          id?: number;
          event_id?: number | null;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          additional_info?: Json | null;
          registered_at?: string;
        };
        Update: {
          id?: number;
          event_id?: number | null;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          additional_info?: Json | null;
          registered_at?: string;
        };
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

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R;
    }
      ? R
      : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R;
    }
      ? R
      : never)
  : never;