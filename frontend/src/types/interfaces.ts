export interface Message {
  id: string;
  text: string;
  sender: string;
  connections: string;
}

export type MessageSend = Omit<Message, "connections">;
