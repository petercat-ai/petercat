import axios from "axios";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

export interface RAGKnowledge {
  knowledge_id:string;
  space_id: string;
  knowledge_type: string;
  knowledge_name: string;
  source_type: string;
  embedding_model_name: string;
  file_size?: number;
  enabled: boolean;
  source_config?: string;
}

export interface RAGTask {
  task_id: string;
  status: "success" | "failed" | "running" | "pending";
  knowledge_id: string;
  error_message?: string;
  space_id: string;
  user_id?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}
export interface RAGChunk {
  chunk_id: string;
  context: string;
  knowledge_id: string;
  space_id: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  embedding?: string;
}

export interface PageParams<T> {
  page: number;                   
  page_size: number;            
  order_by?: string;            
  order_direction?: 'asc' | 'desc'; 
  eq_conditions?: Partial<Record<keyof T, any>>;
}


export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function getKnowledgeList(
  params:PageParams<RAGKnowledge>
): Promise<PageResponse<RAGKnowledge>> {
  const response = await axios.post(`${apiDomain}/api/rag/knowledge/list`,params )
  return response.data;
}
export async function getTaskList(
  params:PageParams<RAGTask>
): Promise<PageResponse<RAGTask>> {
  const response = await axios.post(`${apiDomain}/api/rag/task/list`,params )
  return response.data;
}

export async function getChunkList(
  params:PageParams<RAGChunk>
): Promise<PageResponse<RAGChunk>> {
  const response = await axios.post(`${apiDomain}/api/rag/chunk/list`,params )
  return response.data;
}

export async function reloadRepo(repo_name: string): Promise<void> {
  await axios.post(`${apiDomain}/api/rag/knowledge/repo/reload`, {
    repo_name: repo_name,
  });
}

export async function restartTask(task_id_list: string[]): Promise<void> {
  await axios.post(`${apiDomain}/api/rag/task/restart`, {
    task_id_list: task_id_list,
  });
}
