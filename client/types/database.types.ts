export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bots: {
        Row: {
          avatar: string | null;
          created_at: string;
          description: string | null;
          domain_whitelist: string[] | null;
          hello_message: string | null;
          id: string;
          label: string | null;
          llm: string | null;
          name: string;
          prompt: string | null;
          public: boolean | null;
          repo_name: string | null;
          starters: string[] | null;
          uid: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string;
          description?: string | null;
          domain_whitelist?: string[] | null;
          hello_message?: string | null;
          id?: string;
          label?: string | null;
          llm?: string | null;
          name?: string;
          prompt?: string | null;
          public?: boolean | null;
          repo_name?: string | null;
          starters?: string[] | null;
          uid?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar?: string | null;
          created_at?: string;
          description?: string | null;
          domain_whitelist?: string[] | null;
          hello_message?: string | null;
          id?: string;
          label?: string | null;
          llm?: string | null;
          name?: string;
          prompt?: string | null;
          public?: boolean | null;
          repo_name?: string | null;
          starters?: string[] | null;
          uid?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      git_issue_tasks: {
        Row: {
          bot_id: string | null;
          created_at: string;
          from_task_id: string | null;
          id: string;
          issue_id: string | null;
          node_type: string | null;
          page_index: number | null;
          repo_name: string | null;
          status: string | null;
        };
        Insert: {
          bot_id?: string | null;
          created_at?: string;
          from_task_id?: string | null;
          id?: string;
          issue_id?: string | null;
          node_type?: string | null;
          page_index?: number | null;
          repo_name?: string | null;
          status?: string | null;
        };
        Update: {
          bot_id?: string | null;
          created_at?: string;
          from_task_id?: string | null;
          id?: string;
          issue_id?: string | null;
          node_type?: string | null;
          page_index?: number | null;
          repo_name?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      github_app_authorization: {
        Row: {
          code: string | null;
          created_at: string;
          expires_at: string | null;
          id: number;
          installation_id: string | null;
          permissions: Json | null;
          token: string | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          expires_at?: string | null;
          id?: number;
          installation_id?: string | null;
          permissions?: Json | null;
          token?: string | null;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          expires_at?: string | null;
          id?: number;
          installation_id?: string | null;
          permissions?: Json | null;
          token?: string | null;
        };
        Relationships: [];
      };
      github_repo_config: {
        Row: {
          created_at: string;
          id: string;
          repo_name: string | null;
          robot_id: string | null;
          owner_id: string | null;
          repo_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          repo_name?: string | null;
          robot_id?: string | null;
          owner_id?: string | null;
          repo_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          repo_name?: string | null;
          robot_id?: string | null;
          owner_id?: string | null;
          repo_id?: string | null;
        };
        Relationships: [];
      };
      llm_tokens: {
        Row: {
          created_at: string;
          encrypted_token: string | null;
          free: boolean | null;
          id: number;
          limit: number | null;
          llm: string | null;
          slug: string | null;
          token: string | null;
          usage: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          encrypted_token?: string | null;
          free?: boolean | null;
          id?: number;
          limit?: number | null;
          llm?: string | null;
          slug?: string | null;
          token?: string | null;
          usage?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          encrypted_token?: string | null;
          free?: boolean | null;
          id?: number;
          limit?: number | null;
          llm?: string | null;
          slug?: string | null;
          token?: string | null;
          usage?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
          nickname: string | null;
          picture: string | null;
          sid: string | null;
          sub: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          name?: string | null;
          nickname?: string | null;
          picture?: string | null;
          sid?: string | null;
          sub?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
          nickname?: string | null;
          picture?: string | null;
          sid?: string | null;
          sub?: string | null;
        };
        Relationships: [];
      };
      rag_docs: {
        Row: {
          bot_id: string | null;
          commit_id: string | null;
          content: string | null;
          embedding: string | null;
          file_path: string | null;
          file_sha: string | null;
          id: string;
          metadata: Json | null;
          repo_name: string | null;
          update_timestamp: string | null;
        };
        Insert: {
          bot_id?: string | null;
          commit_id?: string | null;
          content?: string | null;
          embedding?: string | null;
          file_path?: string | null;
          file_sha?: string | null;
          id?: string;
          metadata?: Json | null;
          repo_name?: string | null;
          update_timestamp?: string | null;
        };
        Update: {
          bot_id?: string | null;
          commit_id?: string | null;
          content?: string | null;
          embedding?: string | null;
          file_path?: string | null;
          file_sha?: string | null;
          id?: string;
          metadata?: Json | null;
          repo_name?: string | null;
          update_timestamp?: string | null;
        };
        Relationships: [];
      };
      rag_issues: {
        Row: {
          bot_id: string | null;
          comment_id: string | null;
          content: string | null;
          embedding: string | null;
          id: string;
          issue_id: string | null;
          metadata: Json | null;
          repo_name: string | null;
          update_timestamp: string;
        };
        Insert: {
          bot_id?: string | null;
          comment_id?: string | null;
          content?: string | null;
          embedding?: string | null;
          id?: string;
          issue_id?: string | null;
          metadata?: Json | null;
          repo_name?: string | null;
          update_timestamp?: string;
        };
        Update: {
          bot_id?: string | null;
          comment_id?: string | null;
          content?: string | null;
          embedding?: string | null;
          id?: string;
          issue_id?: string | null;
          metadata?: Json | null;
          repo_name?: string | null;
          update_timestamp?: string;
        };
        Relationships: [];
      };
      rag_tasks: {
        Row: {
          bot_id: string | null;
          commit_id: string | null;
          created_at: string;
          from_task_id: string | null;
          id: string;
          metadata: Json | null;
          node_type: string | null;
          page_index: number | null;
          path: string | null;
          repo_name: string | null;
          sha: string | null;
          status: string | null;
        };
        Insert: {
          bot_id?: string | null;
          commit_id?: string | null;
          created_at?: string;
          from_task_id?: string | null;
          id?: string;
          metadata?: Json | null;
          node_type?: string | null;
          page_index?: number | null;
          path?: string | null;
          repo_name?: string | null;
          sha?: string | null;
          status?: string | null;
        };
        Update: {
          bot_id?: string | null;
          commit_id?: string | null;
          created_at?: string;
          from_task_id?: string | null;
          id?: string;
          metadata?: Json | null;
          node_type?: string | null;
          page_index?: number | null;
          path?: string | null;
          repo_name?: string | null;
          sha?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      user_llm_tokens: {
        Row: {
          created_at: string;
          encrypted_token: string | null;
          id: string;
          llm: string | null;
          sanitized_token: string | null;
          slug: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          encrypted_token?: string | null;
          id?: string;
          llm?: string | null;
          sanitized_token?: string | null;
          slug?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          encrypted_token?: string | null;
          id?: string;
          llm?: string | null;
          sanitized_token?: string | null;
          slug?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_token_usage: {
        Row: {
          created_at: string;
          id: number;
          last_request: string | null;
          request_count: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          last_request?: string | null;
          request_count?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          last_request?: string | null;
          request_count?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      execute_sql: {
        Args: {
          query: string;
        };
        Returns: {
          id: string;
          created_at: string;
          uid: string;
          avatar: string;
          description: string;
          prompt: string;
          files: string[];
          enable_img_generation: boolean;
          label: string;
          name: string;
          starters: string[];
          public: boolean;
          updated_at: string;
          hello_message: string;
        }[];
      };
      hnswhandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      match_antd_doc: {
        Args: {
          query_embedding: string;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      match_antd_documents: {
        Args: {
          query_embedding: string;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      match_antd_knowledge: {
        Args: {
          query_embedding: string;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      match_docs: {
        Args: {
          query_embedding: string;
          match_count?: number;
          filter?: Json;
        };
        Returns: {
          id: number;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      match_documents: {
        Args: {
          query_embedding: string;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      match_rag_docs: {
        Args: {
          query_embedding: string;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          embedding: string;
          similarity: number;
        }[];
      };
      match_text: {
        Args: {
          query_embedding: string;
          match_count?: number;
          filter?: Json;
        };
        Returns: {
          id: number;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      rag_docs: {
        Args: {
          query_embedding: string;
          filter?: Json;
          query_repo_name?: string;
        };
        Returns: {
          id: string;
          metadata: Json;
          content: string;
          similarity: number;
        }[];
      };
      vector_avg: {
        Args: {
          '': number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          '': string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          '': string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

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
