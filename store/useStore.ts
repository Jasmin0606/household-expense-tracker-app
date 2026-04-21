import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { Entry, Item } from "../types";

type Store = {
  items: Item[];
  entries: Entry[];

  addItem: (item: Item) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (updatedEntry: Entry) => void;
  deleteEntry: (id: string) => void;

  loadData: () => Promise<void>;

};

export const useStore = create<Store>((set) => ({
  items: [],
  entries: [],

  addItem: async (item) => {
    set((state) => {
      const updated = [...state.items, item];
      AsyncStorage.setItem("items", JSON.stringify(updated));
      return { items: updated };
    });
  },

  addEntry: async (entry) => {
    set((state) => {
      const updated = [...state.entries, entry];
      AsyncStorage.setItem("entries", JSON.stringify(updated));
      return { entries: updated };
    });
  },
  updateEntry: async (updatedEntry) => {
    set((state) => {
      const updated = state.entries.map((e) =>
        e.id === updatedEntry.id ? updatedEntry : e
      );

      AsyncStorage.setItem("entries", JSON.stringify(updated));
      return { entries: updated };
    });
  },

  deleteEntry: async (id) => {
    set((state) => {
      const updated = state.entries.filter((e) => e.id !== id);

      AsyncStorage.setItem("entries", JSON.stringify(updated));
      return { entries: updated };
    });
  },

  loadData: async () => {
    const items = await AsyncStorage.getItem("items");
    const entries = await AsyncStorage.getItem("entries");

    set({
      items: items ? JSON.parse(items) : [],
      entries: entries ? JSON.parse(entries) : [],
    });
  },
}));


