// store/chatStore.ts
import { create } from 'zustand';
import { ChatMessage } from '@/services/chat/sendChatMessage';

interface ChatStore {
  messages: Record<string, ChatMessage[]>;
  addMessage: (conversationId: string, msg: ChatMessage) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: {},
  addMessage: (conversationId, msg) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), msg],
      },
    })),
}));

interface UserStore {
  username: string;
  setUsername: (name: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: '',
  setUsername: (name: string) => set({ username: name }),
}));
