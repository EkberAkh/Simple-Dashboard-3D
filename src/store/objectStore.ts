import { create } from "zustand";
import { api } from "@/api";
import type { SceneObject, CreateObjectDto, UpdateObjectDto } from "@/api";

interface ObjectState {
  objects: SceneObject[];
  isLoading: boolean;
  error: string | null;

  fetchObjects: () => Promise<void>;
  addObject: (data: CreateObjectDto) => Promise<SceneObject>;
  updateObject: (id: string, data: UpdateObjectDto) => Promise<void>;
  removeObject: (id: string) => Promise<void>;
}

export const useObjectStore = create<ObjectState>((set, get) => ({
  objects: [],
  isLoading: false,
  error: null,

  fetchObjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const objects = await api.getObjects();
      set({ objects, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addObject: async (data) => {
    set({ error: null });
    try {
      const newObj = await api.createObject(data);
      const objects = await api.getObjects();
      set({ objects });
      return newObj;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  updateObject: async (id, data) => {
    set({ error: null });
    try {
      const current = get().objects;
      const idx = current.findIndex((o) => o.id === id);
      if (idx !== -1) {
        const updated = { ...current[idx], ...data };
        const next = [...current];
        next[idx] = updated;
        set({ objects: next });
      }

      await api.updateObject(id, data);
    } catch (err) {
      const objects = await api.getObjects();
      set({ objects, error: (err as Error).message });
      throw err;
    }
  },

  removeObject: async (id) => {
    set({ error: null });
    try {
      await api.deleteObject(id);
      const objects = await api.getObjects();
      set({ objects });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },
}));
