import { create } from 'zustand';
import { ChatMessage } from '@/services/chat/sendChatMessage';

interface ChatStore {
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  chatState: number; // 0: 접힘, 1: 대화 리스트 펼침, 2: 대화창(대화중)
  setActiveConversationId: (id: string | null) => void;
  setChatState: (state: number) => void;
  addMessage: (conversationId: string, msg: ChatMessage) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: {},
  activeConversationId: null,
  chatState: 0,
  setActiveConversationId: (id: string | null) =>
    set({ activeConversationId: id }),
  setChatState: (state: number) => set({ chatState: state }),
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
