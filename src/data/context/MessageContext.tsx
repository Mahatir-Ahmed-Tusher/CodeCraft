"use client";
import { createContext, Dispatch, SetStateAction, useState, ReactNode } from "react";

interface Message {
  role: string;
  content: string;
}

interface MessageContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};