export interface ChatAuthor {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

export interface ChatMessage {
  id: string;
  room: string;
  conversation_id: string;
  content: string;
  created_at: string;
  sender_id: string;
  author: ChatAuthor | null;
}

export interface MessagesPayload {
  success: true;
  messages: ChatMessage[];
}

export interface MessagePayload {
  success: true;
  message: ChatMessage;
}

export interface ApiErrorPayload {
  success: false;
  error: string;
}