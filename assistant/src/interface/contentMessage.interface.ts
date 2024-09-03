export enum Status {
  loading = 'loading',
  success = 'success',
  error = 'error',
  end = 'end',
}

export enum ContentType {
  text = 'text',
  img = 'img',
  component = 'component',
  slot = 'slot',
}

export enum Role {
  system = 'system',
  assistant = 'assistant',
  user = 'user',
  tool = 'tool',
  knowledge = 'knowledge',
}

export interface IContentMessage {
  id: string; // Unique identifier for the conversation
  title: string; // Title of the conversation
  createAt: number; // Timestamp of when the conversation was created
  updateAt: number; // Timestamp of when the conversation was last updated
  participants: IParticipant[]; // Participants in the conversation
  messages: IMessage[]; // Messages in the conversation
}

export interface IParticipant {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

interface ImageURL {
  url: string;
  detail?: 'auto' | 'low' | 'high';
}

export interface ImageURLContentBlock {
  image_url: ImageURL;
  type: 'image_url';
}

export interface TextContentBlock {
  text: string;
  type: 'text';
}

export type MessageContent = ImageURLContentBlock | TextContentBlock;

export interface Message {
  role: string;
  content: MessageContent[];
}

export interface IMessage {
  id: string; // Unique identifier for the message
  parentId?: string; // ID of the parent message
  uid: string; // User UUID
  content: string; // Content text
  contentType: ContentType; // Type of content
  componentId?: string; // If contentType is of component type, componentId is the component's ID
  role: Role; // Role type
  ext?: IExtraInfo[]; // Additional information such as execution process/intermediate state
  status?: Status; // Current return status of the message
  createAt: number; // Timestamp of creation
  updateAt: number; // Timestamp of last update
  timeCost: string; // Time taken for the operation
}

export interface IExtraInfo {
  /** Source text for display purposes */
  source?: string;
  /** Plugin name */
  pluginName?: string;
  /** Knowledge base name */
  knowledgeName?: string;
  /** Workflow name */
  workflowName?: string;
  /** Database name */
  databaseName?: string;
  /** Individual execution status */
  status?: Status;
  /** Time taken for individual execution */
  timeCost?: string;
  /** Content for display */
  children?: React.ReactNode;
  /** Data used */
  data?: any;
}
