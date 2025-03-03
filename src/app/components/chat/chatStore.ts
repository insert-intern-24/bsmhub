import { create } from 'zustand';

interface ChatStore {
  activeConversationId: string | null;
  chatState: number; // 0: 접힘, 1: 리스트 펼침, 2: 대화창 열림
  setActiveConversationId: (id: string | null) => void;
  setChatState: (state: number) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeConversationId: null,
  chatState: 0,
  setActiveConversationId: (id: string | null) =>
    set({ activeConversationId: id }),
  setChatState: (state: number) => set({ chatState: state }),
}));

interface UserStore {
  username: string;
  setUsername: (name: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: '',
  setUsername: (name: string) => set({ username: name }),
}));
