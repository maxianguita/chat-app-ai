import { create } from "zustand";

type Message = {
  id?: string;
  text: string;
  user: string;
};

type User = {
  email: string | null;
  uid: string;
} | null;

type ChatStore = {
  user: User;
  setUser: (user: User) => void;

  messages: Message[];
  setMessages: (msgs: Message[]) => void;

  addMessage: (msg: Message) => void; 
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
  clearMessages: () => set({ messages: [] }),
}));