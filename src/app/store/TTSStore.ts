import { create } from 'zustand';

interface TTSItem {
  index: number;
  isPlaying: boolean;
}

interface TTSState {
  items: { [index: number]: TTSItem };
  setPlay: (index: number) => void;
  setStop: (index: number) => void;
}

export const useTTSStore = create<TTSState>((set) => ({
  items: {},
  setPlay: (index) =>
    set((state) => {
      const newItems = Object.entries(state.items).reduce((acc, [key, item]) => {
          //@ts-ignore
        acc[key] = { ...item, isPlaying: false };
        return acc;
      }, {});
          //@ts-ignore
      newItems[index] = { index, isPlaying: true };
      return {
        items: newItems,
      };
    }),
  setStop: (index) =>
    set((state) => {
      const newItems = Object.entries(state.items).reduce((acc, [key, item]) => {
        //@ts-ignore
        acc[key] = { ...item, isPlaying: false };
        return acc;
      }, {});

      return { items: newItems };
  }),
}));
