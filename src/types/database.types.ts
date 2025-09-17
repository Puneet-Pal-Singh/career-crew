export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          cover_letter_snippet: string | null
          created_at: string
          id: string
          job_id: number | null
          linkedin_profile_url: string | null
          resume_file_path: string | null
          seeker_id: string
          status: Database["public"]["Enums"]["application_status_option"]
        }
        Insert: {
          cover_letter_snippet?: string | null
          created_at?: string
          id?: string
          job_id?: number | null
          linkedin_profile_url?: string | null
          resume_file_path?: string | null
          seeker_id: string
          status?: Database["public"]["Enums"]["application_status_option"]
        }
        Update: {
          cover_letter_snippet?: string | null
          created_at?: string
          id?: string
          job_id?: number | null
          linkedin_profile_url?: string | null
          resume_file_path?: string | null
          seeker_id?: string
          status?: Database["public"]["Enums"]["application_status_option"]
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_email: string | null
          application_url: string | null
          company_logo_url: string | null
          company_name: string
          created_at: string
          description: string
          employer_id: string
          id: number
          is_remote: boolean
          job_type: Database["public"]["Enums"]["job_type_option"]
          location: string
          requirements: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          status: Database["public"]["Enums"]["job_status"]
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          application_email?: string | null
          application_url?: string | null
          company_logo_url?: string | null
          company_name: string
          created_at?: string
          description: string
          employer_id: string
          id?: number
          is_remote?: boolean
          job_type: Database["public"]["Enums"]["job_type_option"]
          location: string
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"]
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          application_email?: string | null
          application_url?: string | null
          company_logo_url?: string | null
          company_name?: string
          created_at?: string
          description?: string
          employer_id?: string
          id?: number
          is_remote?: boolean
          job_type?: Database["public"]["Enums"]["job_type_option"]
          location?: string
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"]
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          full_name: string | null
          has_completed_onboarding: boolean
          id: string
          intended_role: Database["public"]["Enums"]["user_role"] | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          email: string
          full_name?: string | null
          has_completed_onboarding?: boolean
          id: string
          intended_role?: Database["public"]["Enums"]["user_role"] | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          email?: string
          full_name?: string | null
          has_completed_onboarding?: boolean
          id?: string
          intended_role?: Database["public"]["Enums"]["user_role"] | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_employer_applications: {
        Args:
          | {
              employer_id_param: string
              job_id_filter?: number
              page_number: number
              page_size: number
              status_filter?: Database["public"]["Enums"]["application_status_option"]
            }
          | {
              employer_id_param: string
              page_number: number
              page_size: number
            }
        Returns: {
          applicant_name: string
          applied_at: string
          id: string
          job_title: string
          status: Database["public"]["Enums"]["application_status_option"]
          total_count: number
        }[]
      }
      get_employer_recent_applications: {
        Args: { employer_id_param: string }
        Returns: {
          applicant_name: string
          applied_at: string
          id: string
          job_title: string
          status: Database["public"]["Enums"]["application_status_option"]
        }[]
      }
    }
    Enums: {
      application_status_option:
        | "SUBMITTED"
        | "VIEWED"
        | "INTERVIEWING"
        | "OFFERED"
        | "HIRED"
        | "REJECTED_BY_EMPLOYER"
        | "WITHDRAWN_BY_SEEKER"
      job_status:
        | "PENDING_APPROVAL"
        | "APPROVED"
        | "REJECTED"
        | "ARCHIVED"
        | "FILLED"
        | "DRAFT"
      job_type_option:
        | "FULL_TIME"
        | "PART_TIME"
        | "CONTRACT"
        | "INTERNSHIP"
        | "TEMPORARY"
      user_role: "JOB_SEEKER" | "EMPLOYER" | "ADMIN"
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
    Enums: {
      application_status_option: [
        "SUBMITTED",
        "VIEWED",
        "INTERVIEWING",
        "OFFERED",
        "HIRED",
        "REJECTED_BY_EMPLOYER",
        "WITHDRAWN_BY_SEEKER",
      ],
      job_status: [
        "PENDING_APPROVAL",
        "APPROVED",
        "REJECTED",
        "ARCHIVED",
        "FILLED",
        "DRAFT",
      ],
      job_type_option: [
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "INTERNSHIP",
        "TEMPORARY",
      ],
      user_role: ["JOB_SEEKER", "EMPLOYER", "ADMIN"],
    },
  },
} as const
