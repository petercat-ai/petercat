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
      bots: {
        Row: {
          avatar: string | null
          created_at: string
          description: string | null
          hello_message: string | null
          id: string
          label: string | null
          name: string
          prompt: string | null
          public: boolean | null
          starters: string[] | null
          uid: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          description?: string | null
          hello_message?: string | null
          id?: string
          label?: string | null
          name?: string
          prompt?: string | null
          public?: boolean | null
          starters?: string[] | null
          uid?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          description?: string | null
          hello_message?: string | null
          id?: string
          label?: string | null
          name?: string
          prompt?: string | null
          public?: boolean | null
          starters?: string[] | null
          uid?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      github_app_authorization: {
        Row: {
          code: string | null
          created_at: string
          expires_at: string | null
          id: number
          installation_id: string | null
          permissions: Json | null
          token: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          expires_at?: string | null
          id?: number
          installation_id?: string | null
          permissions?: Json | null
          token?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          expires_at?: string | null
          id?: number
          installation_id?: string | null
          permissions?: Json | null
          token?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          nickname: string | null
          picture: string | null
          sid: string | null
          sub: string | null
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          nickname?: string | null
          picture?: string | null
          sid?: string | null
          sub?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          nickname?: string | null
          picture?: string | null
          sid?: string | null
          sub?: string | null
        }
        Relationships: []
      }
      rag_docs: {
        Row: {
          commit_id: string | null
          content: string | null
          embedding: string | null
          file_path: string | null
          file_sha: string | null
          id: string
          metadata: Json | null
          repo_name: string | null
        }
        Insert: {
          commit_id?: string | null
          content?: string | null
          embedding?: string | null
          file_path?: string | null
          file_sha?: string | null
          id?: string
          metadata?: Json | null
          repo_name?: string | null
        }
        Update: {
          commit_id?: string | null
          content?: string | null
          embedding?: string | null
          file_path?: string | null
          file_sha?: string | null
          id?: string
          metadata?: Json | null
          repo_name?: string | null
        }
        Relationships: []
      }
      rag_tasks: {
        Row: {
          commit_id: string | null
          created_at: string
          from_task_id: string | null
          id: string
          metadata: Json | null
          node_type: string | null
          path: string | null
          repo_name: string | null
          status: string | null
        }
        Insert: {
          commit_id?: string | null
          created_at?: string
          from_task_id?: string | null
          id?: string
          metadata?: Json | null
          node_type?: string | null
          path?: string | null
          repo_name?: string | null
          status?: string | null
        }
        Update: {
          commit_id?: string | null
          created_at?: string
          from_task_id?: string | null
          id?: string
          metadata?: Json | null
          node_type?: string | null
          path?: string | null
          repo_name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      user_token_usage: {
        Row: {
          created_at: string
          id: number
          last_request: string | null
          request_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          last_request?: string | null
          request_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          last_request?: string | null
          request_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: {
          query: string
        }
        Returns: {
          id: string
          created_at: string
          uid: string
          avatar: string
          description: string
          prompt: string
          files: string[]
          enable_img_generation: boolean
          label: string
          name: string
          starters: string[]
          public: boolean
          updated_at: string
          hello_message: string
        }[]
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_antd_doc: {
        Args: {
          query_embedding: string
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_antd_documents: {
        Args: {
          query_embedding: string
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_antd_knowledge: {
        Args: {
          query_embedding: string
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_docs: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents: {
        Args: {
          query_embedding: string
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_rag_docs: {
        Args: {
          query_embedding: string
          filter?: Json
          repo_name?: string
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_text: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
