import { create } from "zustand";

interface EditorState {
  selectedObjectId: string | null;
  hoveredObjectId: string | null;
  pendingPlacement: [number, number, number] | null;

  selectObject: (id: string | null) => void;
  hoverObject: (id: string | null) => void;
  setPendingPlacement: (position: [number, number, number] | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedObjectId: null,
  hoveredObjectId: null,
  pendingPlacement: null,

  selectObject: (id) => set({ selectedObjectId: id }),
  hoverObject: (id) => set({ hoveredObjectId: id }),
  setPendingPlacement: (position) => set({ pendingPlacement: position }),
}));
