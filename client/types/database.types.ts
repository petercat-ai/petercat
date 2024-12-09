export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
      bot_approval: {
        Row: {
          approval_path: string | null;
          approval_status: string | null;
          bot_id: string | null;
          created_at: string;
          id: string;
          task_type: string | null;
        };
        Insert: {
          approval_path?: string | null;
          approval_status?: string | null;
          bot_id?: string | null;
          created_at?: string;
          id?: string;
          task_type?: string | null;
        };
        Update: {
          approval_path?: string | null;
          approval_status?: string | null;
          bot_id?: string | null;
          created_at?: string;
          id?: string;
          task_type?: string | null;
        };
        Relationships: [];
      };
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
          n: number | null;
          name: string;
          prompt: string | null;
          public: boolean | null;
          repo_name: string | null;
          starters: string[] | null;
          temperature: number | null;
          token_id: string | null;
          top_p: number | null;
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
          n?: number | null;
          name?: string;
          prompt?: string | null;
          public?: boolean | null;
          repo_name?: string | null;
          starters?: string[] | null;
          temperature?: number | null;
          token_id?: string | null;
          top_p?: number | null;
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
          n?: number | null;
          name?: string;
          prompt?: string | null;
          public?: boolean | null;
          repo_name?: string | null;
          starters?: string[] | null;
          temperature?: number | null;
          token_id?: string | null;
          top_p?: number | null;
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
          owner_id: string | null;
          repo_id: string | null;
          repo_name: string | null;
          robot_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id?: string | null;
          repo_id?: string | null;
          repo_name?: string | null;
          robot_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string | null;
          repo_id?: string | null;
          repo_name?: string | null;
          robot_id?: string | null;
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
          agreement_accepted: boolean | null;
          created_at: string;
          id: string;
          name: string | null;
          nickname: string | null;
          picture: string | null;
          sid: string | null;
          sub: string | null;
        };
        Insert: {
          agreement_accepted?: boolean | null;
          created_at?: string;
          id: string;
          name?: string | null;
          nickname?: string | null;
          picture?: string | null;
          sid?: string | null;
          sub?: string | null;
        };
        Update: {
          agreement_accepted?: boolean | null;
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
          repo_name: string;
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
          repo_name: string;
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
          repo_name?: string;
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
      user_rate_limit: {
        Row: {
          created_at: string;
          id: string;
          last_request: string | null;
          request_count: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_request?: string | null;
          request_count?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_request?: string | null;
          request_count?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_token_usage: {
        Row: {
          bot_id: string | null;
          created_at: string;
          date: string | null;
          id: string;
          input_token: number | null;
          output_token: number | null;
          token_id: string | null;
          total_token: number | null;
          user_id: string | null;
        };
        Insert: {
          bot_id?: string | null;
          created_at?: string;
          date?: string | null;
          id?: string;
          input_token?: number | null;
          output_token?: number | null;
          token_id?: string | null;
          total_token?: number | null;
          user_id?: string | null;
        };
        Update: {
          bot_id?: string | null;
          created_at?: string;
          date?: string | null;
          id?: string;
          input_token?: number | null;
          output_token?: number | null;
          token_id?: string | null;
          total_token?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      binary_quantize:
        | {
            Args: {
              '': string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          };
      count_rag_docs_by_sha: {
        Args: {
          file_sha_input: string;
        };
        Returns: {
          count: number;
          file_sha: string;
          repo_name: string;
          file_path: string;
        }[];
      };
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
      get_bot_stats: {
        Args: {
          filter_bot_id: string;
        };
        Returns: {
          call_cnt: number;
        }[];
      };
      get_user_stats: {
        Args: {
          filter_user_id: string;
          start_date: string;
          end_date: string;
        };
        Returns: {
          usage_date: string;
          input_tokens: number;
          output_tokens: number;
          total_tokens: number;
        }[];
      };
      halfvec_avg: {
        Args: {
          '': number[];
        };
        Returns: unknown;
      };
      halfvec_out: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      halfvec_send: {
        Args: {
          '': unknown;
        };
        Returns: string;
      };
      halfvec_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
      hnsw_bit_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnsw_halfvec_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnsw_sparsevec_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnswhandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflat_bit_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflat_halfvec_support: {
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
      l2_norm:
        | {
            Args: {
              '': unknown;
            };
            Returns: number;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: number;
          };
      l2_normalize:
        | {
            Args: {
              '': string;
            };
            Returns: string;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          };
      match_embedding_docs: {
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
      sparsevec_out: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      sparsevec_send: {
        Args: {
          '': unknown;
        };
        Returns: string;
      };
      sparsevec_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
      vector_avg: {
        Args: {
          '': number[];
        };
        Returns: string;
      };
      vector_dims:
        | {
            Args: {
              '': string;
            };
            Returns: number;
          }
        | {
            Args: {
              '': unknown;
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
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;
